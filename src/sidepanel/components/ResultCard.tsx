import React, { useState } from 'react';
import { TrimResult } from '../../types/trim';
import { formatDurationFriendly } from '../../core/utils/timecode';
import { Download, RefreshCw, CheckCircle2, FileVideo } from 'lucide-react';

interface ResultCardProps {
  result: TrimResult;
  onDownload: (filename?: string) => void;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onDownload, onReset }) => {
  const sizeMb = (result.fileSize / (1024 * 1024)).toFixed(2);
  const defaultBaseName = result.filename.replace(/\.(mp4|webm|ts|mkv)$/i, '');
  const [customName, setCustomName] = useState(defaultBaseName);

  const handleDownloadClick = () => {
    const rawName = customName.trim() || defaultBaseName;
    const finalFilename = rawName.endsWith('.mp4') ? rawName : `${rawName}.mp4`;
    onDownload(finalFilename);
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
          <CheckCircle2 size={16} />
          <span style={{ fontSize: '13px', fontWeight: 700 }}>Clip Ready</span>
        </div>
        <span className="badge badge-indigo">{result.modeUsed.toUpperCase()} TRIM</span>
      </div>

      {/* Embedded Mini Preview Player */}
      <video
        src={result.blobUrl}
        controls
        className="preview-player"
        playsInline
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>
        <span>Duration: <strong style={{ color: '#f8fafc' }}>{formatDurationFriendly(result.duration)}</strong></span>
        <span>Size: <strong style={{ color: '#f8fafc' }}>{sizeMb} MB</strong></span>
      </div>

      {/* Editable Custom File Name Input */}
      <div style={{ marginBottom: '14px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#94a3b8', marginBottom: '5px', fontWeight: 600 }}>
          <FileVideo size={12} color="#818cf8" />
          <span>Save As (Custom Name)</span>
        </label>
        <div className="custom-filename-box">
          <input
            type="text"
            className="custom-filename-input"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder={defaultBaseName}
            id="input-custom-filename"
          />
          <span className="filename-ext-tag">.mp4</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          className="btn-primary"
          onClick={handleDownloadClick}
          id="btn-download-clip"
        >
          <Download size={15} />
          <span>Download MP4 ({sizeMb} MB)</span>
        </button>

        <button
          className="btn-secondary"
          onClick={onReset}
          id="btn-trim-another"
        >
          <RefreshCw size={13} />
          <span>New Trim</span>
        </button>
      </div>
    </div>
  );
};
