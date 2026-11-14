export interface HlsSegment {
  index: number;
  url: string;
  duration: number;
  startTime: number;
  endTime: number;
  byteRange?: { offset: number; length: number };
}

export interface HlsVariant {
  url: string;
  bandwidth: number;
  resolution?: string;
}

export interface HlsPlaylist {
  isMaster: boolean;
  initSegmentUrl?: string;
  variants: HlsVariant[];
  segments: HlsSegment[];
  totalDuration: number;
  isEndList: boolean;
}

/**
 * Resolves relative URLs against a base URL
 */
export function resolveUrl(relativeOrAbsolute: string, baseUrl: string): string {
  try {
    return new URL(relativeOrAbsolute, baseUrl).href;
  } catch {
    return relativeOrAbsolute;
  }
}

/**
 * Parses an M3U8 manifest string into an HlsPlaylist object.
 * Supports Master Playlists, Media Playlists, #EXT-X-MAP (fMP4 init headers),
 * #EXTINF duration mapping, and Byte Ranges.
 */
export function parseM3U8(manifestText: string, baseUrl: string): HlsPlaylist {
  const lines = manifestText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);

  const isMaster = lines.some((l) => l.startsWith('#EXT-X-STREAM-INF'));
  const variants: HlsVariant[] = [];
  const segments: HlsSegment[] = [];
  let initSegmentUrl: string | undefined;
  let isEndList = false;

  if (isMaster) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('#EXT-X-STREAM-INF:')) {
        const bwMatch = line.match(/BANDWIDTH=(\d+)/i);
        const resMatch = line.match(/RESOLUTION=([\dx]+)/i);
        const nextLine = lines[i + 1];

        if (nextLine && !nextLine.startsWith('#')) {
          variants.push({
            url: resolveUrl(nextLine, baseUrl),
            bandwidth: bwMatch ? parseInt(bwMatch[1], 10) : 0,
            resolution: resMatch ? resMatch[1] : undefined,
          });
        }
      }
    }

    // Sort variants by highest bandwidth first
    variants.sort((a, b) => b.bandwidth - a.bandwidth);

    return {
      isMaster: true,
      variants,
      segments: [],
      totalDuration: 0,
      isEndList: false,
    };
  }

  // Media Playlist parsing
  let currentTime = 0;
  let currentSegmentDuration = 0;
  let currentByteRange: { offset: number; length: number } | undefined;
  let lastByteOffset = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('#EXT-X-MAP:')) {
      const uriMatch = line.match(/URI="([^"]+)"/i);
      if (uriMatch && uriMatch[1]) {
        initSegmentUrl = resolveUrl(uriMatch[1], baseUrl);
      }
    } else if (line.startsWith('#EXT-X-BYTERANGE:')) {
      const parts = line.replace('#EXT-X-BYTERANGE:', '').split('@');
      const length = parseInt(parts[0], 10);
      const offset = parts.length > 1 ? parseInt(parts[1], 10) : lastByteOffset;
      currentByteRange = { offset, length };
      lastByteOffset = offset + length;
    } else if (line.startsWith('#EXTINF:')) {
      const durStr = line.substring(8).split(',')[0].trim();
      const parsedDur = parseFloat(durStr);
      currentSegmentDuration = isNaN(parsedDur) ? 0 : parsedDur;
    } else if (line === '#EXT-X-ENDLIST') {
      isEndList = true;
    } else if (!line.startsWith('#')) {
      // Line is a segment URL
      const segUrl = resolveUrl(line, baseUrl);
      const segStartTime = currentTime;
      const segEndTime = currentTime + currentSegmentDuration;

      segments.push({
        index: segments.length,
        url: segUrl,
        duration: currentSegmentDuration,
        startTime: segStartTime,
        endTime: segEndTime,
        byteRange: currentByteRange,
      });

      currentTime = segEndTime;
      currentSegmentDuration = 0;
      currentByteRange = undefined;
    }
  }

  return {
    isMaster: false,
    initSegmentUrl,
    variants: [],
    segments,
    totalDuration: currentTime,
    isEndList,
  };
}

/**
 * Finds all segments overlapping the requested range [startTime, endTime].
 */
export function getSegmentsForRange(
  segments: HlsSegment[],
  startTime: number,
  endTime: number
): { segments: HlsSegment[]; actualStartTime: number; actualEndTime: number } {
  if (segments.length === 0) {
    return { segments: [], actualStartTime: 0, actualEndTime: 0 };
  }

  const selected = segments.filter((seg) => {
    // Overlaps if segment start is before requested end AND segment end is after requested start
    return seg.startTime < endTime && seg.endTime > startTime;
  });

  if (selected.length === 0) {
    return { segments: [], actualStartTime: 0, actualEndTime: 0 };
  }

  const actualStartTime = selected[0].startTime;
  const actualEndTime = selected[selected.length - 1].endTime;

  return {
    segments: selected,
    actualStartTime,
    actualEndTime,
  };
}
