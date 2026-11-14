import React, { useState, useEffect } from 'react';
import {
  formatTimecode,
  parseTimecode,
  formatDurationFriendly,
  nudgeTimestamp,
  validateRange,
} from '../../core/utils/timecode';
import { Clock, AlertCircle } from 'lucide-react';

interface TimestampInputsProps {
  duration: number;
  startTime: number;
  endTime: number;
  currentTime: number;
  onStartTimeChange: (time: number) => void;
  onEndTimeChange: (time: number) => void;
  onQueryCurrentTime?: () => Promise<number | null>;
}

export const TimestampInputs: React.FC<TimestampInputsProps> = ({
  duration,
  startTime,
  endTime,
  currentTime,
  onStartTimeChange,
  onEndTimeChange,
  onQueryCurrentTime,
}) => {
  const [startText, setStartText] = useState(formatTimecode(startTime));
  const [endText, setEndText] = useState(formatTimecode(endTime));

  // Sync internal text when external props update
  useEffect(() => {
    setStartText(formatTimecode(startTime));
  }, [startTime]);

  useEffect(() => {
    setEndText(formatTimecode(endTime));
  }, [endTime]);

  const handleStartBlur = () => {
    const parsed = parseTimecode(startText);
    if (parsed !== null && parsed >= 0 && parsed < (duration || Infinity)) {
      onStartTimeChange(parsed);
      setStartText(formatTimecode(parsed));
    } else {
      setStartText(formatTimecode(startTime));
    }
  };

  const handleEndBlur = () => {
    const parsed = parseTimecode(endText);
    if (parsed !== null && parsed > 0 && parsed <= (duration || Infinity)) {
      onEndTimeChange(parsed);
      setEndText(formatTimecode(parsed));
    } else {
      setEndText(formatTimecode(endTime));
    }
  };

  const handleNudgeStart = (delta: number) => {
    const next = nudgeTimestamp(startTime, delta, 0, endTime - 0.1);
    onStartTimeChange(next);
  };

  const handleNudgeEnd = (delta: number) => {
    const next = nudgeTimestamp(endTime, delta, startTime + 0.1, duration || Infinity);
    onEndTimeChange(next);
  };

  const setStartToCurrent = async () => {
    let t = currentTime;
    if (onQueryCurrentTime) {
      const freshTime = await onQueryCurrentTime();
      if (typeof freshTime === 'number') t = freshTime;
    }
    onStartTimeChange(t);
    if (t >= endTime) {
      const step = 30;
      const newEnd = duration > 0 ? Math.min(duration, t + step) : t + step;
      onEndTimeChange(newEnd);
    }
  };

  const setEndToCurrent = async () => {
    let t = currentTime;
    if (onQueryCurrentTime) {
      const freshTime = await onQueryCurrentTime();
      if (typeof freshTime === 'number') t = freshTime;
    }
    onEndTimeChange(t);
    if (t <= startTime) {
      const step = 30;
      const newStart = Math.max(0, t - step);
      onStartTimeChange(newStart);
    }
  };

  const rangeValidation = validateRange(startTime, endTime, duration);
  const clipDuration = Math.max(0, endTime - startTime);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div className="timestamp-grid">
        {/* Start Timestamp */}
        <div className="timestamp-field">
          <div className="field-label">
            <span>Start Point</span>
            <button
              className="set-current-btn"
              onClick={setStartToCurrent}
              title="Set to current video playback position"
              id="btn-set-start-current"
            >
              Set Here
            </button>
          </div>
          <input
            type="text"
            className="time-input"
            value={startText}
            onChange={(e) => setStartText(e.target.value)}
            onBlur={handleStartBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleStartBlur()}
            placeholder="00:00:00"
            id="input-start-time"
          />
          <div className="nudge-row">
            <button className="nudge-btn" onClick={() => handleNudgeStart(-60)}>-1m</button>
            <button className="nudge-btn" onClick={() => handleNudgeStart(-5)}>-5s</button>
            <button className="nudge-btn" onClick={() => handleNudgeStart(5)}>+5s</button>
            <button className="nudge-btn" onClick={() => handleNudgeStart(60)}>+1m</button>
          </div>
        </div>

        {/* End Timestamp */}
        <div className="timestamp-field">
          <div className="field-label">
            <span>End Point</span>
            <button
              className="set-current-btn"
              onClick={setEndToCurrent}
              title="Set to current video playback position"
              id="btn-set-end-current"
            >
              Set Here
            </button>
          </div>
          <input
            type="text"
            className="time-input"
            value={endText}
            onChange={(e) => setEndText(e.target.value)}
            onBlur={handleEndBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleEndBlur()}
            placeholder="00:00:00"
            id="input-end-time"
          />
          <div className="nudge-row">
            <button className="nudge-btn" onClick={() => handleNudgeEnd(-60)}>-1m</button>
            <button className="nudge-btn" onClick={() => handleNudgeEnd(-5)}>-5s</button>
            <button className="nudge-btn" onClick={() => handleNudgeEnd(5)}>+5s</button>
            <button className="nudge-btn" onClick={() => handleNudgeEnd(60)}>+1m</button>
          </div>
        </div>
      </div>

      {/* Duration Card */}
      <div className="duration-banner">
        <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Clock size={13} color="#67e8f9" /> Selection Duration:
        </span>
        <span className="duration-value timecode-tabular">
          {formatDurationFriendly(clipDuration)}
        </span>
      </div>

      {!rangeValidation.valid && (
        <div className="alert-box" style={{ padding: '6px 10px', fontSize: '11px' }}>
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          <span>{rangeValidation.error}</span>
        </div>
      )}
    </div>
  );
};
