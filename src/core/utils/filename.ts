import { formatTimecode } from './timecode';

/**
 * Sanitizes a string to make it safe for filesystem filenames across OSes.
 */
export function sanitizeFilename(name: string): string {
  if (!name || typeof name !== 'string') return 'clip';
  const trimmed = name.trim();
  if (!trimmed) return 'clip';

  // Strip illegal chars for Windows / Linux / macOS
  let sanitized = trimmed
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  if (sanitized.length > 80) {
    sanitized = sanitized.substring(0, 80).replace(/_+$/, '');
  }
  return sanitized || 'clip';
}

/**
 * Generates formatted clip filename e.g. "Biology_Lecture_clip_01-24-32_to_01-39-32.mp4"
 */
export function generateClipFilename(
  baseTitle: string,
  startTime: number,
  endTime: number,
  extension = 'mp4'
): string {
  const safeTitle = sanitizeFilename(baseTitle);
  const startStr = formatTimecode(startTime).replace(/:/g, '-');
  const endStr = formatTimecode(endTime).replace(/:/g, '-');

  const cleanExt = extension.replace(/^\./, '');
  return `${safeTitle}_clip_${startStr}_to_${endStr}.${cleanExt}`;
}
