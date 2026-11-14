export interface StreamCaptureResult {
  arrayBuffer: ArrayBuffer;
  blob: Blob;
  mimeType: string;
  duration: number;
  fileSize: number;
}

export class PlayerController {
  private activeVideo: HTMLVideoElement | null = null;
  private previewEndTimer: number | null = null;
  private timeUpdateCallback: ((time: number, paused: boolean) => void) | null = null;
  private activeRecorder: MediaRecorder | null = null;
  private captureCancelFlag = false;

  public setActiveVideo(video: HTMLVideoElement | null, onTimeUpdate?: (time: number, paused: boolean) => void): void {
    if (this.activeVideo) {
      this.activeVideo.removeEventListener('timeupdate', this.handleTimeUpdate);
      this.activeVideo.removeEventListener('pause', this.handleTimeUpdate);
      this.activeVideo.removeEventListener('play', this.handleTimeUpdate);
      this.activeVideo.removeEventListener('seeked', this.handleTimeUpdate);
      this.activeVideo.removeEventListener('seeking', this.handleTimeUpdate);
    }

    this.activeVideo = video;
    this.timeUpdateCallback = onTimeUpdate || null;

    if (this.activeVideo) {
      this.activeVideo.addEventListener('timeupdate', this.handleTimeUpdate);
      this.activeVideo.addEventListener('pause', this.handleTimeUpdate);
      this.activeVideo.addEventListener('play', this.handleTimeUpdate);
      this.activeVideo.addEventListener('seeked', this.handleTimeUpdate);
      this.activeVideo.addEventListener('seeking', this.handleTimeUpdate);
      // Immediately notify current position
      this.handleTimeUpdate();
    }
  }

  private handleTimeUpdate = (): void => {
    if (!this.activeVideo || !this.timeUpdateCallback) return;
    this.timeUpdateCallback(this.activeVideo.currentTime, this.activeVideo.paused);
  };

  public seek(seconds: number): void {
    if (!this.activeVideo) return;
    this.activeVideo.currentTime = Math.max(0, Math.min(seconds, this.activeVideo.duration || seconds));
  }

  public play(): void {
    if (!this.activeVideo) return;
    this.activeVideo.play().catch(() => {});
  }

  public pause(): void {
    if (!this.activeVideo) return;
    this.activeVideo.pause();
    this.clearPreviewTimer();
  }

  public previewRange(startTime: number, endTime: number): void {
    if (!this.activeVideo) return;

    this.clearPreviewTimer();
    this.activeVideo.currentTime = startTime;
    this.activeVideo.play().catch(() => {});

    const checkEnd = () => {
      if (!this.activeVideo) return;
      if (this.activeVideo.currentTime >= endTime || this.activeVideo.paused) {
        this.activeVideo.pause();
        this.clearPreviewTimer();
      } else {
        this.previewEndTimer = window.requestAnimationFrame(checkEnd);
      }
    };

    this.previewEndTimer = window.requestAnimationFrame(checkEnd);
  }

  public clearPreviewTimer(): void {
    if (this.previewEndTimer !== null) {
      window.cancelAnimationFrame(this.previewEndTimer);
      this.previewEndTimer = null;
    }
  }

  public cancelCapture(): void {
    this.captureCancelFlag = true;
    if (this.activeRecorder && this.activeRecorder.state !== 'inactive') {
      this.activeRecorder.stop();
    }
    if (this.activeVideo) {
      this.activeVideo.pause();
    }
  }

  /**
   * Universal In-Page Stream Capture:
   * Captures video and audio tracks directly from the HTMLVideoElement using captureStream()
   * and MediaRecorder. Works on ANY video playing in the browser (YouTube, Blob, HLS, DASH).
   */
  public async captureStreamRange(
    startTime: number,
    endTime: number,
    onProgress: (currentSec: number, totalSec: number) => void
  ): Promise<StreamCaptureResult> {
    if (!this.activeVideo) {
      throw new Error('No active video found on page to capture.');
    }

    const video = this.activeVideo;
    this.captureCancelFlag = false;

    // Obtain MediaStream from HTMLVideoElement
    const stream = (video as any).captureStream
      ? (video as any).captureStream()
      : (video as any).mozCaptureStream
      ? (video as any).mozCaptureStream()
      : null;

    if (!stream) {
      throw new Error('Browser does not support captureStream() on this video element.');
    }

    // Pick optimal supported MIME type
    let mimeType = 'video/webm';
    if (typeof MediaRecorder !== 'undefined') {
      if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1,mp4a.40.2')) {
        mimeType = 'video/mp4;codecs=avc1,mp4a.40.2';
      } else if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
        mimeType = 'video/webm;codecs=vp9,opus';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
        mimeType = 'video/webm;codecs=vp8,opus';
      }
    }

    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(stream, { mimeType });
    this.activeRecorder = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    // Seek video to start position
    video.currentTime = startTime;
    try {
      const moviePlayer = (document.getElementById('movie_player') as any);
      if (moviePlayer && typeof moviePlayer.seekTo === 'function') {
        moviePlayer.seekTo(startTime, true);
      }
    } catch {}

    // Wait for seeked event to ensure frames start from exact start timestamp
    await new Promise<void>((resolve) => {
      let resolved = false;
      const onSeeked = () => {
        if (!resolved) {
          resolved = true;
          video.removeEventListener('seeked', onSeeked);
          resolve();
        }
      };
      video.addEventListener('seeked', onSeeked);
      // Fallback timeout in case seeked doesn't fire immediately
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          video.removeEventListener('seeked', onSeeked);
          resolve();
        }
      }, 700);
    });

    if (this.captureCancelFlag) {
      throw new Error('Stream capture cancelled by user.');
    }

    const originalPlaybackRate = video.playbackRate || 1.0;
    video.playbackRate = 1.0;

    const totalDuration = Math.max(0.1, endTime - startTime);

    return new Promise((resolve, reject) => {
      recorder.onerror = (err) => {
        video.playbackRate = originalPlaybackRate;
        reject(err);
      };

      recorder.onstop = async () => {
        this.activeRecorder = null;
        video.playbackRate = originalPlaybackRate;
        if (this.captureCancelFlag) {
          reject(new Error('Stream capture cancelled by user.'));
          return;
        }

        try {
          if (chunks.length === 0) {
            reject(new Error('No video frames were captured from player. Ensure video is playing.'));
            return;
          }
          const finalBlob = new Blob(chunks, { type: mimeType });
          if (finalBlob.size === 0) {
            reject(new Error('Captured video stream is empty.'));
            return;
          }
          const arrayBuffer = await finalBlob.arrayBuffer();
          resolve({
            arrayBuffer,
            blob: finalBlob,
            mimeType,
            duration: totalDuration,
            fileSize: finalBlob.size,
          });
        } catch (bufErr) {
          reject(bufErr);
        }
      };

      // Start recording and playing
      recorder.start(250);
      video.play().catch(() => {});
      try {
        const moviePlayer = (document.getElementById('movie_player') as any);
        if (moviePlayer && typeof moviePlayer.playVideo === 'function') {
          moviePlayer.playVideo();
        }
      } catch {}

      let hasStartedPlaying = false;
      let startTimeout = Date.now();

      const checkProgress = () => {
        if (this.captureCancelFlag) {
          if (recorder.state !== 'inactive') {
            recorder.stop();
          }
          video.pause();
          return;
        }

        // Verify video has reached the start window
        if (!hasStartedPlaying) {
          if (Math.abs(video.currentTime - startTime) <= 2.0 || video.currentTime >= startTime) {
            hasStartedPlaying = true;
          } else if (Date.now() - startTimeout > 2500) {
            // Force start if player didn't report exact seek position
            hasStartedPlaying = true;
          }
        }

        const currentElapsed = Math.max(0, video.currentTime - startTime);
        onProgress(currentElapsed, totalDuration);

        // Only complete once playback has actually started and reaches endTime
        if (hasStartedPlaying && (video.currentTime >= endTime || video.ended)) {
          video.pause();
          if (recorder.state !== 'inactive') {
            recorder.stop();
          }
        } else {
          requestAnimationFrame(checkProgress);
        }
      };

      requestAnimationFrame(checkProgress);
    });
  }

  public getCurrentTime(): number {
    return this.activeVideo ? this.activeVideo.currentTime : 0;
  }

  public getDuration(): number {
    return this.activeVideo && !isNaN(this.activeVideo.duration) ? this.activeVideo.duration : 0;
  }
}
