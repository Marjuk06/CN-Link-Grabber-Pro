import React from 'react';
import { TrimMode } from '../../types/trim';
import { Zap, Target } from 'lucide-react';

interface ModeSelectorProps {
  mode: TrimMode;
  onModeChange: (mode: TrimMode) => void;
  isBlob?: boolean;
  hasHlsStream?: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onModeChange, isBlob, hasHlsStream }) => {
  return (
    <div style={{ marginTop: '10px' }}>
      {hasHlsStream ? (
        <div className="mode-compact-row" style={{ borderColor: 'rgba(16, 185, 129, 0.25)', background: 'rgba(16, 185, 129, 0.06)' }}>
          <div className="mode-tag-label">
            <Zap size={13} color="#10b981" />
            <span style={{ color: '#34d399' }}>Instant HLS Stream Cut</span>
          </div>
          <span className="mode-subtag" style={{ color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}>Lossless</span>
        </div>
      ) : isBlob ? (
        <div className="mode-compact-row" style={{ borderColor: 'rgba(245, 158, 11, 0.25)', background: 'rgba(245, 158, 11, 0.06)' }}>
          <div className="mode-tag-label">
            <Zap size={13} color="#f59e0b" />
            <span style={{ color: '#fbbf24' }}>Background Stream Capture</span>
          </div>
          <span className="mode-subtag" style={{ color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)' }}>Auto-Mute</span>
        </div>
      ) : (
        <div className="mode-segmented-control">
          <button
            type="button"
            className={`segment-btn ${mode === 'fast' ? 'active' : ''}`}
            onClick={() => onModeChange('fast')}
            id="mode-fast-trim"
          >
            <Zap size={13} />
            <span>Fast Copy</span>
          </button>

          <button
            type="button"
            className={`segment-btn ${mode === 'accurate' ? 'active' : ''}`}
            onClick={() => onModeChange('accurate')}
            id="mode-accurate-trim"
          >
            <Target size={13} />
            <span>Accurate Cut</span>
          </button>
        </div>
      )}
    </div>
  );
};
