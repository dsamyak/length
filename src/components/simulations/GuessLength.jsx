import React, { useState } from 'react';
import { useAudio } from '../../hooks/useAudio';
import { GameObject } from '../ui/GameObjects';

export default function GuessLength({ onComplete }) {
  const { play } = useAudio();
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const rounds = [
    { ref: 200, target: 300, correct: 'longer' },
    { ref: 250, target: 150, correct: 'shorter' },
  ];

  const handleGuess = (guess) => {
    const isCorrect = guess === rounds[round].correct;
    if (isCorrect) {
      play('correct');
      setFeedback('correct');
      setTimeout(() => {
        setFeedback(null);
        if (round < rounds.length - 1) setRound(prev => prev + 1);
        else onComplete();
      }, 1500);
    } else {
      play('wrong');
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const current = rounds[round];

  return (
    <div className="glass-card" style={{ width: '100%', maxWidth: 800, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="station-header">
        <h2>🔍 Is it LONGER or SHORTER?</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', padding: '0 32px', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: 'var(--text-muted)', width: 90 }}>Reference:</span>
          <GameObject type="pencil" color="#0FB5AE" lengthPx={current.ref} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: 'var(--white)', width: 90 }}>Guess:</span>
          <GameObject type="pencil" color="#FFD700" lengthPx={current.target} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <button
          className={`btn btn-coral ${feedback === 'wrong' ? '' : ''}`}
          style={feedback === 'wrong' ? { animation: 'shake 0.4s ease' } : {}}
          onClick={() => handleGuess('longer')}
        >
          LONGER 📏
        </button>
        <button
          className="btn btn-teal"
          style={feedback === 'wrong' ? { animation: 'shake 0.4s ease' } : {}}
          onClick={() => handleGuess('shorter')}
        >
          SHORTER ✂️
        </button>
      </div>

      {feedback === 'correct' && (
        <div className="animate-bounce-in" style={{ position: 'absolute', fontSize: '5rem', pointerEvents: 'none' }}>
          🌟
        </div>
      )}
    </div>
  );
}
