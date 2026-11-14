import { DetectedVideo } from './video';

export type ExtensionMessageType =
  | 'DETECT_VIDEOS'
  | 'VIDEOS_FOUND'
  | 'SELECT_VIDEO'
  | 'SEEK_VIDEO'
  | 'PLAY_VIDEO'
  | 'PAUSE_VIDEO'
  | 'PREVIEW_RANGE'
  | 'STOP_PREVIEW'
  | 'START_STREAM_CAPTURE'
  | 'CANCEL_STREAM_CAPTURE'
  | 'CAPTURE_PROGRESS'
  | 'GET_PLAYBACK_STATE'
  | 'TIME_UPDATE'
  | 'IN_POINT_SET'
  | 'OUT_POINT_SET'
  | 'STREAM_DATA_CHUNK'
  | 'GET_DETECTED_STREAMS'
  | 'DOWNLOAD_CLIP'
  | 'CLIP_DOWNLOAD_COMPLETE';

export interface ExtensionMessage<T = any> {
  type: ExtensionMessageType;
  payload?: T;
  timestamp?: number;
}

export interface SeekPayload {
  videoId: string;
  time: number;
}

export interface PreviewRangePayload {
  videoId: string;
  startTime: number;
  endTime: number;
}

export interface StreamCapturePayload {
  videoId: string;
  startTime: number;
  endTime: number;
  videoTitle?: string;
}

export interface TimeUpdatePayload {
  videoId: string;
  currentTime: number;
  paused: boolean;
}

export interface DownloadClipPayload {
  blobUrl: string;
  filename: string;
}
