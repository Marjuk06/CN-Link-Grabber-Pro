import React from 'react';
import { RotateCw, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  tabTitle?: string;
  isScanning: boolean;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({ tabTitle, isScanning, onRefresh }) => {
  const handleBackToLinks = () => {
    try {
      window.parent.postMessage({ action: 'cn_back_to_links' }, '*');
    } catch {}
  };

  return (
    <header className="app-header">
      <div className="brand-wrapper">
        <div className="brand-icon">
          <span style={{ fontWeight: 800, fontSize: '11px', letterSpacing: '-0.02em', color: '#ffffff' }}>CN</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <h1 className="brand-title">CN Grabber</h1>
          <span className="brand-badge">PRO</span>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="btn-back-links"
          onClick={handleBackToLinks}
          title="Return to link grabber list"
          id="btn-header-back-to-links"
        >
          <ArrowLeft size={12} />
          <span>Links</span>
        </button>

        <button
          className="icon-btn"
          onClick={onRefresh}
          title="Rescan page for videos"
          disabled={isScanning}
          id="btn-rescan-videos"
        >
          <RotateCw size={13} className={isScanning ? 'spin-animation' : ''} />
        </button>
      </div>
    </header>
  );
};
