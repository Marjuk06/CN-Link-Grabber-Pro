/**
 * Utilities for formatting, parsing, and validating video timecodes
 */

export function padZero(num: number, size = 2): string {
  let s = Math.floor(Math.abs(num)).toString();
  while (s.length < size) s = '0' + s;
  return s;
}

/**
 * Formats seconds into HH:MM:SS or HH:MM:SS.mmm
 */
export function formatTimecode(seconds: number, includeMs = false): string {
  if (isNaN(seconds) || seconds < 0) {
    seconds = 0;
  }

  const totalSecs = Math.floor(seconds);
  const hrs = Math.floor(totalSecs / 3600);
  const remainder = totalSecs % 3600;
  const mins = Math.floor(remainder / 60);
  const secs = remainder % 60;
  // Round to avoid IEEE 754 floating point subtraction inaccuracies
  const ms = Math.round((seconds - totalSecs) * 1000);

  const base = `${padZero(hrs)}:${padZero(mins)}:${padZero(secs)}`;
  if (includeMs) {
    return `${base}.${padZero(ms, 3)}`;
  }
  return base;
}

/**
 * Formats duration in friendly text, e.g. "15m 00s" or "01:12:30"
 */
export function formatDurationFriendly(seconds: number): string {
  if (isNaN(seconds) || seconds <= 0) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${padZero(hrs)}:${padZero(mins)}:${padZero(secs)}`;
  }
  return `${padZero(mins)}:${padZero(secs)}`;
}

/**
 * Parses a time string into seconds.
 * Supports:
 * - HH:MM:SS or HH:MM:SS.mmm
 * - MM:SS or MM:SS.mmm
 * - Pure seconds ("125", "125.5", "125s")
 */
export function parseTimecode(input: string): number | null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;

  // Check pure seconds with optional 's' unit
  if (/^\d+(\.\d+)?s?$/.test(trimmed)) {
    const val = parseFloat(trimmed.replace('s', ''));
    return isNaN(val) ? null : Math.max(0, val);
  }

  // Check colon-separated format
  const parts = trimmed.split(':');
  if (parts.length === 2) {
    // MM:SS[.mmm]
    const mins = parseFloat(parts[0]);
    const secs = parseFloat(parts[1]);
    if (isNaN(mins) || isNaN(secs) || mins < 0 || secs < 0 || secs >= 60) return null;
    return mins * 60 + secs;
  } else if (parts.length === 3) {
    // HH:MM:SS[.mmm]
    const hrs = parseFloat(parts[0]);
    const mins = parseFloat(parts[1]);
    const secs = parseFloat(parts[2]);
    if (isNaN(hrs) || isNaN(mins) || isNaN(secs) || hrs < 0 || mins < 0 || mins >= 60 || secs < 0 || secs >= 60) {
      return null;
    }
    return hrs * 3600 + mins * 60 + secs;
  }

  return null;
}

export interface RangeValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates start and end timestamps against video duration
 */
export function validateRange(start: number, end: number, totalDuration: number): RangeValidationResult {
  if (isNaN(start) || start < 0) {
    return { valid: false, error: 'Start timestamp cannot be negative.' };
  }
  if (isNaN(end) || end <= 0) {
    return { valid: false, error: 'End timestamp must be greater than zero.' };
  }
  if (start >= end) {
    return { valid: false, error: 'Start timestamp must be strictly earlier than End timestamp.' };
  }
  if (totalDuration > 0 && end > totalDuration + 0.5) {
    return { valid: false, error: `End timestamp cannot exceed video duration (${formatTimecode(totalDuration)}).` };
  }
  if (end - start < 0.1) {
    return { valid: false, error: 'Selection duration must be at least 0.1 seconds.' };
  }

  return { valid: true };
}

/**
 * Clamps and nudges a timestamp by a delta (e.g. +5s, -1m)
 */
export function nudgeTimestamp(current: number, delta: number, min = 0, max = Infinity): number {
  const next = current + delta;
  return Math.min(Math.max(next, min), max);
}
