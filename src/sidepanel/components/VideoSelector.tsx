import React from 'react';
import { DetectedVideo, ServerCapabilities } from '../../types/video';
import { formatTimecode } from '../../core/utils/timecode';
import { Film, CheckCircle2, Zap } from 'lucide-react';
import { M3Spinner } from './M3Spinner';

interface VideoSelectorProps {
  videos: DetectedVideo[];
  selectedVideo: DetectedVideo | null;
  serverCapabilities: ServerCapabilities | null;
  hasHlsStream?: boolean;
  isScanning?: boolean;
  onSelectVideo: (id: string) => void;
}

export const VideoSelector: React.FC<VideoSelectorProps> = ({
  videos,
  selectedVideo,
  serverCapabilities,
  hasHlsStream,
  isScanning,
  onSelectVideo,
}) => {
  if (isScanning) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '24px 14px' }}>
        <M3Spinner size={48} color="#BE185D" contained={true} style={{ margin: '0 auto 10px' }} />
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
          Detecting Video Stream...
        </h3>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Scanning active tab, media tracks, and HLS/DASH streams...
        </p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '24px 14px' }}>
        <M3Spinner size={44} color="#BE185D" contained={true} style={{ margin: '0 auto 10px' }} />
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
          Scanning for Video Streams...
        </h3>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Play a lecture video on this page to grab stream coordinates.
        </p>
      </div>
    );
  }

  const isDurationBuffering = !selectedVideo?.duration || selectedVideo.duration === 0;

  const durationStr = !isDurationBuffering
    ? formatTimecode(selectedVideo!.duration)
    : 'Buffering...';

  const resolutionStr =
    selectedVideo && selectedVideo.videoWidth > 0
      ? `${selectedVideo.videoWidth}x${selectedVideo.videoHeight}`
      : 'Auto Res';

  return (
    <div className="glass-card">
      <div className="card-title">
        <Film size={14} color="#BE185D" />
        <span>Current Video</span>
      </div>

      {videos.length > 1 && (
        <div style={{ marginBottom: '10px' }}>
          <select
            className="video-select"
            value={selectedVideo?.id || ''}
            onChange={(e) => onSelectVideo(e.target.value)}
            id="select-video-dropdown"
          >
            {videos.map((v, idx) => (
              <option key={v.id} value={v.id}>
                Video {idx + 1} ({v.duration > 0 ? formatTimecode(v.duration) : 'Buffering'}) - {v.mimeType || 'MP4'}
              </option>
            ))}
          </select>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          {isDurationBuffering ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <M3Spinner size={16} color="#BE185D" contained={false} />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#FDA4AF' }}>
                Analyzing Duration...
              </span>
            </div>
          ) : (
            <>
              <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }} className="timecode-tabular">
                {durationStr}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '6px' }}>• MP4 Stream</span>
            </>
          )}
        </div>

        {selectedVideo?.isDirectMedia && (
          <span style={{ fontSize: '11px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
            <CheckCircle2 size={13} /> Direct Source
          </span>
        )}
      </div>

      <div className="badge-group">
        <span className="badge badge-indigo">{resolutionStr}</span>
        <span className="badge badge-cyan">{selectedVideo?.mimeType || 'video/mp4'}</span>

        {serverCapabilities?.acceptRanges && (
          <span className="badge badge-emerald" title="Server supports HTTP Byte-Ranges for fast partial fetching">
            <Zap size={11} /> Range Supported
          </span>
        )}

        {hasHlsStream && (
          <span className="badge badge-emerald" title="Instant parallel segment download">
            <Zap size={11} /> Instant HLS Cut
          </span>
        )}

        {selectedVideo?.isBlob && !hasHlsStream && (
          <span className="badge badge-amber" title="In-page live stream capture enabled">
            <Zap size={11} /> Stream Capture
          </span>
        )}

        {!selectedVideo?.isBlob && !hasHlsStream && selectedVideo?.isHlsOrDash && (
          <span className="badge badge-amber" title="Segmented streaming video">
            HLS/DASH Stream
          </span>
        )}
      </div>
    </div>
  );
};
