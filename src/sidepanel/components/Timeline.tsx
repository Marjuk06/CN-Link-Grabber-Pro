import React, { useRef, useCallback } from 'react';
import { formatTimecode } from '../../core/utils/timecode';

interface TimelineProps {
  duration: number;
  startTime: number;
  endTime: number;
  currentTime: number;
  onStartTimeChange: (time: number) => void;
  onEndTimeChange: (time: number) => void;
  onSeek: (time: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  duration,
  startTime,
  endTime,
  currentTime,
  onStartTimeChange,
  onEndTimeChange,
  onSeek,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const safeDuration = duration > 0 ? duration : 100;
  const startPercent = Math.min(100, Math.max(0, (startTime / safeDuration) * 100));
  const endPercent = Math.min(100, Math.max(0, (endTime / safeDuration) * 100));
  const currentPercent = Math.min(100, Math.max(0, (currentTime / safeDuration) * 100));

  const getTimeFromPointer = useCallback(
    (clientX: number): number => {
      if (!containerRef.current) return 0;
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, clickX / rect.width));
      return ratio * safeDuration;
    },
    [safeDuration]
  );

  // Handle dragging start handle
  const handleStartDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newTime = getTimeFromPointer(moveEvent.clientX);
      if (newTime < endTime - 0.1) {
        onStartTimeChange(Math.max(0, newTime));
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Handle dragging end handle
  const handleEndDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newTime = getTimeFromPointer(moveEvent.clientX);
      if (newTime > startTime + 0.1) {
        onEndTimeChange(Math.min(safeDuration, newTime));
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Handle click on timeline track to seek
  const handleTrackClick = (e: React.MouseEvent) => {
    const clickTime = getTimeFromPointer(e.clientX);
    onSeek(clickTime);
  };

  return (
    <div className="timeline-container" ref={containerRef} onClick={handleTrackClick}>
      {/* Background track */}
      <div className="timeline-track-bg">
        {/* Selected Range Fill */}
        <div
          className="timeline-range-fill"
          style={{
            left: `${startPercent}%`,
            width: `${Math.max(0, endPercent - startPercent)}%`,
          }}
        />
      </div>

      {/* Current Playhead */}
      <div
        className="timeline-playhead"
        style={{ left: `${currentPercent}%` }}
        title={`Playback: ${formatTimecode(currentTime)}`}
      />

      {/* Start Handle */}
      <div
        className="timeline-handle"
        style={{ left: `${startPercent}%` }}
        onMouseDown={handleStartDrag}
        title={`Start: ${formatTimecode(startTime)}`}
        id="handle-start-time"
      />

      {/* End Handle */}
      <div
        className="timeline-handle"
        style={{ left: `${endPercent}%` }}
        onMouseDown={handleEndDrag}
        title={`End: ${formatTimecode(endTime)}`}
        id="handle-end-time"
      />
    </div>
  );
};
