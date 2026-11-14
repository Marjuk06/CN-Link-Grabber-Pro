export interface ShortcutHandlers {
  onSetInPoint: () => void;
  onSetOutPoint: () => void;
  onPreviewSelection: () => void;
}

export type HudIconType = 'in-point' | 'out-point' | 'preview' | 'warning' | 'scissors';

export class KeyboardShortcutsManager {
  private handlers: ShortcutHandlers | null = null;
  private toastElement: HTMLDivElement | null = null;
  private toastTimeout: any = null;

  public init(handlers: ShortcutHandlers): void {
    this.handlers = handlers;
    window.addEventListener('keydown', this.handleKeyDown, true);
  }

  public destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown, true);
    if (this.toastElement && this.toastElement.parentNode) {
      this.toastElement.parentNode.removeChild(this.toastElement);
    }
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    // Ignore if user is typing into input, textarea, or contentEditable element
    const active = document.activeElement;
    if (
      active &&
      (active.tagName === 'INPUT' ||
        active.tagName === 'TEXTAREA' ||
        (active as HTMLElement).isContentEditable)
    ) {
      return;
    }

    if (e.metaKey || e.ctrlKey || e.altKey) return;

    const key = e.key.toLowerCase();
    if (key === 'i') {
      e.preventDefault();
      if (this.handlers) this.handlers.onSetInPoint();
    } else if (key === 'o') {
      e.preventDefault();
      if (this.handlers) this.handlers.onSetOutPoint();
    } else if (key === 'p') {
      e.preventDefault();
      if (this.handlers) this.handlers.onPreviewSelection();
    }
  };

  private getSvgIcon(type: HudIconType): string {
    switch (type) {
      case 'in-point':
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>`;
      case 'out-point':
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`;
      case 'preview':
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="#10b981" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
      case 'warning':
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
      case 'scissors':
      default:
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`;
    }
  }

  /**
   * Displays an elegant floating HUD toast on screen with SVG icon
   */
  public showHudToast(message: string, iconType: HudIconType = 'scissors'): void {
    if (!this.toastElement) {
      this.toastElement = document.createElement('div');
      this.toastElement.id = 'clipforge-hud-toast';
      Object.assign(this.toastElement.style, {
        position: 'fixed',
        bottom: '36px',
        right: '36px',
        zIndex: '2147483647',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 18px',
        background: 'rgba(17, 24, 39, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '9999px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
        color: '#f3f4f6',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '13px',
        fontWeight: '600',
        letterSpacing: '0.01em',
        pointerEvents: 'none',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: '0',
        transform: 'translateY(12px) scale(0.96)',
      });
      document.body.appendChild(this.toastElement);
    }

    const svg = this.getSvgIcon(iconType);

    this.toastElement.innerHTML = `
      <span style="display: inline-flex; align-items: center;">${svg}</span>
      <span style="color: #818cf8; font-weight: 700;">CN ClipForge:</span>
      <span>${message}</span>
    `;

    // Trigger appear transition
    requestAnimationFrame(() => {
      if (this.toastElement) {
        this.toastElement.style.opacity = '1';
        this.toastElement.style.transform = 'translateY(0) scale(1)';
      }
    });

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      if (this.toastElement) {
        this.toastElement.style.opacity = '0';
        this.toastElement.style.transform = 'translateY(12px) scale(0.96)';
      }
    }, 2000);
  }
}
