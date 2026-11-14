import { parseM3U8, getSegmentsForRange, HlsSegment } from './hls-parser';
import { transmuxTsChunksToBlob } from './hls-remuxer';
import { TrimProgress } from '../../types/trim';

export interface HlsFetchResult {
  blob: Blob;
  mimeType: string;
  duration: number;
  fileSize: number;
  segmentCount: number;
  isFmp4: boolean;
}

/**
 * Downloads a byte buffer with optional AbortSignal and ByteRange headers
 */
async function fetchBufferWithRange(
  url: string,
  byteRange?: { offset: number; length: number },
  signal?: AbortSignal
): Promise<ArrayBuffer> {
  const headers: Record<string, string> = {};
  if (byteRange) {
    const end = byteRange.offset + byteRange.length - 1;
    headers['Range'] = `bytes=${byteRange.offset}-${end}`;
  }

  const res = await fetch(url, { headers, signal });
  if (!res.ok && res.status !== 206) {
    throw new Error(`Failed to download HLS segment HTTP ${res.status}: ${url}`);
  }
  return await res.arrayBuffer();
}

/**
 * Concurrency worker pool for parallel downloading
 */
async function runWithConcurrencyPool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let currentIndex = 0;

  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (currentIndex < items.length) {
      const idx = currentIndex++;
      results[idx] = await fn(items[idx], idx);
    }
  });

  await Promise.all(workers);
  return results;
}

/**
 * Core HLS Fast Segment Downloader:
 * Resolves manifest, plans segment slice, downloads chunks concurrently,
 * and concatenates them into a playable clip without video playback.
 */
export async function fetchHlsRangeClip(
  manifestUrl: string,
  startTime: number,
  endTime: number,
  options?: {
    signal?: AbortSignal;
    concurrency?: number;
    onProgress?: (prog: TrimProgress) => void;
  }
): Promise<HlsFetchResult> {
  const signal = options?.signal;
  const onProgress = options?.onProgress;
  const concurrency = options?.concurrency || 4;

  if (onProgress) {
    onProgress({
      stage: 'inspecting',
      percent: 5,
      message: 'Fetching HLS stream playlist manifest...',
    });
  }

  // 1. Fetch manifest
  const manifestRes = await fetch(manifestUrl, { signal });
  if (!manifestRes.ok) {
    throw new Error(`Failed to load HLS manifest HTTP ${manifestRes.status}`);
  }

  const manifestText = await manifestRes.text();
  let playlist = parseM3U8(manifestText, manifestUrl);

  // If master playlist, select the highest bandwidth variant
  if (playlist.isMaster && playlist.variants.length > 0) {
    const bestVariant = playlist.variants[0];
    if (onProgress) {
      onProgress({
        stage: 'inspecting',
        percent: 10,
        message: `Selected best video quality stream (${bestVariant.resolution || 'High'} quality)...`,
      });
    }

    const variantRes = await fetch(bestVariant.url, { signal });
    if (!variantRes.ok) {
      throw new Error(`Failed to load variant playlist HTTP ${variantRes.status}`);
    }
    const variantText = await variantRes.text();
    playlist = parseM3U8(variantText, bestVariant.url);
  }

  if (playlist.segments.length === 0) {
    throw new Error('No media segments found in HLS stream.');
  }

  // 2. Select segments overlapping the requested range
  const { segments: selectedSegments, actualStartTime, actualEndTime } = getSegmentsForRange(
    playlist.segments,
    startTime,
    endTime
  );

  if (selectedSegments.length === 0) {
    throw new Error(`No HLS video segments found matching range ${startTime}s - ${endTime}s.`);
  }

  const clipDuration = Math.max(0.1, actualEndTime - actualStartTime);

  if (onProgress) {
    onProgress({
      stage: 'downloading',
      percent: 15,
      message: `Fetching ${selectedSegments.length} stream chunks in parallel...`,
    });
  }

  // 3. Download fMP4 Init Segment if present (#EXT-X-MAP)
  let initSegmentBuffer: ArrayBuffer | null = null;
  const isFmp4 = Boolean(playlist.initSegmentUrl || selectedSegments[0]?.url.includes('.m4s'));

  if (playlist.initSegmentUrl) {
    initSegmentBuffer = await fetchBufferWithRange(playlist.initSegmentUrl, undefined, signal);
  }

  // 4. Concurrently download all selected segment chunks as Blobs to prevent V8 heap exhaustion
  let completedCount = 0;
  const totalCount = selectedSegments.length;

  const segmentBlobs = await runWithConcurrencyPool<HlsSegment, Blob>(
    selectedSegments,
    concurrency,
    async (seg) => {
      if (signal?.aborted) throw new Error('Operation cancelled by user.');

      const buf = await fetchBufferWithRange(seg.url, seg.byteRange, signal);
      const blobChunk = new Blob([buf]);
      completedCount++;

      if (onProgress) {
        const percent = Math.min(95, 15 + Math.round((completedCount / totalCount) * 80));
        onProgress({
          stage: 'downloading',
          percent,
          message: `Downloading HLS chunks: ${completedCount}/${totalCount} (${percent}%)`,
        });
      }

      return blobChunk;
    }
  );

  if (signal?.aborted) throw new Error('Operation cancelled by user.');

  if (onProgress) {
    onProgress({
      stage: 'finalizing',
      percent: 96,
      message: 'Assembling and finalizing video stream...',
    });
  }

  // 5. Assemble and remux video stream with zero memory spike
  let finalBlob: Blob;
  let mimeType = 'video/mp4';
  let isFinalFmp4 = true;

  if (isFmp4) {
    const fmp4Parts: BlobPart[] = [];
    if (initSegmentBuffer) fmp4Parts.push(initSegmentBuffer);
    for (const b of segmentBlobs) {
      if (b) fmp4Parts.push(b);
    }
    finalBlob = new Blob(fmp4Parts, { type: 'video/mp4' });
  } else if (selectedSegments.length <= 40) {
    // For small trims (<= 40 chunks, ~1-3 mins), transmux to fragmented MP4 for HTML5 preview
    if (onProgress) {
      onProgress({
        stage: 'finalizing',
        percent: 96,
        message: 'Transmuxing stream to MP4...',
      });
    }

    try {
      const arrayBuffers: ArrayBuffer[] = [];
      for (const b of segmentBlobs) {
        arrayBuffers.push(await b.arrayBuffer());
      }

      finalBlob = await transmuxTsChunksToBlob(arrayBuffers, (pct) => {
        if (onProgress) {
          const overallPct = 96 + Math.round((pct / 100) * 3);
          onProgress({
            stage: 'finalizing',
            percent: Math.min(99, overallPct),
            message: `Transmuxing stream to MP4: ${pct}%`,
          });
        }
      });
    } catch (remuxErr) {
      console.warn('Streaming remux error, fallback to direct stream:', remuxErr);
      const remaining = segmentBlobs.filter(Boolean) as BlobPart[];
      finalBlob = new Blob(remaining, { type: 'video/mp2t' });
      mimeType = 'video/mp2t';
      isFinalFmp4 = false;
    }
  } else {
    // For large clips or full lecture downloads (> 40 chunks, e.g. 774 chunks / 550MB):
    // Directly assemble into lossless MPEG-TS in < 5ms with ZERO memory spike or browser lockup
    if (onProgress) {
      onProgress({
        stage: 'finalizing',
        percent: 98,
        message: 'Assembling lossless stream...',
      });
    }
    const remaining = segmentBlobs.filter(Boolean) as BlobPart[];
    finalBlob = new Blob(remaining, { type: 'video/mp2t' });
    mimeType = 'video/mp2t';
    isFinalFmp4 = false;
  }

  return {
    blob: finalBlob,
    mimeType,
    duration: clipDuration,
    fileSize: finalBlob.size,
    segmentCount: selectedSegments.length,
    isFmp4: isFinalFmp4,
  };
}
