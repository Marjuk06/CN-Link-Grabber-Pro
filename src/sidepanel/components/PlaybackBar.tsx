import React from 'react';
import { SkipBack, Play, Pause, SkipForward } from 'lucide-react';

interface PlaybackBarProps {
  isPaused: boolean;
  onJumpStart: () => void;
  onPreviewToggle: () => void;
  onJumpEnd: () => void;
}

export const PlaybackBar: React.FC<PlaybackBarProps> = ({
  isPaused,
  onJumpStart,
  onPreviewToggle,
  onJumpEnd,
}) => {
  return (
    <div className="playback-controls" style={{ marginTop: '10px' }}>
      <button
        className="control-btn"
        onClick={onJumpStart}
        title="Jump to Start Point"
        id="btn-jump-start"
      >
        <SkipBack size={13} />
        <span>Start</span>
      </button>

      <button
        className={`control-btn ${!isPaused ? 'active' : ''}`}
        onClick={onPreviewToggle}
        title="Preview selected time range"
        id="btn-preview-selection"
      >
        {isPaused ? <Play size={13} fill="currentColor" /> : <Pause size={13} fill="currentColor" />}
        <span>{isPaused ? 'Preview' : 'Pause'}</span>
      </button>

      <button
        className="control-btn"
        onClick={onJumpEnd}
        title="Jump to End Point"
        id="btn-jump-end"
      >
        <span>End</span>
        <SkipForward size={13} />
      </button>
    </div>
  );
};
