import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onRetry }) => {
  return (
    <div className="alert-box">
      <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 600 }}>Error encountered</p>
        <p style={{ marginTop: '2px', opacity: 0.9 }}>{message}</p>
        {onRetry && (
          <button
            className="btn-secondary"
            style={{ marginTop: '8px', padding: '4px 10px', fontSize: '11px' }}
            onClick={onRetry}
            id="btn-error-retry"
          >
            <RefreshCw size={11} />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
};
