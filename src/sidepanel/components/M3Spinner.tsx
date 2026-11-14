import React, { useRef, useEffect } from 'react';
import { mountIndicator, M3IndicatorOptions } from '../utils/m3-loading-indicator';

interface M3SpinnerProps extends M3IndicatorOptions {
  className?: string;
  style?: React.CSSProperties;
}

export const M3Spinner: React.FC<M3SpinnerProps> = ({
  size = 48,
  color = '#BE185D',
  contained = false,
  containerColor = 'rgba(190, 24, 93, 0.16)',
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const instance = mountIndicator(containerRef.current, {
      size,
      color,
      contained,
      containerColor,
    });

    return () => {
      instance.destroy();
    };
  }, [size, color, contained, containerColor]);

  return (
    <div
      ref={containerRef}
      className={`m3-spinner-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        flexShrink: 0,
        ...style,
      }}
    />
  );
};

