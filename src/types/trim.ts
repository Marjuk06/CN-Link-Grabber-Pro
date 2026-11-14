export type TrimMode = 'fast' | 'accurate';

export type TrimStage =
  | 'idle'
  | 'inspecting'
  | 'downloading'
  | 'analyzing'
  | 'capturing'
  | 'trimming'
  | 'muxing'
  | 'finalizing'
  | 'done'
  | 'error';

export interface TrimJobConfig {
  sourceUrl: string;
  videoTitle?: string;
  startTime: number;
  endTime: number;
  mode: TrimMode;
  includeAudio: boolean;
  customFilename?: string;
}

export interface TrimProgress {
  stage: TrimStage;
  percent: number;
  message: string;
  bytesReceived?: number;
  totalBytes?: number;
  error?: string;
}

export interface TrimResult {
  blobUrl: string;
  blob: Blob;
  filename: string;
  fileSize: number;
  duration: number;
  modeUsed: TrimMode;
}
