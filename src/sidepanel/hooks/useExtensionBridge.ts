import { useState, useEffect, useCallback, useRef } from 'react';
import { DetectedVideo } from '../../types/video';
import { ExtensionMessage } from '../../types/extension';

export function useExtensionBridge() {
  const [videos, setVideos] = useState<DetectedVideo[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [inPointShortcut, setInPointShortcut] = useState<number | null>(null);
  const [outPointShortcut, setOutPointShortcut] = useState<number | null>(null);
  const [activeTabTitle, setActiveTabTitle] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [captureProgress, setCaptureProgress] = useState<{
    elapsedSec: number;
    totalSec: number;
    percent: number;
  } | null>(null);
  const [detectedHlsUrl, setDetectedHlsUrl] = useState<string | null>(null);

  const incomingChunksRef = useRef<Map<string, string[]>>(new Map());

  const selectedVideo = videos.find((v) => v.id === selectedVideoId) || videos[0] || null;

  // Send message to active tab content script
  const sendTabMessage = useCallback(async (message: ExtensionMessage): Promise<any> => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) {
        throw new Error('No active browser tab found.');
      }
      return await chrome.tabs.sendMessage(tab.id, message);
    } catch (err: any) {
      console.warn('Error sending message to tab:', err);
      return null;
    }
  }, []);

  // Scan or rescan videos on the active tab
  const rescanVideos = useCallback(async () => {
    setIsScanning(true);
    setConnectionError(null);

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) {
        setConnectionError('No active browser tab found.');
        setIsScanning(false);
        return;
      }

      setActiveTabTitle(tab.title || 'Current Tab');

      // Attempt to communicate with content script
      let response = await chrome.tabs.sendMessage(tab.id, { type: 'DETECT_VIDEOS' }).catch(() => null);

      // If content script was not already loaded (e.g. extension loaded after page open), inject it
      if (!response) {
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content-script.js'],
          });
          // Wait briefly and retry
          await new Promise((r) => setTimeout(r, 200));
          response = await chrome.tabs.sendMessage(tab.id, { type: 'DETECT_VIDEOS' }).catch(() => null);
        } catch (injectErr: any) {
          setConnectionError(
            'Cannot access videos on this restricted page (e.g. chrome://, chrome web store, or protected view).'
          );
          setIsScanning(false);
          return;
        }
      }

      let foundVideos: DetectedVideo[] = response && response.videos ? [...response.videos] : [];

      // Support direct videoUrl query parameter from in-sidebar trigger
      const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const paramVideoUrl = searchParams?.get('videoUrl');
      const paramVideoTitle = searchParams?.get('videoTitle');

      if (paramVideoUrl) {
        const decodedUrl = decodeURIComponent(paramVideoUrl);
        const exists = foundVideos.some(v => v.currentSrc === decodedUrl || v.src === decodedUrl);
        if (!exists) {
          foundVideos.unshift({
            id: 'direct-param-video',
            src: decodedUrl,
            currentSrc: decodedUrl,
            pageTitle: paramVideoTitle ? decodeURIComponent(paramVideoTitle) : 'Selected Video',
            pageUrl: window.location.href,
            duration: 0,
            currentTime: 0,
            videoWidth: 1920,
            videoHeight: 1080,
            paused: true,
            muted: false,
            volume: 1,
            playbackRate: 1,
            sources: [{ src: decodedUrl, type: 'video/mp4' }],
            mimeType: 'video/mp4',
            isHlsOrDash: decodedUrl.includes('.m3u8') || decodedUrl.includes('.mpd'),
            isBlob: decodedUrl.startsWith('blob:'),
            isDirectMedia: true
          });
        }
      }

      setVideos(foundVideos);
      if (foundVideos.length > 0) {
        setSelectedVideoId(foundVideos[0].id);
        setCurrentTime(foundVideos[0].currentTime || 0);
      } else {
        setSelectedVideoId(null);
      }

      // Check detected streams from content script or background service-worker
      let foundHlsUrl: string | null = response?.hlsStreamUrl || null;
      if (!foundHlsUrl) {
        try {
          const bgRes = await chrome.runtime.sendMessage({
            type: 'GET_DETECTED_STREAMS',
            payload: { tabId: tab.id },
          });
          if (bgRes && bgRes.streams && bgRes.streams.length > 0) {
            foundHlsUrl = bgRes.streams[0];
          }
        } catch {}
      }
      setDetectedHlsUrl(foundHlsUrl);
    } catch (err: any) {
      setConnectionError(err?.message || 'Failed to detect videos.');
    } finally {
      setIsScanning(false);
    }
  }, []);

  // Set selected video
  const selectVideo = useCallback(
    (id: string) => {
      setSelectedVideoId(id);
      sendTabMessage({ type: 'SELECT_VIDEO', payload: { videoId: id } });
    },
    [sendTabMessage]
  );

  // Player controls
  const seek = useCallback(
    (time: number) => {
      setCurrentTime(time);
      sendTabMessage({ type: 'SEEK_VIDEO', payload: { time } });
    },
    [sendTabMessage]
  );

  const play = useCallback(() => {
    setIsPaused(false);
    sendTabMessage({ type: 'PLAY_VIDEO' });
  }, [sendTabMessage]);

  const pause = useCallback(() => {
    setIsPaused(true);
    sendTabMessage({ type: 'PAUSE_VIDEO' });
  }, [sendTabMessage]);

  const previewRange = useCallback(
    (startTime: number, endTime: number) => {
      setIsPaused(false);
      sendTabMessage({
        type: 'PREVIEW_RANGE',
        payload: { startTime, endTime },
      });
    },
    [sendTabMessage]
  );

  const stopPreview = useCallback(() => {
    setIsPaused(true);
    sendTabMessage({ type: 'STOP_PREVIEW' });
  }, [sendTabMessage]);

  const startStreamCapture = useCallback(
    async (
      startTime: number,
      endTime: number
    ): Promise<{ arrayBuffer: ArrayBuffer; mimeType: string; duration: number }> => {
      setCaptureProgress({ elapsedSec: 0, totalSec: Math.max(0.1, endTime - startTime), percent: 0 });

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) {
        throw new Error('No active browser tab found.');
      }

      const response = await chrome.tabs.sendMessage(tab.id, {
        type: 'START_STREAM_CAPTURE',
        payload: { startTime, endTime },
      });

      setCaptureProgress(null);

      if (!response || !response.success) {
        throw new Error(response?.error || 'Stream capture failed or was cancelled.');
      }

      let fullDataUrl: string;

      if (response.dataUrl) {
        fullDataUrl = response.dataUrl;
      } else if (response.transferId) {
        const chunks = incomingChunksRef.current.get(response.transferId);
        if (!chunks || chunks.some((c) => typeof c !== 'string')) {
          throw new Error('Video stream packets were dropped or incomplete.');
        }
        fullDataUrl = chunks.join('');
        incomingChunksRef.current.delete(response.transferId);
      } else if (response.arrayBuffer && response.arrayBuffer instanceof ArrayBuffer) {
        return {
          arrayBuffer: response.arrayBuffer,
          mimeType: response.mimeType || 'video/mp4',
          duration: response.duration || Math.max(0.1, endTime - startTime),
        };
      } else if (response.arrayBuffer && Array.isArray(response.arrayBuffer)) {
        return {
          arrayBuffer: new Uint8Array(response.arrayBuffer).buffer,
          mimeType: response.mimeType || 'video/mp4',
          duration: response.duration || Math.max(0.1, endTime - startTime),
        };
      } else {
        throw new Error('No valid video stream data was returned.');
      }

      // Convert dataUrl to native Blob and ArrayBuffer in the side panel context
      const res = await fetch(fullDataUrl);
      const finalBlob = await res.blob();
      const arrayBuffer = await finalBlob.arrayBuffer();

      return {
        arrayBuffer,
        mimeType: response.mimeType || finalBlob.type || 'video/mp4',
        duration: response.duration || Math.max(0.1, endTime - startTime),
      };
    },
    []
  );

  const cancelStreamCapture = useCallback(async () => {
    setCaptureProgress(null);
    return await sendTabMessage({ type: 'CANCEL_STREAM_CAPTURE' });
  }, [sendTabMessage]);

  const queryCurrentTime = useCallback(async (): Promise<number | null> => {
    try {
      const res = await sendTabMessage({ type: 'GET_PLAYBACK_STATE' });
      if (res && typeof res.currentTime === 'number') {
        setCurrentTime(res.currentTime);
        return res.currentTime;
      }
    } catch (err) {
      console.warn('Failed to query current playback state:', err);
    }
    return null;
  }, [sendTabMessage]);

  const triggerDownload = useCallback(async (blobUrl: string, filename: string) => {
    // 1. Direct Chrome Downloads API from side panel
    try {
      if (chrome.downloads && chrome.downloads.download) {
        return await chrome.downloads.download({
          url: blobUrl,
          filename: filename,
          saveAs: true,
        });
      }
    } catch (err) {
      console.warn('Direct chrome.downloads error, attempting fallback:', err);
    }

    // 2. Service Worker fallback
    try {
      await chrome.runtime.sendMessage({
        type: 'DOWNLOAD_CLIP',
        payload: { blobUrl, filename },
      });
      return;
    } catch (err) {
      console.warn('Service worker download fallback failed:', err);
    }

    // 3. Anchor click fallback in Side Panel DOM
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
    }, 500);
  }, []);

  // Listen to incoming messages from content script
  useEffect(() => {
    const handleRuntimeMessage = (message: any) => {
      if (!message || !message.type) return;

      if (message.type === 'TIME_UPDATE') {
        const { currentTime: newTime, paused } = message.payload || {};
        if (typeof newTime === 'number') setCurrentTime(newTime);
        if (typeof paused === 'boolean') setIsPaused(paused);
      } else if (message.type === 'IN_POINT_SET') {
        const { time } = message.payload || {};
        if (typeof time === 'number') {
          setInPointShortcut(time);
        }
      } else if (message.type === 'OUT_POINT_SET') {
        const { time } = message.payload || {};
        if (typeof time === 'number') {
          setOutPointShortcut(time);
        }
      } else if (message.type === 'CAPTURE_PROGRESS') {
        const { elapsedSec, totalSec, percent } = message.payload || {};
        if (typeof elapsedSec === 'number' && typeof totalSec === 'number') {
          setCaptureProgress({ elapsedSec, totalSec, percent: percent ?? 0 });
        }
      } else if (message.type === 'VIDEO_METADATA_LOADED' || message.type === 'VIDEO_UPDATED') {
        const { id, duration, videoWidth, videoHeight } = message.payload || {};
        if (typeof duration === 'number' && duration > 0) {
          setVideos((prev) =>
            prev.map((v) =>
              v.id === id || v.id === 'direct-param-video' || prev.length === 1
                ? {
                    ...v,
                    duration,
                    videoWidth: videoWidth || v.videoWidth || 1920,
                    videoHeight: videoHeight || v.videoHeight || 1080,
                  }
                : v
            )
          );
        }
      } else if (message.type === 'STREAM_DATA_CHUNK') {
        const { transferId, index, totalChunks, chunk } = message.payload || {};
        if (transferId && typeof index === 'number' && typeof chunk === 'string') {
          if (!incomingChunksRef.current.has(transferId)) {
            incomingChunksRef.current.set(transferId, new Array(totalChunks));
          }
          incomingChunksRef.current.get(transferId)![index] = chunk;
        }
      }
    };

    const handleWindowMessage = (e: MessageEvent) => {
      if (e.data?.type === 'VIDEO_METADATA_LOADED' || e.data?.type === 'VIDEO_UPDATED') {
        const { id, duration, videoWidth, videoHeight } = e.data.payload || {};
        if (typeof duration === 'number' && duration > 0) {
          setVideos((prev) =>
            prev.map((v) =>
              v.id === id || v.id === 'direct-param-video' || prev.length === 1
                ? {
                    ...v,
                    duration,
                    videoWidth: videoWidth || v.videoWidth || 1920,
                    videoHeight: videoHeight || v.videoHeight || 1080,
                  }
                : v
            )
          );
        }
      }
    };

    chrome.runtime.onMessage.addListener(handleRuntimeMessage);
    window.addEventListener('message', handleWindowMessage);
    rescanVideos();

    // Listen for tab updates (e.g. navigation)
    const handleTabUpdated = (tabId: number, changeInfo: any) => {
      if (changeInfo.status === 'complete') {
        rescanVideos();
      }
    };

    chrome.tabs.onUpdated.addListener(handleTabUpdated);

    return () => {
      chrome.runtime.onMessage.removeListener(handleRuntimeMessage);
      window.removeEventListener('message', handleWindowMessage);
      chrome.tabs.onUpdated.removeListener(handleTabUpdated);
    };
  }, [rescanVideos]);

  // Resolve metadata duration when selected video has 0 duration
  useEffect(() => {
    if (selectedVideo && selectedVideo.duration === 0 && selectedVideo.currentSrc && !selectedVideo.isBlob) {
      const probe = document.createElement('video');
      probe.preload = 'metadata';
      probe.src = selectedVideo.currentSrc;
      const onLoaded = () => {
        if (!isNaN(probe.duration) && probe.duration > 0) {
          setVideos((prev) =>
            prev.map((v) =>
              v.id === selectedVideo.id
                ? {
                    ...v,
                    duration: probe.duration,
                    videoWidth: probe.videoWidth || 1920,
                    videoHeight: probe.videoHeight || 1080,
                  }
                : v
            )
          );
        }
      };
      probe.addEventListener('loadedmetadata', onLoaded);
      return () => {
        probe.removeEventListener('loadedmetadata', onLoaded);
        probe.src = '';
      };
    }
  }, [selectedVideo]);

  return {
    videos,
    selectedVideo,
    currentTime,
    isPaused,
    inPointShortcut,
    outPointShortcut,
    activeTabTitle,
    isScanning,
    connectionError,
    captureProgress,
    detectedHlsUrl,
    rescanVideos,
    selectVideo,
    seek,
    play,
    pause,
    previewRange,
    stopPreview,
    startStreamCapture,
    cancelStreamCapture,
    queryCurrentTime,
    triggerDownload,
  };
}
