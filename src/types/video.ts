export interface VideoSourceItem {
  src: string;
  type?: string;
}

export interface DetectedVideo {
  id: string;
  src: string;
  currentSrc: string;
  pageTitle: string;
  pageUrl: string;
  duration: number;
  currentTime: number;
  videoWidth: number;
  videoHeight: number;
  paused: boolean;
  muted: boolean;
  volume: number;
  playbackRate: number;
  sources: VideoSourceItem[];
  mimeType: string;
  isHlsOrDash: boolean;
  isBlob: boolean;
  isDirectMedia: boolean;
  seekableRange?: { start: number; end: number };
}

export interface ServerCapabilities {
  url: string;
  acceptRanges: boolean;
  contentLength: number | null;
  contentType: string | null;
  etag: string | null;
  isCorsRestricted: boolean;
  isRangeCompliant: boolean;
}
