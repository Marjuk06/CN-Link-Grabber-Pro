import { DetectedVideo, VideoSourceItem } from '../types/video';

export class VideoDetector {
  private videoMap = new Map<string, HTMLVideoElement>();

  /**
   * Scans the document and shadow roots for HTML5 video elements
   */
  public detectVideos(): DetectedVideo[] {
    this.videoMap.clear();
    const videoElements: HTMLVideoElement[] = [];

    // Query top document
    const topVideos = Array.from(document.querySelectorAll('video'));
    videoElements.push(...topVideos);

    // Scan open shadow roots if any
    const allCustomElements = Array.from(document.querySelectorAll('*'));
    for (const el of allCustomElements) {
      if (el.shadowRoot) {
        const shadowVideos = Array.from(el.shadowRoot.querySelectorAll('video'));
        videoElements.push(...shadowVideos);
      }
    }

    const detected: DetectedVideo[] = [];

    videoElements.forEach((video, index) => {
      const id = `cf-video-${index}`;
      video.setAttribute('data-clipforge-id', id);
      this.videoMap.set(id, video);

      // Collect sources
      const sources: VideoSourceItem[] = [];
      const srcAttr = video.getAttribute('src');
      if (srcAttr) {
        sources.push({ src: video.src, type: video.getAttribute('type') || undefined });
      }

      const sourceChildren = Array.from(video.querySelectorAll('source'));
      sourceChildren.forEach((sc) => {
        const sSrc = sc.src || sc.getAttribute('src');
        if (sSrc) {
          sources.push({ src: sSrc, type: sc.type || undefined });
        }
      });

      const effectiveSrc = video.currentSrc || video.src || (sources[0]?.src ?? '');
      const isBlob = effectiveSrc.startsWith('blob:');
      const isHlsOrDash =
        effectiveSrc.includes('.m3u8') ||
        effectiveSrc.includes('.mpd') ||
        sources.some((s) => (s.type && (s.type.includes('mpegurl') || s.type.includes('dash'))) || false);

      const mimeType = this.guessMimeType(effectiveSrc, sources);

      detected.push({
        id,
        src: video.src || '',
        currentSrc: effectiveSrc,
        pageTitle: document.title || 'Web Video',
        pageUrl: window.location.href,
        duration: isNaN(video.duration) ? 0 : video.duration,
        currentTime: video.currentTime || 0,
        videoWidth: video.videoWidth || 0,
        videoHeight: video.videoHeight || 0,
        paused: video.paused,
        muted: video.muted,
        volume: video.volume,
        playbackRate: video.playbackRate,
        sources,
        mimeType,
        isHlsOrDash,
        isBlob,
        isDirectMedia: !isBlob && !isHlsOrDash && effectiveSrc.length > 0,
      });
    });

    return detected;
  }

  public getVideoElement(id: string): HTMLVideoElement | undefined {
    return this.videoMap.get(id);
  }

  private guessMimeType(src: string, sources: VideoSourceItem[]): string {
    for (const s of sources) {
      if (s.type) return s.type;
    }
    const clean = src.split('?')[0].toLowerCase();
    if (clean.endsWith('.mp4')) return 'video/mp4';
    if (clean.endsWith('.webm')) return 'video/webm';
    if (clean.endsWith('.mkv')) return 'video/x-matroska';
    if (clean.endsWith('.m3u8')) return 'application/x-mpegURL';
    if (clean.endsWith('.mpd')) return 'application/dash+xml';
    return 'video/mp4';
  }
}
