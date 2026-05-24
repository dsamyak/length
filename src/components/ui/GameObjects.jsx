import React from 'react';

// Generates a simple beautiful scalable object for the game
export const GameObject = ({ type, color, lengthPx, label }) => {
  const width = lengthPx || 100;
  const height = 40;

  switch(type) {
    case 'pencil':
      return (
        <svg width={width + 30} height={height} viewBox={`0 0 ${width + 30} ${height}`} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
          {/* Pencil Body */}
          <rect x="0" y="10" width={width} height="20" fill={color} rx="2" />
          <rect x="0" y="14" width={width} height="4" fill="rgba(0,0,0,0.1)" />
          {/* Pencil Tip */}
          <polygon points={`${width},10 ${width+25},20 ${width},30`} fill="#F5DEB3" />
          <polygon points={`${width+18},17 ${width+25},20 ${width+18},23`} fill="#333" />
          {/* Eraser */}
          <rect x="-10" y="10" width="10" height="20" fill="#FFB6C1" rx="3" />
        </svg>
      );
    case 'stick':
      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
          <rect x="0" y="15" width={width} height="10" fill={color} rx="5" />
          <path d={`M10,15 Q${width/2},18 ${width-10},15`} stroke="rgba(0,0,0,0.2)" fill="transparent" strokeWidth="2" />
        </svg>
      );
    case 'snake':
      return (
        <svg width={width + 20} height={height} viewBox={`0 0 ${width + 20} ${height}`} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
          {/* Body */}
          <rect x="15" y="10" width={width} height="20" fill={color} rx="10" />
          {/* Head */}
          <circle cx="15" cy="20" r="14" fill={color} />
          {/* Eyes */}
          <circle cx="10" cy="16" r="3" fill="#FFF" />
          <circle cx="10" cy="16" r="1.5" fill="#000" />
          <circle cx="20" cy="16" r="3" fill="#FFF" />
          <circle cx="20" cy="16" r="1.5" fill="#000" />
          {/* Tongue */}
          <path d="M5,20 L-5,20 M-5,20 L-10,15 M-5,20 L-10,25" stroke="#FF6B35" strokeWidth="2" fill="none" />
        </svg>
      );
    case 'ribbon':
      return (
        <svg width={width + 40} height={height} viewBox={`0 0 ${width + 40} ${height}`} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
          <path d={`M20,15 Q${width/2 + 20},0 ${width + 20},15 Q${width/2 + 20},30 20,15`} fill={color} opacity="0.8" />
          <path d={`M20,25 Q${width/2 + 20},10 ${width + 20},25 Q${width/2 + 20},40 20,25`} fill={color} opacity="0.6" />
        </svg>
      );
    default:
      return (
        <div 
          style={{ width: `${width}px`, height: `${height}px`, backgroundColor: color, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.3)', border: '2px solid white' }} 
        />
      );
  }
};
