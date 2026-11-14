import { TrimJobConfig, TrimProgress, TrimResult } from '../../types/trim';
import { trimMP4Fast } from './fast-trimmer';
import { trimMP4Accurate } from './accurate-trimmer';
import { trimMP4FromRangeSlice } from './range-trimmer';
import { generateClipFilename } from '../utils/filename';
import { inspectServerCapabilities } from '../capabilities/server-inspector';
import { fetchByteRange, fetchMoovHeader } from '../capabilities/range-fetcher';
import { computeSampleRangePlan } from '../mp4/mp4-sample-locator';

export class TrimEngine {
  private activeAbortController: AbortController | null = null;

  public cancel(): void {
    if (this.activeAbortController) {
      this.activeAbortController.abort();
      this.activeAbortController = null;
    }
  }

  public async processClip(
    config: TrimJobConfig,
    onProgress: (progress: TrimProgress) => void
  ): Promise<TrimResult> {
    this.activeAbortController = new AbortController();
    const { signal } = this.activeAbortController;

    const startTime = config.startTime;
    const endTime = config.endTime;
    const duration = Math.max(0, endTime - startTime);

    try {
      // Step 1: Inspect server capabilities
      onProgress({
        stage: 'inspecting',
        percent: 5,
        message: 'Detecting video source capabilities and range compliance...',
      });

      const capabilities = await inspectServerCapabilities(config.sourceUrl);

      if (signal.aborted) throw new Error('Processing cancelled by user.');

      // Check if Smart Partial Range Fetching is possible
      const canUseSmartRange =
        capabilities.acceptRanges &&
        typeof capabilities.contentLength === 'number' &&
        capabilities.contentLength > 5 * 1024 * 1024 && // Greater than 5MB
        !config.sourceUrl.startsWith('blob:');

      let outputBlob: Blob;

      if (canUseSmartRange) {
        try {
          outputBlob = await this.processWithSmartRange(
            config,
            capabilities.contentLength!,
            signal,
            onProgress
          );
        } catch (rangeErr: any) {
          console.warn('Smart range fetching error:', rangeErr);
          if (signal.aborted) throw new Error('Processing cancelled by user.');
          // Fallback to full download
          outputBlob = await this.processWithFullDownload(
            config,
            capabilities.contentLength,
            signal,
            onProgress
          );
        }
      } else {
        outputBlob = await this.processWithFullDownload(
          config,
          capabilities.contentLength,
          signal,
          onProgress
        );
      }

      // Finalize output
      const baseTitle = config.customFilename || config.videoTitle || 'CodeNest_Video';
      const finalFilename = generateClipFilename(baseTitle, startTime, endTime, 'mp4');
      const blobUrl = URL.createObjectURL(outputBlob);

      onProgress({
        stage: 'done',
        percent: 100,
        message: 'Clip created successfully! Ready to preview and download.',
      });

      return {
        blobUrl,
        blob: outputBlob,
        filename: finalFilename,
        fileSize: outputBlob.size,
        duration,
        modeUsed: config.mode,
      };
    } catch (err: any) {
      onProgress({
        stage: 'error',
        percent: 0,
        message: err?.message || 'Trimming failed due to an unexpected error.',
        error: err?.message || String(err),
      });
      throw err;
    } finally {
      this.activeAbortController = null;
    }
  }

  /**
   * Smart Partial Range Fetching:
   * Downloads only the complete moov header (~200KB-5MB) and the precise byte range needed
   * for the selected timestamps, avoiding downloading the full multi-gigabyte video.
   */
  private async processWithSmartRange(
    config: TrimJobConfig,
    totalFileSize: number,
    signal: AbortSignal,
    onProgress: (progress: TrimProgress) => void
  ): Promise<Blob> {
    onProgress({
      stage: 'analyzing',
      percent: 10,
      message: 'Fetching video metadata (moov container)...',
    });

    // 1. Fetch complete moov box
    const moovInfo = await fetchMoovHeader(config.sourceUrl, totalFileSize, signal);

    if (signal.aborted) throw new Error('Processing cancelled by user.');

    // 2. Compute sample byte range plan
    onProgress({
      stage: 'analyzing',
      percent: 20,
      message: 'Calculating exact sample byte offsets for selected timestamps...',
    });

    const plan = await computeSampleRangePlan(
      moovInfo.headerBuffer,
      config.startTime,
      config.endTime,
      totalFileSize
    );

    if (signal.aborted) throw new Error('Processing cancelled by user.');

    const startByte = Math.max(0, plan.minByteOffset);
    const endByte = Math.min(totalFileSize - 1, plan.maxByteOffset);
    const bytesToDownload = endByte - startByte + 1;

    const savedPercent = Math.max(0, Math.round((1 - bytesToDownload / totalFileSize) * 100));
    const mbNeeded = (bytesToDownload / (1024 * 1024)).toFixed(1);
    const mbTotal = (totalFileSize / (1024 * 1024)).toFixed(1);

    onProgress({
      stage: 'downloading',
      percent: 15,
      message: `Fetching clip data: 0 MB / ${mbNeeded} MB (Saved ${savedPercent}% of ${mbTotal} MB)`,
    });

    // 3. Fetch ONLY the required slice
    const sliceBuffer = await fetchByteRange(
      config.sourceUrl,
      startByte,
      endByte,
      signal,
      (loadedBytes, totalTargetBytes) => {
        const ratio = totalTargetBytes > 0 ? loadedBytes / totalTargetBytes : 0;
        const percent = Math.min(85, 15 + Math.round(ratio * 70));
        const mbLoaded = (loadedBytes / (1024 * 1024)).toFixed(1);
        onProgress({
          stage: 'downloading',
          percent,
          message: `Fetching clip data: ${mbLoaded} MB / ${mbNeeded} MB (Saved ${savedPercent}% of ${mbTotal} MB)`,
          bytesReceived: loadedBytes,
          totalBytes: totalTargetBytes,
        });
      }
    );

    if (signal.aborted) throw new Error('Processing cancelled by user.');

    // 4. Mux directly from the partial slice and header
    return await trimMP4FromRangeSlice({
      headerBuffer: moovInfo.headerBuffer,
      sliceBuffer,
      sliceStartByte: startByte,
      startTime: config.startTime,
      endTime: config.endTime,
      includeAudio: config.includeAudio,
      onProgress,
    });
  }

  /**
   * Fallback: Full stream download for non-range compliant servers
   */
  private async processWithFullDownload(
    config: TrimJobConfig,
    contentLength: number | null,
    signal: AbortSignal,
    onProgress: (progress: TrimProgress) => void
  ): Promise<Blob> {
    onProgress({
      stage: 'downloading',
      percent: 10,
      message: 'Fetching video stream data...',
    });

    const response = await fetch(config.sourceUrl, {
      signal,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status} (${response.statusText}).`);
    }

    const totalLength = contentLength || parseInt(response.headers.get('content-length') || '0', 10);
    const reader = response.body?.getReader();

    let inputBuffer: ArrayBuffer;

    if (reader) {
      const chunks: Uint8Array[] = [];
      let receivedBytes = 0;

      while (true) {
        if (signal.aborted) {
          reader.cancel();
          throw new Error('Processing cancelled by user.');
        }

        const { done, value } = await reader.read();
        if (done) break;

        if (value) {
          chunks.push(value);
          receivedBytes += value.byteLength;

          let downloadPercent = 10;
          if (totalLength > 0) {
            downloadPercent = Math.min(65, 10 + Math.round((receivedBytes / totalLength) * 55));
          }

          const mbReceived = (receivedBytes / (1024 * 1024)).toFixed(1);
          const mbTotal = totalLength > 0 ? (totalLength / (1024 * 1024)).toFixed(1) : '?';

          onProgress({
            stage: 'downloading',
            percent: downloadPercent,
            message: `Downloading video stream: ${mbReceived} MB / ${mbTotal} MB`,
            bytesReceived: receivedBytes,
            totalBytes: totalLength > 0 ? totalLength : undefined,
          });
        }
      }

      const fullArray = new Uint8Array(receivedBytes);
      let offset = 0;
      for (const chunk of chunks) {
        fullArray.set(chunk, offset);
        offset += chunk.byteLength;
      }
      inputBuffer = fullArray.buffer;
    } else {
      inputBuffer = await response.arrayBuffer();
    }

    if (signal.aborted) throw new Error('Processing cancelled by user.');

    if (config.mode === 'fast') {
      return await trimMP4Fast(inputBuffer, {
        startTime: config.startTime,
        endTime: config.endTime,
        includeAudio: config.includeAudio,
        onProgress,
      });
    } else {
      return await trimMP4Accurate(inputBuffer, {
        startTime: config.startTime,
        endTime: config.endTime,
        includeAudio: config.includeAudio,
        onProgress,
      });
    }
  }
}
