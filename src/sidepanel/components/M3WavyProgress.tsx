import React, { useRef, useEffect } from 'react';

const WAVELENGTH = 40.0;
const AMPLITUDE = 3.0;
const STROKE_WIDTH = 4.0;
const Y_CENTER = 8.0;
const TOTAL_HEIGHT = 16.0;
const GAP = 4.0;
const STOP_DOT_SIZE = 4.0;
const SPEED = 0.85; // Traveling wave translation speed (px per frame at 60fps)

interface M3WavyProgressProps {
  percent: number;
  indeterminate?: boolean;
  color?: string;
  trackColor?: string;
  stopDotColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const M3WavyProgress: React.FC<M3WavyProgressProps> = ({
  percent,
  indeterminate = false,
  color = '#BE185D',
  trackColor = 'rgba(255, 255, 255, 0.14)',
  stopDotColor = '#FAF2F5',
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    targetProgress: percent,
    currentProgress: percent,
    indeterminate,
    color,
    trackColor,
    stopDotColor,
  });

  stateRef.current.targetProgress = Math.max(0, Math.min(100, percent));
  stateRef.current.indeterminate = indeterminate;
  stateRef.current.color = color;
  stateRef.current.trackColor = trackColor;
  stateRef.current.stopDotColor = stopDotColor;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let waveOffset = 0;
    let animId: number | null = null;
    let isRunning = true;
    let lastWidth = 0;

    function updateSize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas?.getBoundingClientRect();
      const w = Math.max(10, Math.floor(rect?.width || containerRef.current?.clientWidth || 280));
      const h = TOTAL_HEIGHT;

      if (w !== lastWidth || canvas?.width !== Math.floor(w * dpr)) {
        lastWidth = w;
        if (canvas) {
          canvas.width = Math.floor(w * dpr);
          canvas.height = Math.floor(h * dpr);
        }
        ctx?.setTransform(1, 0, 0, 1, 0, 0);
        ctx?.scale(dpr, dpr);
      }
      return w;
    }

    function draw() {
      if (!isRunning || !ctx) return;

      const w = updateSize();
      ctx.clearRect(0, 0, w, TOTAL_HEIGHT);

      const state = stateRef.current;
      if (!state.indeterminate) {
        state.currentProgress += (state.targetProgress - state.currentProgress) * 0.18;
      }

      const clampedPct = Math.max(0, Math.min(100, state.indeterminate ? 50 : state.currentProgress));
      const activeW = (clampedPct / 100) * w;
      const omega = (2.0 * Math.PI) / WAVELENGTH;

      // 1. Inactive Track Line (4dp straight line with rounded end caps)
      if (clampedPct < 98.0) {
        const trackStart = activeW > 2.0 ? Math.min(w - 10, activeW + 8) : 2.0;
        const trackEnd = w - 10;
        if (trackEnd > trackStart + 1.0) {
          ctx.beginPath();
          ctx.moveTo(trackStart, Y_CENTER);
          ctx.lineTo(trackEnd, Y_CENTER);
          ctx.strokeStyle = state.trackColor;
          ctx.lineWidth = STROKE_WIDTH;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        }
      }

      // 2. Terminal Stop Dot (4dp diameter with 4dp gap from track end)
      const stopDotX = w - (STOP_DOT_SIZE / 2);
      ctx.beginPath();
      ctx.arc(stopDotX, Y_CENTER, STOP_DOT_SIZE / 2, 0, Math.PI * 2);
      ctx.fillStyle = state.currentProgress >= 99.0 ? state.color : state.stopDotColor;
      ctx.fill();

      // 3. Active Continuous Traveling Sine Wave (40dp wavelength, 3dp amplitude, 4dp stroke)
      if (activeW > 2.0) {
        ctx.beginPath();
        const step = 0.5;
        const waveStart = 2.0;
        const waveEnd = Math.min(w - (state.currentProgress >= 99.0 ? 2 : 10), activeW);

        for (let x = waveStart; x <= waveEnd; x += step) {
          const y = Y_CENTER + AMPLITUDE * Math.sin((x - waveOffset) * omega);
          if (x === waveStart) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        const endY = Y_CENTER + AMPLITUDE * Math.sin((waveEnd - waveOffset) * omega);
        ctx.lineTo(waveEnd, endY);

        ctx.strokeStyle = state.color;
        ctx.lineWidth = STROKE_WIDTH;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      // Continuous live wave propagation
      waveOffset = (waveOffset + SPEED) % WAVELENGTH;
      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      isRunning = false;
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`m3-linear-wavy-root ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: `${TOTAL_HEIGHT}px`,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: `${TOTAL_HEIGHT}px`,
          display: 'block',
        }}
      />
    </div>
  );
};
