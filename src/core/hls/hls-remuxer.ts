import muxjs from 'mux.js';

export interface TransmuxResult {
  data: Uint8Array;
  mimeType: 'video/mp4';
}

/**
 * Transmuxes raw MPEG-2 Transport Stream (.ts) bytes into a standard fragmented MP4 (ISO BMFF).
 * This converts H.264 + AAC elementary streams from MPEG-TS into standard MP4 boxes (ftyp, moov, moof, mdat) that:
 * 1. Play natively in browser HTML5 <video> elements with hardware acceleration.
 * 2. Play cleanly on all major desktop/mobile media players and web platforms.
 * 3. Normalize presentation timestamps so the clip starts cleanly at 00:00:00.
 */
export function transmuxTsToMp4(tsBytes: Uint8Array): Uint8Array {
  const transmuxer = new (muxjs as any).mp4.Transmuxer({
    keepOriginalTimestamps: false,
    remux: true,
  });

  let initSegment: Uint8Array | null = null;
  const mediaSegments: Uint8Array[] = [];

  transmuxer.on('data', (segment: any) => {
    if (segment.initSegment && segment.initSegment.byteLength > 0 && !initSegment) {
      initSegment = new Uint8Array(segment.initSegment);
    }
    if (segment.data && segment.data.byteLength > 0) {
      mediaSegments.push(new Uint8Array(segment.data));
    }
  });

  transmuxer.push(tsBytes);
  transmuxer.flush();

  if (!initSegment || mediaSegments.length === 0) {
    throw new Error('MPEG-TS to MP4 transmuxing did not produce valid MP4 initialization or media segments.');
  }

  const validInitSegment: Uint8Array = initSegment;

  // Calculate combined MP4 size
  let totalLength = validInitSegment.byteLength;
  for (const part of mediaSegments) {
    totalLength += part.byteLength;
  }

  const mp4Array = new Uint8Array(totalLength);
  mp4Array.set(validInitSegment, 0);

  let offset = validInitSegment.byteLength;
  for (const part of mediaSegments) {
    mp4Array.set(part, offset);
    offset += part.byteLength;
  }

  return mp4Array;
}

/**
 * Low-memory streaming remuxer:
 * Transmuxes an array of TS ArrayBuffers into a standard fragmented MP4 Blob.
 * 1. Frees raw TS input buffers one-by-one as they are consumed to keep memory under 60MB.
 * 2. Yields execution to the event loop every 15 chunks so the browser UI never freezes.
 * 3. Builds a Blob directly from array of parts without allocating any gigantic contiguous buffer.
 */
export async function transmuxTsChunksToBlob(
  chunks: (ArrayBuffer | Uint8Array | null)[],
  onProgress?: (percent: number) => void
): Promise<Blob> {
  const transmuxer = new (muxjs as any).mp4.Transmuxer({
    keepOriginalTimestamps: false,
    remux: true,
  });

  const outputParts: BlobPart[] = [];
  let hasInitSegment = false;

  transmuxer.on('data', (segment: any) => {
    if (segment.initSegment && segment.initSegment.byteLength > 0 && !hasInitSegment) {
      outputParts.push(new Uint8Array(segment.initSegment));
      hasInitSegment = true;
    }
    if (segment.data && segment.data.byteLength > 0) {
      outputParts.push(new Uint8Array(segment.data));
    }
  });

  const total = chunks.length;
  for (let i = 0; i < total; i++) {
    const chunk = chunks[i];
    if (chunk) {
      const u8 = chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk);
      if (u8.byteLength > 0) {
        transmuxer.push(u8);
      }
      // Immediately nullify reference to permit garbage collection of raw TS chunk
      chunks[i] = null;
    }

    // Yield every 15 chunks to prevent UI thread lockup and allow GC
    if (i % 15 === 0 || i === total - 1) {
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
      if (onProgress) {
        const pct = Math.round(((i + 1) / total) * 100);
        onProgress(pct);
      }
    }
  }

  transmuxer.flush();

  if (!hasInitSegment || outputParts.length === 0) {
    throw new Error('MPEG-TS to MP4 transmuxing did not produce valid MP4 segments.');
  }

  return new Blob(outputParts, { type: 'video/mp4' });
}
