import { useState, useRef, useCallback, useEffect } from 'react';
import { TrimMode, TrimProgress, TrimResult } from '../../types/trim';
import { ServerCapabilities } from '../../types/video';
import { TrimEngine } from '../../core/trim/trim-engine';
import { inspectServerCapabilities } from '../../core/capabilities/server-inspector';
import { generateClipFilename } from '../../core/utils/filename';
import { formatTimecode } from '../../core/utils/timecode';
import { fetchHlsRangeClip } from '../../core/hls/hls-segment-fetcher';

export interface UseVideoTrimmerOptions {
  isBlob?: boolean;
  hlsStreamUrl?: string | null;
  onStartStreamCapture?: (
    startTime: number,
    endTime: number
  ) => Promise<{ arrayBuffer: ArrayBuffer; mimeType: string; duration: number }>;
  onCancelStreamCapture?: () => Promise<any>;
  captureProgress?: { elapsedSec: number; totalSec: number; percent: number } | null;
}

export function useVideoTrimmer(
  videoDuration: number,
  sourceUrl?: string,
  options?: UseVideoTrimmerOptions
) {
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [mode, setMode] = useState<TrimMode>('fast');
  const [includeAudio, setIncludeAudio] = useState<boolean>(true);
  const [progress, setProgress] = useState<TrimProgress | null>(null);
  const [result, setResult] = useState<TrimResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [serverCapabilities, setServerCapabilities] = useState<ServerCapabilities | null>(null);

  const engineRef = useRef<TrimEngine | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize start/end time when video duration loads
  useEffect(() => {
    if (videoDuration > 0) {
      setStartTime(0);
      // Default to 15 minutes or duration if shorter
      const defaultEnd = Math.min(videoDuration, 15 * 60);
      setEndTime(defaultEnd);
    }
  }, [videoDuration]);

  // Inspect source capabilities when sourceUrl changes (skip for blob URLs)
  useEffect(() => {
    if (!sourceUrl || sourceUrl.startsWith('blob:') || options?.isBlob) {
      setServerCapabilities(null);
      return;
    }

    let isMounted = true;
    inspectServerCapabilities(sourceUrl)
      .then((caps) => {
        if (isMounted) setServerCapabilities(caps);
      })
      .catch((err) => {
        console.warn('Capability inspection error:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [sourceUrl, options?.isBlob]);

  // Sync capture progress from content script to UI progress card
  useEffect(() => {
    if (isProcessing && options?.captureProgress) {
      const elapsed = formatTimecode(options.captureProgress.elapsedSec);
      const total = formatTimecode(options.captureProgress.totalSec);
      setProgress({
        stage: 'capturing',
        percent: options.captureProgress.percent,
        message: `Recording live stream: ${elapsed} / ${total}`,
      });
    }
  }, [options?.captureProgress, isProcessing]);

  const startTrim = useCallback(
    async (url: string, videoTitle?: string) => {
      if (!url) {
        setError('No valid video source URL available to trim.');
        return;
      }

      setError(null);
      setResult(null);
      setIsProcessing(true);

      const isBlobSource = Boolean(options?.isBlob || url.startsWith('blob:'));

      // Tier 1: Master HLS Instant Segment Downloader (Zero playback wait time!)
      if (options?.hlsStreamUrl) {
        setProgress({
          stage: 'inspecting',
          percent: 5,
          message: 'Connecting to HLS stream playlist manifest...',
        });

        const abortCtrl = new AbortController();
        abortControllerRef.current = abortCtrl;

        try {
          const hlsResult = await fetchHlsRangeClip(options.hlsStreamUrl, startTime, endTime, {
            signal: abortCtrl.signal,
            onProgress: (prog) => setProgress(prog),
          });

          const ext = hlsResult.mimeType.includes('mp4') || hlsResult.isFmp4 ? 'mp4' : 'ts';
          const baseTitle = videoTitle || 'CodeNest_Clip';
          const finalFilename = generateClipFilename(baseTitle, startTime, endTime, ext);
          const blobUrl = URL.createObjectURL(hlsResult.blob);

          setProgress({
            stage: 'done',
            percent: 100,
            message: 'Clip created successfully! Ready to preview.',
          });
          await new Promise((r) => setTimeout(r, 450));

          setResult({
            blobUrl,
            blob: hlsResult.blob,
            filename: finalFilename,
            fileSize: hlsResult.fileSize,
            duration: hlsResult.duration,
            modeUsed: 'fast',
          });

          setIsProcessing(false);
          setProgress(null);
          return;
        } catch (hlsErr: any) {
          if (abortCtrl.signal.aborted) {
            setError('Operation cancelled by user.');
            setIsProcessing(false);
            setProgress(null);
            return;
          }
          console.warn('Direct HLS fetch failed, falling back to silent stream capture:', hlsErr);
          // Fall back to Tier 2 stream capture
        } finally {
          abortControllerRef.current = null;
        }
      }

      // Tier 2: In-Page Universal Stream Capture (for YouTube, Custom Blobs)
      if (isBlobSource) {
        if (!options?.onStartStreamCapture) {
          setError('In-page stream capture is not available for this tab.');
          setIsProcessing(false);
          return;
        }

        setProgress({
          stage: 'capturing',
          percent: 0,
          message: 'Starting silent stream capture from video player...',
        });

        try {
          const captureResult = await options.onStartStreamCapture(startTime, endTime);

          setProgress({
            stage: 'finalizing',
            percent: 95,
            message: 'Finalizing video clip...',
          });

          const mimeType = captureResult.mimeType || 'video/mp4';
          const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
          const finalBlob = new Blob([captureResult.arrayBuffer], { type: mimeType });
          const baseTitle = videoTitle || 'CodeNest_Video';
          const finalFilename = generateClipFilename(baseTitle, startTime, endTime, ext);
          const blobUrl = URL.createObjectURL(finalBlob);

          setProgress({
            stage: 'done',
            percent: 100,
            message: 'Capture complete! Ready to preview.',
          });
          await new Promise((r) => setTimeout(r, 450));

          setResult({
            blobUrl,
            blob: finalBlob,
            filename: finalFilename,
            fileSize: finalBlob.size,
            duration: captureResult.duration,
            modeUsed: 'fast',
          });

          setProgress(null);
        } catch (err: any) {
          setError(err?.message || 'Stream capture operation failed.');
        } finally {
          setIsProcessing(false);
        }
        return;
      }

      // Tier 3: Direct MP4 Smart Range & Stream-Copy Engine
      const engine = new TrimEngine();
      engineRef.current = engine;

      try {
        const trimResult = await engine.processClip(
          {
            sourceUrl: url,
            videoTitle,
            startTime,
            endTime,
            mode,
            includeAudio,
          },
          (prog) => {
            setProgress(prog);
          }
        );

        setProgress({
          stage: 'done',
          percent: 100,
          message: 'Clip created successfully! Ready to preview.',
        });
        await new Promise((r) => setTimeout(r, 450));

        setResult(trimResult);
        setProgress(null);
      } catch (err: any) {
        setError(err?.message || 'Trimming operation failed.');
      } finally {
        setIsProcessing(false);
        engineRef.current = null;
      }
    },
    [startTime, endTime, mode, includeAudio, options]
  );

  const cancelTrim = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (engineRef.current) {
      engineRef.current.cancel();
      engineRef.current = null;
    }
    if (options?.onCancelStreamCapture) {
      options.onCancelStreamCapture().catch(() => {});
    }
    setIsProcessing(false);
    setProgress(null);
  }, [options]);

  const resetResult = useCallback(() => {
    if (result?.blobUrl) {
      URL.revokeObjectURL(result.blobUrl);
    }
    setResult(null);
    setProgress(null);
    setError(null);
  }, [result]);

  return {
    startTime,
    endTime,
    mode,
    includeAudio,
    progress,
    result,
    error,
    isProcessing,
    serverCapabilities,
    setStartTime,
    setEndTime,
    setMode,
    setIncludeAudio,
    startTrim,
    cancelTrim,
    resetResult,
  };
}
