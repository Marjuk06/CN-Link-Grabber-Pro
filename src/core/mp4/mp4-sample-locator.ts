import * as MP4BoxModule from 'mp4box';

const MP4Box = (MP4BoxModule as any).default || MP4BoxModule;

export interface SampleRangePlan {
  minByteOffset: number;
  maxByteOffset: number;
  totalBytesToFetch: number;
  videoTrackId: number;
  audioTrackId?: number;
  selectedVideoCount: number;
  selectedAudioCount: number;
}

/**
 * Computes the exact byte range needed from a remote MP4 file
 * by inspecting the sample tables inside the headerBuffer.
 */
export function computeSampleRangePlan(
  headerBuffer: ArrayBuffer,
  startTime: number,
  endTime: number,
  totalFileSize: number
): Promise<SampleRangePlan> {
  return new Promise((resolve, reject) => {
    try {
      const mp4boxFile = MP4Box.createFile();

      mp4boxFile.onError = (e: any) => {
        reject(new Error(`MP4Box sample locator error: ${e}`));
      };

      mp4boxFile.onReady = (info: any) => {
        if (!info.videoTracks || info.videoTracks.length === 0) {
          reject(new Error('No video track found in moov header.'));
          return;
        }

        const vTrackInfo = info.videoTracks[0];
        const aTrackInfo = info.audioTracks?.[0];

        const vTrack = mp4boxFile.getTrackById(vTrackInfo.id);
        const aTrack = aTrackInfo ? mp4boxFile.getTrackById(aTrackInfo.id) : null;

        const vTimescale = vTrackInfo.timescale || vTrack?.mdia?.mdhd?.timescale || 1000;
        const aTimescale = aTrackInfo?.timescale || aTrack?.mdia?.mdhd?.timescale || 1000;

        const allVideoSamples = vTrack?.samples || [];
        const allAudioSamples = aTrack?.samples || [];

        if (allVideoSamples.length === 0) {
          // If samples table not yet computed, estimate from duration
          const vDuration = (vTrackInfo.duration || 1000) / vTimescale;
          const sRatio = Math.max(0, (startTime - 2) / (vDuration || 1));
          const eRatio = Math.min(1, (endTime + 2) / (vDuration || 1));
          const estStart = Math.floor(sRatio * totalFileSize);
          const estEnd = Math.min(totalFileSize - 1, Math.ceil(eRatio * totalFileSize));

          resolve({
            minByteOffset: estStart,
            maxByteOffset: estEnd,
            totalBytesToFetch: estEnd - estStart,
            videoTrackId: vTrackInfo.id,
            audioTrackId: aTrackInfo?.id,
            selectedVideoCount: 0,
            selectedAudioCount: 0,
          });
          return;
        }

        const startVUnits = startTime * vTimescale;
        const endVUnits = endTime * vTimescale;

        // Find nearest keyframe at or prior to start time
        let closestKeyframeIdx = 0;
        for (let i = 0; i < allVideoSamples.length; i++) {
          const s = allVideoSamples[i];
          if (s.is_sync) {
            if (s.cts <= startVUnits) {
              closestKeyframeIdx = i;
            } else {
              break;
            }
          }
        }

        const startIdx = closestKeyframeIdx;
        let endIdx = allVideoSamples.length - 1;
        for (let i = startIdx; i < allVideoSamples.length; i++) {
          const s = allVideoSamples[i];
          if (s.cts >= endVUnits) {
            endIdx = i;
            break;
          }
        }

        const selectedVideoSamples = allVideoSamples.slice(startIdx, endIdx + 1);

        // Match audio samples
        let selectedAudioSamples: any[] = [];
        if (allAudioSamples.length > 0 && selectedVideoSamples.length > 0) {
          const actualStartSec = selectedVideoSamples[0].cts / vTimescale;
          const actualEndSec = selectedVideoSamples[selectedVideoSamples.length - 1].cts / vTimescale;

          selectedAudioSamples = allAudioSamples.filter(
            (s: any) => s.dts >= actualStartSec * aTimescale && s.dts <= actualEndSec * aTimescale
          );
        }

        // Calculate byte offsets of all selected samples
        let minOffset = Infinity;
        let maxOffset = 0;

        for (const s of selectedVideoSamples) {
          if (typeof s.offset === 'number') {
            if (s.offset < minOffset) minOffset = s.offset;
            const endOffset = s.offset + s.size;
            if (endOffset > maxOffset) maxOffset = endOffset;
          }
        }

        for (const s of selectedAudioSamples) {
          if (typeof s.offset === 'number') {
            if (s.offset < minOffset) minOffset = s.offset;
            const endOffset = s.offset + s.size;
            if (endOffset > maxOffset) maxOffset = endOffset;
          }
        }

        if (minOffset < Infinity && maxOffset > minOffset) {
          resolve({
            minByteOffset: minOffset,
            maxByteOffset: maxOffset,
            totalBytesToFetch: maxOffset - minOffset,
            videoTrackId: vTrackInfo.id,
            audioTrackId: aTrackInfo?.id,
            selectedVideoCount: selectedVideoSamples.length,
            selectedAudioCount: selectedAudioSamples.length,
          });
          return;
        }

        // Proportional fallback
        const videoDuration = (vTrackInfo.duration || 1000) / vTimescale;
        const startRatio = Math.max(0, (startTime - 2) / (videoDuration || 1));
        const endRatio = Math.min(1, (endTime + 2) / (videoDuration || 1));
        const estimatedStart = Math.floor(startRatio * totalFileSize);
        const estimatedEnd = Math.min(totalFileSize - 1, Math.ceil(endRatio * totalFileSize));

        resolve({
          minByteOffset: estimatedStart,
          maxByteOffset: estimatedEnd,
          totalBytesToFetch: estimatedEnd - estimatedStart,
          videoTrackId: vTrackInfo.id,
          audioTrackId: aTrackInfo?.id,
          selectedVideoCount: selectedVideoSamples.length,
          selectedAudioCount: selectedAudioSamples.length,
        });
      };

      // @ts-ignore
      headerBuffer.fileStart = 0;
      mp4boxFile.appendBuffer(headerBuffer);
      mp4boxFile.flush();
    } catch (err) {
      reject(err);
    }
  });
}
