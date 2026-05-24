import React, { useEffect, useState } from 'react';

export default function FeedbackOverlay({ isVisible, isCorrect }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
    } else {
      const t = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(t);
    }
  }, [isVisible]);

  if (!show && !isVisible) return null;

  return (
    <div className="feedback-overlay" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s' }}>
      <div className={`feedback-card ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
        {isCorrect ? '🎉 Awesome!' : "Let's try again!"}
      </div>
    </div>
  );
}
