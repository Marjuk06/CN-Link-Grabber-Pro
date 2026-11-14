import * as MP4BoxModule from 'mp4box';
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { TrimProgress } from '../../types/trim';

const MP4Box = (MP4BoxModule as any).default || MP4BoxModule;

export interface RangeTrimOptions {
  headerBuffer: ArrayBuffer;
  sliceBuffer: ArrayBuffer;
  sliceStartByte: number;
  startTime: number;
  endTime: number;
  includeAudio?: boolean;
  onProgress?: (progress: TrimProgress) => void;
}

export async function trimMP4FromRangeSlice(options: RangeTrimOptions): Promise<Blob> {
  const {
    headerBuffer,
    sliceBuffer,
    sliceStartByte,
    startTime,
    endTime,
    includeAudio = true,
    onProgress,
  } = options;

  if (onProgress) {
    onProgress({
      stage: 'trimming',
      percent: 88,
      message: 'Extracting samples from partial byte slice...',
    });
  }

  return new Promise((resolve, reject) => {
    try {
      const mp4boxFile = MP4Box.createFile();

      mp4boxFile.onError = (e: any) => {
        reject(new Error(`MP4Box error reading header: ${e}`));
      };

      mp4boxFile.onReady = (info: any) => {
        if (!info.videoTracks || info.videoTracks.length === 0) {
          reject(new Error('No video track found in MP4 header.'));
          return;
        }

        const vTrackInfo = info.videoTracks[0];
        const aTrackInfo = info.audioTracks?.[0];

        const vTrack = mp4boxFile.getTrackById(vTrackInfo.id);
        const aTrack = aTrackInfo ? mp4boxFile.getTrackById(aTrackInfo.id) : null;

        const vTimescale = vTrackInfo.timescale || vTrack?.mdia?.mdhd?.timescale || 1000;
        const aTimescale = aTrackInfo?.timescale || aTrack?.mdia?.mdhd?.timescale || 1000;

        if (!vTrack?.samples || vTrack.samples.length === 0) {
          reject(new Error('No sample table entries found in video track.'));
          return;
        }

        const startUnits = startTime * vTimescale;
        const endUnits = endTime * vTimescale;

        // Find nearest keyframe at or prior to start time
        let startIdx = 0;
        for (let i = 0; i < vTrack.samples.length; i++) {
          const s = vTrack.samples[i];
          if (s.is_sync && s.cts <= startUnits) {
            startIdx = i;
          }
        }

        let endIdx = vTrack.samples.length - 1;
        for (let i = startIdx; i < vTrack.samples.length; i++) {
          const s = vTrack.samples[i];
          if (s.cts >= endUnits) {
            endIdx = i;
            break;
          }
        }

        const selectedVideoSamples = vTrack.samples.slice(startIdx, endIdx + 1);

        let selectedAudioSamples: any[] = [];
        if (includeAudio && aTrack && aTrack.samples && aTrack.samples.length > 0) {
          const actualStartSec = selectedVideoSamples[0].cts / vTimescale;
          const actualEndSec = selectedVideoSamples[selectedVideoSamples.length - 1].cts / vTimescale;
          selectedAudioSamples = aTrack.samples.filter(
            (s: any) => s.dts >= actualStartSec * aTimescale && s.dts <= actualEndSec * aTimescale
          );
        }

        if (onProgress) {
          onProgress({
            stage: 'muxing',
            percent: 94,
            message: 'Muxing trimmed clip into clean MP4 container...',
          });
        }

        // Configure Muxer
        const target = new ArrayBufferTarget();
        const videoWidth = vTrackInfo.video?.width || vTrackInfo.track_width || 1280;
        const videoHeight = vTrackInfo.video?.height || vTrackInfo.track_height || 720;

        let vCodec: 'avc' | 'hevc' | 'vp9' | 'av1' = 'avc';
        const rawCodec = (vTrackInfo.codec || '').toLowerCase();
        if (rawCodec.includes('hvc1') || rawCodec.includes('hev1')) vCodec = 'hevc';
        else if (rawCodec.includes('vp09')) vCodec = 'vp9';
        else if (rawCodec.includes('av01')) vCodec = 'av1';

        const muxerConfig: any = {
          target,
          video: {
            codec: vCodec,
            width: videoWidth,
            height: videoHeight,
          },
          fastStart: 'in-memory',
          firstTimestampBehavior: 'offset',
        };

        if (selectedAudioSamples.length > 0) {
          muxerConfig.audio = {
            codec: 'aac',
            numberOfChannels: aTrackInfo?.audio?.channel_count || 2,
            sampleRate: aTrackInfo?.audio?.sample_rate || 44100,
          };
        }

        const muxer = new Muxer(muxerConfig);

        // Extract AVC configuration record (avcC)
        let videoMeta: any = undefined;
        try {
          const entry = vTrack.mdia?.minf?.stbl?.stsd?.entries?.[0];
          const avcC = entry?.avcC;
          if (avcC && typeof avcC.start === 'number' && typeof avcC.size === 'number') {
            const desc = new Uint8Array(
              headerBuffer,
              avcC.start + (avcC.hdr_size || 8),
              avcC.size - (avcC.hdr_size || 8)
            );
            videoMeta = {
              decoderConfig: {
                codec: vTrackInfo.codec || 'avc1.64001f',
                description: desc,
              },
            };
          }
        } catch {}

        // Add video chunks
        const baseVDts = selectedVideoSamples[0].dts;
        for (let i = 0; i < selectedVideoSamples.length; i++) {
          const s = selectedVideoSamples[i];
          const dtsUs = Math.max(0, Math.round(((s.dts - baseVDts) / vTimescale) * 1_000_000));
          const durUs = Math.round((s.duration / vTimescale) * 1_000_000);
          const compUs = Math.round(((s.cts - s.dts) / vTimescale) * 1_000_000);
          const ptsUs = Math.max(0, dtsUs + compUs);

          const localOffset = s.offset - sliceStartByte;
          if (localOffset < 0 || localOffset + s.size > sliceBuffer.byteLength) {
            continue; // Skip if out of slice bounds
          }

          const sampleBytes = new Uint8Array(sliceBuffer, localOffset, s.size);
          const meta = i === 0 || s.is_sync ? videoMeta : undefined;

          muxer.addVideoChunkRaw(
            sampleBytes,
            s.is_sync ? 'key' : 'delta',
            ptsUs,
            durUs,
            meta,
            compUs
          );
        }

        // Add audio chunks
        if (selectedAudioSamples.length > 0) {
          const baseADts = selectedAudioSamples[0].dts;
          for (const s of selectedAudioSamples) {
            const dtsUs = Math.max(0, Math.round(((s.dts - baseADts) / aTimescale) * 1_000_000));
            const durUs = Math.round((s.duration / aTimescale) * 1_000_000);

            const localOffset = s.offset - sliceStartByte;
            if (localOffset < 0 || localOffset + s.size > sliceBuffer.byteLength) {
              continue;
            }

            const sampleBytes = new Uint8Array(sliceBuffer, localOffset, s.size);
            muxer.addAudioChunkRaw(sampleBytes, 'key', dtsUs, durUs);
          }
        }

        muxer.finalize();

        if (onProgress) {
          onProgress({
            stage: 'finalizing',
            percent: 98,
            message: 'Finalizing MP4 output...',
          });
        }

        const outputBlob = new Blob([target.buffer], { type: 'video/mp4' });
        resolve(outputBlob);
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
