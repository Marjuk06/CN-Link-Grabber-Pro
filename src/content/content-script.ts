import { VideoDetector } from './video-detector';
import { PlayerController } from './player-controller';
import { KeyboardShortcutsManager } from './keyboard-shortcuts';
import { formatTimecode } from '../core/utils/timecode';
import { ExtensionMessage } from '../types/extension';

(() => {
  if ((window as any).__CLIPFORGE_CONTENT_SCRIPT_LOADED__) return;
  (window as any).__CLIPFORGE_CONTENT_SCRIPT_LOADED__ = true;

  const detector = new VideoDetector();
  const player = new PlayerController();
  const shortcuts = new KeyboardShortcutsManager();

  let activeVideoId: string | null = null;
  let cachedStartTime = 0;
  let cachedEndTime = 0;

  function selectVideo(id: string) {
    activeVideoId = id;
    const videoEl = detector.getVideoElement(id);
    player.setActiveVideo(videoEl || null, (currentTime, paused) => {
      chrome.runtime.sendMessage({
        type: 'TIME_UPDATE',
        payload: {
          videoId: id,
          currentTime,
          paused,
        },
      }).catch(() => {});
    });
  }

  // Initialize keyboard shortcuts
  shortcuts.init({
    onSetInPoint: () => {
      const curTime = player.getCurrentTime();
      cachedStartTime = curTime;
      shortcuts.showHudToast(`In Point set to ${formatTimecode(curTime)}`, 'in-point');

      chrome.runtime.sendMessage({
        type: 'IN_POINT_SET',
        payload: { time: curTime, videoId: activeVideoId },
      }).catch(() => {});
    },
    onSetOutPoint: () => {
      const curTime = player.getCurrentTime();
      cachedEndTime = curTime;
      shortcuts.showHudToast(`Out Point set to ${formatTimecode(curTime)}`, 'out-point');

      chrome.runtime.sendMessage({
        type: 'OUT_POINT_SET',
        payload: { time: curTime, videoId: activeVideoId },
      }).catch(() => {});
    },
    onPreviewSelection: () => {
      if (cachedEndTime > cachedStartTime) {
        shortcuts.showHudToast(`Previewing: ${formatTimecode(cachedStartTime)} - ${formatTimecode(cachedEndTime)}`, 'preview');
        player.previewRange(cachedStartTime, cachedEndTime);
      } else {
        shortcuts.showHudToast('Set In [I] and Out [O] points first', 'warning');
      }
    },
  });

  function findPageHlsStream(): string | null {
    try {
      const entries = performance.getEntriesByType('resource');
      for (let i = entries.length - 1; i >= 0; i--) {
        const name = entries[i].name;
        const clean = name.split('?')[0].toLowerCase();
        if (
          clean.endsWith('.m3u8') ||
          clean.endsWith('.mpd') ||
          name.includes('.m3u8') ||
          name.includes('.mpd')
        ) {
          return name;
        }
      }
    } catch {}
    return null;
  }

  // Listen for messages from Side Panel
  chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender, sendResponse) => {
    if (!message || !message.type) return false;

    switch (message.type) {
      case 'DETECT_VIDEOS': {
        const videos = detector.detectVideos();
        if (videos.length > 0 && !activeVideoId) {
          selectVideo(videos[0].id);
        }
        const hlsStreamUrl = findPageHlsStream();
        sendResponse({ success: true, videos, hlsStreamUrl });
        break;
      }

      case 'SELECT_VIDEO': {
        const { videoId } = message.payload || {};
        if (videoId) {
          selectVideo(videoId);
          sendResponse({ success: true });
        }
        break;
      }

      case 'SEEK_VIDEO': {
        const { time } = message.payload || {};
        if (typeof time === 'number') {
          player.seek(time);
          sendResponse({ success: true });
        }
        break;
      }

      case 'PLAY_VIDEO': {
        player.play();
        sendResponse({ success: true });
        break;
      }

      case 'PAUSE_VIDEO': {
        player.pause();
        sendResponse({ success: true });
        break;
      }

      case 'PREVIEW_RANGE': {
        const { startTime, endTime } = message.payload || {};
        if (typeof startTime === 'number' && typeof endTime === 'number') {
          cachedStartTime = startTime;
          cachedEndTime = endTime;
          player.previewRange(startTime, endTime);
          sendResponse({ success: true });
        }
        break;
      }

      case 'STOP_PREVIEW': {
        player.pause();
        sendResponse({ success: true });
        break;
      }

      case 'START_STREAM_CAPTURE': {
        const { startTime, endTime } = message.payload || {};
        (async () => {
          try {
            shortcuts.showHudToast('Capturing video stream...', 'preview');
            const result = await player.captureStreamRange(
              startTime,
              endTime,
              (elapsedSec, totalSec) => {
                chrome.runtime.sendMessage({
                  type: 'CAPTURE_PROGRESS',
                  payload: {
                    elapsedSec,
                    totalSec,
                    percent: Math.min(99, Math.round((elapsedSec / totalSec) * 100)),
                  },
                }).catch(() => {});
              }
            );

            shortcuts.showHudToast('Stream capture complete! Preparing clip...', 'scissors');

            // Read the recorded blob as a Data URL (base64) so it passes safely through extension messaging
            const reader = new FileReader();
            reader.onerror = () => {
              sendResponse({ success: false, error: 'Failed to read recorded video stream.' });
            };

            reader.onloadend = async () => {
              const dataUrl = reader.result as string;
              if (!dataUrl) {
                sendResponse({ success: false, error: 'Empty video stream data received.' });
                return;
              }

              const CHUNK_SIZE = 4 * 1024 * 1024; // 4MB chunks
              const totalChunks = Math.ceil(dataUrl.length / CHUNK_SIZE);
              const transferId = `clip-${Date.now()}`;

              // Direct single-message transfer for clips under 4MB
              if (totalChunks <= 1) {
                sendResponse({
                  success: true,
                  dataUrl,
                  mimeType: result.mimeType,
                  duration: result.duration,
                  fileSize: result.fileSize,
                });
                return;
              }

              // Chunked transfer for larger recordings
              try {
                for (let i = 0; i < totalChunks; i++) {
                  const chunk = dataUrl.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
                  await chrome.runtime.sendMessage({
                    type: 'STREAM_DATA_CHUNK',
                    payload: {
                      transferId,
                      index: i,
                      totalChunks,
                      chunk,
                    },
                  });
                }

                sendResponse({
                  success: true,
                  transferId,
                  totalChunks,
                  mimeType: result.mimeType,
                  duration: result.duration,
                  fileSize: result.fileSize,
                });
              } catch (chunkErr: any) {
                console.error('Failed to send video stream chunks:', chunkErr);
                sendResponse({ success: false, error: 'Failed to transfer video stream packets.' });
              }
            };

            reader.readAsDataURL(result.blob);
          } catch (err: any) {
            console.error('Stream capture error:', err);
            sendResponse({ success: false, error: err?.message || 'Stream capture failed' });
          }
        })();
        return true; // async sendResponse
      }

      case 'CANCEL_STREAM_CAPTURE': {
        player.cancelCapture();
        sendResponse({ success: true });
        break;
      }

      case 'GET_PLAYBACK_STATE': {
        sendResponse({
          success: true,
          currentTime: player.getCurrentTime(),
          duration: player.getDuration(),
        });
        break;
      }

      default:
        break;
    }

    return true;
  });

  // Auto-detect on page load
  setTimeout(() => {
    const videos = detector.detectVideos();
    if (videos.length > 0) {
      selectVideo(videos[0].id);
    }
  }, 500);
})();
