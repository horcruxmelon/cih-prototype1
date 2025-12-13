import React from 'react';
import { HeatmapPoint } from '../types';

interface HeatmapOverlayProps {
  points: HeatmapPoint[];
  isVisible: boolean;
}

export const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({ points, isVisible }) => {
  if (!isVisible || points.length === 0) return null;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
      {points.map((point, index) => (
        <div
          key={index}
          className="absolute rounded-full blur-2xl"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            width: '120px',
            height: '120px',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, rgba(255,0,0,${point.intensity}) 0%, rgba(255,165,0,${point.intensity * 0.5}) 50%, rgba(0,0,0,0) 70%)`,
            mixBlendMode: 'screen',
          }}
        />
      ))}
    </div>
  );
};