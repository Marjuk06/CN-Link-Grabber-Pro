import * as MP4BoxModule from 'mp4box';
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { TrimProgress } from '../../types/trim';

const MP4Box = (MP4BoxModule as any).default || MP4BoxModule;

export interface FastTrimOptions {
  startTime: number;
  endTime: number;
  includeAudio?: boolean;
  onProgress?: (progress: TrimProgress) => void;
}

export async function trimMP4Fast(
  inputBuffer: ArrayBuffer,
  options: FastTrimOptions
): Promise<Blob> {
  const { startTime, endTime, includeAudio = true, onProgress } = options;

  if (onProgress) {
    onProgress({
      stage: 'analyzing',
      percent: 10,
      message: 'Inspecting MP4 container and tracks...',
    });
  }

  return new Promise((resolve, reject) => {
    try {
      const mp4boxFile = MP4Box.createFile();

      let videoTrackInfo: any = null;
      let audioTrackInfo: any = null;
      let videoSamples: any[] = [];
      let audioSamples: any[] = [];
      let videoDecoderDescription: Uint8Array | undefined;

      mp4boxFile.onError = (e: any) => {
        reject(new Error(`MP4Box parsing error: ${e}`));
      };

      mp4boxFile.onReady = (info: any) => {
        if (!info.videoTracks || info.videoTracks.length === 0) {
          reject(new Error('No video track found in MP4 file.'));
          return;
        }

        videoTrackInfo = info.videoTracks[0];
        if (includeAudio && info.audioTracks && info.audioTracks.length > 0) {
          audioTrackInfo = info.audioTracks[0];
        }

        // Extract AVCDecoderConfigurationRecord (avcC) description for mp4-muxer
        try {
          const track = mp4boxFile.getTrackById(videoTrackInfo.id);
          const entry = track?.mdia?.minf?.stbl?.stsd?.entries?.[0];
          const avcC = entry?.avcC;
          if (avcC && typeof avcC.start === 'number' && typeof avcC.size === 'number') {
            videoDecoderDescription = new Uint8Array(
              inputBuffer,
              avcC.start + (avcC.hdr_size || 8),
              avcC.size - (avcC.hdr_size || 8)
            );
          }
        } catch (descErr) {
          console.warn('Could not extract avcC description:', descErr);
        }

        // Request samples for the tracks
        mp4boxFile.setExtractionOptions(videoTrackInfo.id, 'video', { nbSamples: 10000 });
        if (audioTrackInfo) {
          mp4boxFile.setExtractionOptions(audioTrackInfo.id, 'audio', { nbSamples: 10000 });
        }

        mp4boxFile.start();
      };

      mp4boxFile.onSamples = (trackId: number, user: any, samples: any[]) => {
        if (user === 'video') {
          videoSamples.push(...samples);
        } else if (user === 'audio') {
          audioSamples.push(...samples);
        }
      };

      // Feed inputBuffer to MP4Box
      // @ts-ignore
      inputBuffer.fileStart = 0;
      mp4boxFile.appendBuffer(inputBuffer);
      mp4boxFile.flush();

      if (onProgress) {
        onProgress({
          stage: 'trimming',
          percent: 45,
          message: 'Selecting keyframe-aligned video & audio samples...',
        });
      }

      if (videoSamples.length === 0) {
        reject(new Error('Could not extract video samples from the file.'));
        return;
      }

      const vTimescale = videoTrackInfo.timescale || 1000;
      const startVUnits = startTime * vTimescale;
      const endVUnits = endTime * vTimescale;

      // Find nearest keyframe at or prior to start time
      let closestKeyframeIdx = 0;
      for (let i = 0; i < videoSamples.length; i++) {
        const s = videoSamples[i];
        if (s.is_sync) {
          if (s.cts <= startVUnits) {
            closestKeyframeIdx = i;
          } else {
            break;
          }
        }
      }

      const startIdx = closestKeyframeIdx;

      // Find end sample
      let endIdx = videoSamples.length - 1;
      for (let i = startIdx; i < videoSamples.length; i++) {
        const s = videoSamples[i];
        if (s.cts >= endVUnits) {
          endIdx = i;
          break;
        }
      }

      const selectedVideoSamples = videoSamples.slice(startIdx, endIdx + 1);
      if (selectedVideoSamples.length === 0) {
        reject(new Error('No video samples found within the specified time range.'));
        return;
      }

      // Collect audio samples in corresponding time window
      let selectedAudioSamples: any[] = [];
      if (audioTrackInfo && audioSamples.length > 0) {
        const aTimescale = audioTrackInfo.timescale || 1000;
        const actualStartSec = selectedVideoSamples[0].cts / vTimescale;
        const actualEndSec = selectedVideoSamples[selectedVideoSamples.length - 1].cts / vTimescale;

        const startAUnits = actualStartSec * aTimescale;
        const endAUnits = actualEndSec * aTimescale;

        selectedAudioSamples = audioSamples.filter(
          (s) => s.dts >= startAUnits && s.dts <= endAUnits
        );
      }

      if (onProgress) {
        onProgress({
          stage: 'muxing',
          percent: 75,
          message: 'Remuxing into clean MP4 container...',
        });
      }

      // Configure Muxer
      const target = new ArrayBufferTarget();
      const videoWidth = videoTrackInfo.video?.width || videoTrackInfo.track_width || 1280;
      const videoHeight = videoTrackInfo.video?.height || videoTrackInfo.track_height || 720;

      // Codec string
      let vCodec: 'avc' | 'hevc' | 'vp9' | 'av1' = 'avc';
      const rawCodec = (videoTrackInfo.codec || '').toLowerCase();
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

      if (audioTrackInfo && selectedAudioSamples.length > 0) {
        muxerConfig.audio = {
          codec: 'aac',
          numberOfChannels: audioTrackInfo.audio?.channel_count || 2,
          sampleRate: audioTrackInfo.audio?.sample_rate || 44100,
        };
      }

      const muxer = new Muxer(muxerConfig);

      // Construct decoderConfig metadata for video
      const videoMetadata: any = videoDecoderDescription
        ? {
            decoderConfig: {
              codec: videoTrackInfo.codec || 'avc1.64001f',
              description: videoDecoderDescription,
            },
          }
        : undefined;

      // Normalize video samples in decode (DTS) order
      const baseVDts = selectedVideoSamples[0].dts;
      for (let i = 0; i < selectedVideoSamples.length; i++) {
        const sample = selectedVideoSamples[i];
        const dtsMicroseconds = Math.max(0, Math.round(((sample.dts - baseVDts) / vTimescale) * 1_000_000));
        const durationMicroseconds = Math.round((sample.duration / vTimescale) * 1_000_000);
        const compositionOffsetMicroseconds = Math.round(((sample.cts - sample.dts) / vTimescale) * 1_000_000);
        const ptsMicroseconds = dtsMicroseconds + compositionOffsetMicroseconds;

        // Provide metadata on keyframes / initial chunk
        const meta = i === 0 || sample.is_sync ? videoMetadata : undefined;

        muxer.addVideoChunkRaw(
          new Uint8Array(sample.data),
          sample.is_sync ? 'key' : 'delta',
          ptsMicroseconds,
          durationMicroseconds,
          meta,
          compositionOffsetMicroseconds
        );
      }

      if (audioTrackInfo && selectedAudioSamples.length > 0) {
        const aTimescale = audioTrackInfo.timescale || 1000;
        const baseADts = selectedAudioSamples[0].dts;

        for (const sample of selectedAudioSamples) {
          const dtsMicroseconds = Math.max(0, Math.round(((sample.dts - baseADts) / aTimescale) * 1_000_000));
          const durationMicroseconds = Math.round((sample.duration / aTimescale) * 1_000_000);

          muxer.addAudioChunkRaw(
            new Uint8Array(sample.data),
            'key',
            dtsMicroseconds,
            durationMicroseconds
          );
        }
      }

      muxer.finalize();

      if (onProgress) {
        onProgress({
          stage: 'finalizing',
          percent: 95,
          message: 'Finalizing MP4 output...',
        });
      }

      const outputBuffer = target.buffer;
      const outputBlob = new Blob([outputBuffer], { type: 'video/mp4' });
      resolve(outputBlob);
    } catch (err) {
      reject(err);
    }
  });
}
