import React from 'react';
import { TrimProgress } from '../../types/trim';
import { XCircle } from 'lucide-react';
import { M3Spinner } from './M3Spinner';
import { M3WavyProgress } from './M3WavyProgress';

interface ProgressCardProps {
  progress: TrimProgress;
  onCancel: () => void;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ progress, onCancel }) => {
  return (
    <div className="progress-card">
      <div className="progress-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <M3Spinner size={22} color="#BE185D" contained={false} />
          <span className="progress-label" style={{ textTransform: 'capitalize' }}>
            {progress.stage}...
          </span>
        </div>
        <span className="progress-percent">{progress.percent}%</span>
      </div>

      <div style={{ margin: '4px 0' }}>
        <M3WavyProgress percent={progress.percent} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <p className="progress-message">{progress.message}</p>
        <button
          className="icon-btn"
          style={{ padding: '4px 8px', fontSize: '11px', display: 'inline-flex', gap: '4px' }}
          onClick={onCancel}
          title="Cancel operation"
          id="btn-cancel-trim"
        >
          <XCircle size={12} />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
};
