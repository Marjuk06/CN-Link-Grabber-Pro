import React, { useState, useEffect } from 'react';
import { useExtensionBridge } from './hooks/useExtensionBridge';
import { useVideoTrimmer } from './hooks/useVideoTrimmer';
import { Header } from './components/Header';
import { VideoSelector } from './components/VideoSelector';
import { Timeline } from './components/Timeline';
import { TimestampInputs } from './components/TimestampInputs';
import { PlaybackBar } from './components/PlaybackBar';
import { ModeSelector } from './components/ModeSelector';
import { ProgressCard } from './components/ProgressCard';
import { ResultCard } from './components/ResultCard';
import { ErrorAlert } from './components/ErrorAlert';
import { M3Spinner } from './components/M3Spinner';
import { Scissors, AlertTriangle } from 'lucide-react';

export const App: React.FC = () => {
  const {
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
    previewRange,
    stopPreview,
    startStreamCapture,
    cancelStreamCapture,
    queryCurrentTime,
    triggerDownload,
  } = useExtensionBridge();

  const videoDuration = selectedVideo?.duration || 0;
  const sourceUrl = selectedVideo?.currentSrc || selectedVideo?.src;
  const isBlobVideo = Boolean(selectedVideo?.isBlob || sourceUrl?.startsWith('blob:'));
  const hasHlsStream = Boolean(detectedHlsUrl);
  const isYouTube = Boolean(
    selectedVideo?.pageUrl?.includes('youtube.com') ||
    selectedVideo?.pageUrl?.includes('youtu.be') ||
    activeTabTitle?.toLowerCase().includes('youtube')
  );

  const {
    startTime,
    endTime,
    mode,
    progress,
    result,
    error: trimError,
    isProcessing,
    serverCapabilities,
    setStartTime,
    setEndTime,
    setMode,
    startTrim,
    cancelTrim,
    resetResult,
  } = useVideoTrimmer(videoDuration, sourceUrl, {
    isBlob: isBlobVideo,
    hlsStreamUrl: detectedHlsUrl,
    onStartStreamCapture: startStreamCapture,
    onCancelStreamCapture: cancelStreamCapture,
    captureProgress,
  });

  // Sync in-page keyboard shortcuts (I and O) to the UI
  useEffect(() => {
    if (inPointShortcut !== null && inPointShortcut < endTime) {
      setStartTime(inPointShortcut);
    }
  }, [inPointShortcut, endTime, setStartTime]);

  useEffect(() => {
    if (outPointShortcut !== null && outPointShortcut > startTime) {
      setEndTime(outPointShortcut);
    }
  }, [outPointShortcut, startTime, setEndTime]);

  const handlePreviewToggle = () => {
    if (!isPaused) {
      stopPreview();
    } else {
      previewRange(startTime, endTime);
    }
  };

  const handleJumpStart = () => {
    seek(startTime);
  };

  const handleJumpEnd = () => {
    seek(endTime);
  };

  const handleStartTrimClick = () => {
    if (!sourceUrl) return;
    startTrim(sourceUrl, selectedVideo?.pageTitle);
  };

  const handleDownloadClip = (customFilename?: string) => {
    if (!result) return;
    const finalFilename = customFilename || result.filename;
    triggerDownload(result.blobUrl, finalFilename);
  };

  const isEmbedded =
    (typeof window !== 'undefined' && window.parent !== window) ||
    (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('embedded') === 'true');

  useEffect(() => {
    const handleWindowMsg = (e: MessageEvent) => {
      if (e.data?.action === 'rescan_videos') {
        rescanVideos();
      }
    };
    window.addEventListener('message', handleWindowMsg);
    return () => window.removeEventListener('message', handleWindowMsg);
  }, [rescanVideos]);

  return (
    <div className={`clipforge-app ${isEmbedded ? 'is-embedded-app' : ''}`}>
      {!isEmbedded && (
        <Header
          tabTitle={activeTabTitle}
          isScanning={isScanning}
          onRefresh={rescanVideos}
        />
      )}

      {connectionError && <ErrorAlert message={connectionError} onRetry={rescanVideos} />}

      {isYouTube ? (
        <div
          className="glass-card"
          style={{
            marginTop: '16px',
            padding: '16px 18px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'left',
          }}
        >
          <AlertTriangle size={20} color="#f59e0b" style={{ flexShrink: 0 }} />
          <p
            style={{
              fontSize: '13px',
              color: '#fef3c7',
              lineHeight: '1.5',
              margin: 0,
              fontWeight: 500,
            }}
          >
            CN Grabber PRO does not support YouTube video trimming or downloading.
          </p>
        </div>
      ) : (
        <>
          <VideoSelector
            videos={videos}
            selectedVideo={selectedVideo}
            serverCapabilities={serverCapabilities}
            hasHlsStream={hasHlsStream}
            onSelectVideo={selectVideo}
            isScanning={isScanning}
          />

          {videoDuration <= 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '38px 18px', margin: '6px 0' }}>
              <M3Spinner size={54} color="#BE185D" contained={true} style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Buffering & Analyzing Video Stream...
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', maxWidth: '320px', margin: '6px auto 0', lineHeight: 1.5 }}>
                Inspecting stream headers, moov metadata, and keyframe intervals. Please wait...
              </p>
            </div>
          ) : (
            <>
              {/* Dual Handle Timeline */}
              <div className="glass-card">
                <div className="card-title">
                  <span>Timeline</span>
                </div>

                <Timeline
                  duration={videoDuration}
                  startTime={startTime}
                  endTime={endTime}
                  currentTime={currentTime}
                  onStartTimeChange={setStartTime}
                  onEndTimeChange={setEndTime}
                  onSeek={seek}
                />

                <PlaybackBar
                  isPaused={isPaused}
                  onJumpStart={handleJumpStart}
                  onPreviewToggle={handlePreviewToggle}
                  onJumpEnd={handleJumpEnd}
                />
              </div>

              {/* Precision Timestamp Inputs */}
              <div className="glass-card">
                <TimestampInputs
                  duration={videoDuration}
                  startTime={startTime}
                  endTime={endTime}
                  currentTime={currentTime}
                  onStartTimeChange={setStartTime}
                  onEndTimeChange={setEndTime}
                  onQueryCurrentTime={queryCurrentTime}
                />

                <ModeSelector
                  mode={mode}
                  onModeChange={setMode}
                  isBlob={isBlobVideo}
                  hasHlsStream={hasHlsStream}
                />
              </div>

              {/* Active Processing or Completed Result Card */}
              {isProcessing && progress ? (
                <ProgressCard progress={progress} onCancel={cancelTrim} />
              ) : result ? (
                <ResultCard
                  result={result}
                  onDownload={handleDownloadClip}
                  onReset={resetResult}
                />
              ) : (
                <button
                  className="btn-primary"
                  onClick={handleStartTrimClick}
                  disabled={!sourceUrl || startTime >= endTime}
                  id="btn-smart-trim"
                >
                  <Scissors size={15} />
                  <span>
                    {hasHlsStream
                      ? 'Trim & Export (HLS)'
                      : isBlobVideo
                      ? 'Capture & Export'
                      : 'Trim & Export'}
                  </span>
                </button>
              )}

              {trimError && <ErrorAlert message={trimError} />}
            </>
          )}
        </>
      )}
    </div>
  );
};
