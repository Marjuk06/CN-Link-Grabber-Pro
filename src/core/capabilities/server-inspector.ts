import { ServerCapabilities } from '../../types/video';

/**
 * Inspects a remote media URL for HTTP Range support, Content-Length, and CORS accessibility.
 */
export async function inspectServerCapabilities(url: string): Promise<ServerCapabilities> {
  const result: ServerCapabilities = {
    url,
    acceptRanges: false,
    contentLength: null,
    contentType: null,
    etag: null,
    isCorsRestricted: false,
    isRangeCompliant: false,
  };

  // If blob URL or data URL
  if (url.startsWith('blob:') || url.startsWith('data:')) {
    result.contentType = 'video/mp4';
    result.acceptRanges = true;
    result.isRangeCompliant = true;
    return result;
  }

  // Attempt HEAD request first
  try {
    const headResponse = await fetch(url, {
      method: 'HEAD',
      cache: 'no-store',
      headers: {
        'Accept': '*/*',
      },
    });

    if (headResponse.ok) {
      result.contentType = headResponse.headers.get('content-type');
      result.etag = headResponse.headers.get('etag');

      const cl = headResponse.headers.get('content-length');
      if (cl) {
        const parsedCl = parseInt(cl, 10);
        if (!isNaN(parsedCl)) result.contentLength = parsedCl;
      }

      const ar = headResponse.headers.get('accept-ranges');
      if (ar && ar.toLowerCase().includes('bytes')) {
        result.acceptRanges = true;
      }
    } else if (headResponse.status === 405 || headResponse.status === 403) {
      // Some servers block HEAD but accept GET with Range
    }
  } catch (err: any) {
    // Check if CORS error
    if (err && err.name === 'TypeError' && err.message?.includes('Failed to fetch')) {
      result.isCorsRestricted = true;
    }
  }

  // Secondary verification: Attempt tiny 1-byte Range request (bytes=0-0)
  try {
    const rangeResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Range': 'bytes=0-0',
      },
      cache: 'no-store',
    });

    if (rangeResponse.status === 206) {
      // 206 Partial Content -> server supports HTTP Range requests!
      result.acceptRanges = true;
      result.isRangeCompliant = true;

      if (!result.contentType) {
        result.contentType = rangeResponse.headers.get('content-type');
      }
      if (!result.etag) {
        result.etag = rangeResponse.headers.get('etag');
      }

      // Content-Range header is in format: "bytes 0-0/1234567"
      const contentRange = rangeResponse.headers.get('content-range');
      if (contentRange) {
        const match = contentRange.match(/\/(\d+)$/);
        if (match && match[1]) {
          result.contentLength = parseInt(match[1], 10);
        }
      }
    } else if (rangeResponse.ok && rangeResponse.status === 200) {
      // Returned 200 instead of 206 -> Server ignored Range header and served full file
      result.acceptRanges = false;
      result.isRangeCompliant = false;
      const cl = rangeResponse.headers.get('content-length');
      if (cl && !result.contentLength) {
        result.contentLength = parseInt(cl, 10);
      }
    }
  } catch (rangeErr: any) {
    if (rangeErr && rangeErr.name === 'TypeError') {
      result.isCorsRestricted = true;
    }
  }

  return result;
}
