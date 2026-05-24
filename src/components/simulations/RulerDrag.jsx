import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '../../hooks/useAudio';

export default function RulerDrag({ onComplete }) {
  const { play } = useAudio();
  const [compared, setCompared] = useState(false);

  const handleCompare = () => {
    play('correct');
    setCompared(true);
    setTimeout(onComplete, 3000);
  };

  return (
    <div className="glass-card" style={{ width: '100%', maxWidth: 800, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="station-header">
        <h2>📏 Drag & Compare</h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16, textAlign: 'center' }}>
        Drag the orange block next to the blue one to compare!
      </p>

      <div style={{ position: 'relative', width: '100%', height: 320, marginBottom: 24 }}>
        {/* Baseline marker */}
        <div className="sim-baseline" style={{ left: 100 }} />

        {/* Block A */}
        <motion.div
          drag
          dragMomentum={false}
          className="sim-block"
          style={{
            position: 'absolute', width: 200, height: 60,
            background: 'var(--teal)',
            left: compared ? 100 : 300, top: 50,
          }}
          animate={compared ? { x: 0 } : {}}
          transition={{ type: 'spring' }}
        >
          A
        </motion.div>

        {/* Block B */}
        <motion.div
          drag
          dragMomentum={false}
          className="sim-block"
          style={{
            position: 'absolute', width: 350, height: 60,
            background: 'var(--orange)',
            borderColor: compared ? 'var(--gold)' : 'white',
            boxShadow: compared ? '0 0 30px var(--gold)' : '0 4px 15px rgba(0,0,0,0.3)',
            left: compared ? 100 : 150, top: 150,
          }}
          animate={compared ? { x: 0 } : {}}
          transition={{ type: 'spring' }}
        >
          B
        </motion.div>

        {compared && (
          <span className="sim-label animate-fade-in" style={{ position: 'absolute', left: 470, top: 165 }}>
            ← LONGER!
          </span>
        )}
      </div>

      <button
        className="btn btn-pink"
        onClick={handleCompare}
        disabled={compared}
      >
        Auto Compare
      </button>
    </div>
  );
}
