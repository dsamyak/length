import React from 'react';

export default function ProgressBar({ current, total }) {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100)) || 0;

  return (
    <div className="progress-bar-container" style={{ maxWidth: 400, margin: '0 auto 16px' }}>
      <div className="progress-bar-label">
        <span>Progress</span>
        <span>{current} / {total}</span>
      </div>
      <div className="progress-bar-track">
        <div 
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
