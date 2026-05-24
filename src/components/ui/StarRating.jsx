import React from 'react';

export default function StarRating({ score, total, large = false }) {
  const percentage = total > 0 ? (score / total) : 0;
  
  let starsToAward = 1;
  if (percentage >= 0.9) starsToAward = 3;
  else if (percentage >= 0.7) starsToAward = 2;

  const size = large ? '3rem' : '1.5rem';

  return (
    <div className="star-display">
      {[1, 2, 3].map((starIdx) => (
        <span
          key={starIdx}
          className={`star ${starIdx <= starsToAward ? 'earned' : 'empty'}`}
          style={{ fontSize: size }}
        >
          ⭐
        </span>
      ))}
    </div>
  );
}
