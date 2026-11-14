/**
 * Storage manager leveraging Origin Private File System (OPFS)
 * Provides low-memory chunked streaming and automatic cleanup of temp media.
 */

export class OPFSStorageManager {
  private static PREFIX = 'clipforge_temp_';

  /**
   * Checks if OPFS is supported in current environment
   */
  public static isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'storage' in navigator && 'getDirectory' in navigator.storage;
  }

  /**
   * Writes a ReadableStream or chunks into an OPFS temporary file
   */
  public static async writeTempFile(
    fileId: string,
    streamOrChunks: ReadableStream<Uint8Array> | Uint8Array[],
    onProgress?: (bytesWritten: number) => void
  ): Promise<File | Blob> {
    if (!this.isSupported()) {
      // Fallback to in-memory Blob
      if (Array.isArray(streamOrChunks)) {
        return new Blob(streamOrChunks as any, { type: 'video/mp4' });
      } else {
        const reader = streamOrChunks.getReader();
        const chunks: Uint8Array[] = [];
        let written = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            written += value.byteLength;
            if (onProgress) onProgress(written);
          }
        }
        return new Blob(chunks as any, { type: 'video/mp4' });
      }
    }

    try {
      const root = await navigator.storage.getDirectory();
      const fileName = `${this.PREFIX}${fileId}.mp4`;
      const fileHandle = await root.getFileHandle(fileName, { create: true });
      const writable = await fileHandle.createWritable();

      let totalBytes = 0;

      if (Array.isArray(streamOrChunks)) {
        for (const chunk of streamOrChunks) {
          await writable.write(chunk as any);
          totalBytes += chunk.byteLength;
          if (onProgress) onProgress(totalBytes);
        }
      } else {
        const reader = streamOrChunks.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            await writable.write(value as any);
            totalBytes += value.byteLength;
            if (onProgress) onProgress(totalBytes);
          }
        }
      }

      await writable.close();
      const file = await fileHandle.getFile();
      return file;
    } catch (err) {
      console.warn('OPFS write failed, falling back to memory blob:', err);
      if (Array.isArray(streamOrChunks)) {
        return new Blob(streamOrChunks as any, { type: 'video/mp4' });
      }
      throw err;
    }
  }

  /**
   * Cleans up a temporary file by file ID
   */
  public static async removeTempFile(fileId: string): Promise<void> {
    if (!this.isSupported()) return;
    try {
      const root = await navigator.storage.getDirectory();
      const fileName = `${this.PREFIX}${fileId}.mp4`;
      await root.removeEntry(fileName);
    } catch {
      // File might already be gone
    }
  }

  /**
   * Cleans up all orphaned temporary ClipForge files in OPFS
   */
  public static async cleanupAllTempFiles(): Promise<void> {
    if (!this.isSupported()) return;
    try {
      const root = await navigator.storage.getDirectory();
      // @ts-ignore
      for await (const [name] of root.entries()) {
        if (name.startsWith(this.PREFIX)) {
          try {
            await root.removeEntry(name);
          } catch {}
        }
      }
    } catch {}
  }
}
