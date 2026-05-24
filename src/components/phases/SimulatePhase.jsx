import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePhase } from '../../hooks/usePhase';
import { useAudio } from '../../hooks/useAudio';
import { GameObject } from '../ui/GameObjects';
import { Reorder } from 'framer-motion';
import { narrate, stopNarration } from '../../utils/audio';
import {
  simulateStation1Intro,
  simulateStation2Intro,
  simulateStation3Intro,
  simulateCorrect,
  simulateAllComplete
} from '../../utils/narration';

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const STATIONS = [
  { id: 0, title: 'Tap to Compare', subtitle: 'Concrete', icon: '📏' },
  { id: 1, title: 'Guess Length', subtitle: 'Pictorial', icon: '🔍' },
  { id: 2, title: 'Sort Them!', subtitle: 'Abstract', icon: '📊' },
];

// ═══════════════════════════════════════════════════
// STATION 1: Tap the Longer/Shorter (Concrete)
// ═══════════════════════════════════════════════════
function Station1({ onNext }) {
  const { play } = useAudio();
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const narrationRef = useRef(null);

  useEffect(() => {
    if (round === 0) {
      narrationRef.current?.cancel();
      narrationRef.current = narrate(simulateStation1Intro());
    }
    return () => narrationRef.current?.cancel();
  }, [round]);

  const rounds = [
    { a: { color: '#FF6B35', px: 280, label: 'Orange Stick' }, b: { color: '#0FB5AE', px: 140, label: 'Teal Stick' }, ask: 'LONGER', answer: 'a' },
    { a: { color: '#6C3FC5', px: 120, label: 'Purple Ribbon' }, b: { color: '#FFD700', px: 260, label: 'Yellow Ribbon' }, ask: 'SHORTER', answer: 'a' },
    { a: { color: '#E040FB', px: 200, label: 'Pink Pencil' }, b: { color: '#0FB5AE', px: 320, label: 'Teal Pencil' }, ask: 'LONGER', answer: 'b' },
  ];

  const r = rounds[round];
  const done = feedback === 'correct';

  const handleTap = (which) => {
    if (done) return;
    const isCorrect = which === r.answer;
    narrationRef.current?.cancel();
    
    if (isCorrect) {
      play('correct');
      setFeedback('correct');
      narrationRef.current = narrate(simulateCorrect(r[r.answer].label, r.ask.toLowerCase()));
      setTimeout(() => {
        if (round < rounds.length - 1) {
          setRound(prev => prev + 1);
          setFeedback(null);
        } else {
          onNext();
        }
      }, 1500);
    } else {
      play('wrong');
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 800);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>📏 Tap the {r.ask} One</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        Round {round + 1} of {rounds.length} — Which object is <strong style={{ color: 'var(--gold)' }}>{r.ask}</strong>?
      </p>

      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
        {['a', 'b'].map(key => {
          const obj = r[key];
          return (
            <div
              key={key}
              className="visual-object-card"
              onClick={() => handleTap(key)}
              style={{
                cursor: done ? 'default' : 'pointer',
                borderColor: done && key === r.answer ? 'var(--green)' : undefined,
                background: done && key === r.answer ? 'rgba(76,175,80,0.15)' : undefined,
              }}
            >
              <GameObject type="stick" color={obj.color} lengthPx={obj.px} />
              <span className="visual-object-label">{obj.label}</span>
            </div>
          );
        })}
      </div>

      {feedback === 'correct' && (
        <p className="animate-bounce-in" style={{ color: 'var(--green)', fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>
          ✅ Correct! {r[r.answer].label} is {r.ask.toLowerCase()}!
        </p>
      )}
      {feedback === 'wrong' && (
        <p style={{ color: 'var(--red)', fontFamily: 'var(--font-display)', animation: 'shake 0.4s ease' }}>
          ❌ Try again!
        </p>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STATION 2: Guess if Longer or Shorter (Pictorial)
// ═══════════════════════════════════════════════════
function Station2({ onNext }) {
  const { play } = useAudio();
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const narrationRef = useRef(null);

  useEffect(() => {
    if (round === 0) {
      narrationRef.current?.cancel();
      narrationRef.current = narrate(simulateStation2Intro());
    }
    return () => narrationRef.current?.cancel();
  }, [round]);

  const rounds = [
    { ref: 200, target: 300, correct: 'longer', refColor: '#0FB5AE', targetColor: '#FFD700' },
    { ref: 250, target: 150, correct: 'shorter', refColor: '#6C3FC5', targetColor: '#FF6B35' },
    { ref: 180, target: 180, correct: 'same', refColor: '#E040FB', targetColor: '#0FB5AE' },
  ];

  const r = rounds[round];

  const handleGuess = (guess) => {
    if (feedback) return;
    const isCorrect = guess === r.correct;
    narrationRef.current?.cancel();

    if (isCorrect) {
      play('correct');
      setFeedback('correct');
      setTimeout(() => {
        if (round < rounds.length - 1) {
          setRound(prev => prev + 1);
          setFeedback(null);
        } else {
          onNext();
        }
      }, 1500);
    } else {
      play('wrong');
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 800);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>🔍 Longer, Shorter, or Same?</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
        Round {round + 1} of {rounds.length}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start', padding: '0 32px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'var(--text-muted)', width: 80 }}>Reference:</span>
          <GameObject type="pencil" color={r.refColor} lengthPx={r.ref} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'var(--white)', width: 80 }}>Compare:</span>
          <GameObject type="pencil" color={r.targetColor} lengthPx={r.target} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn btn-coral btn-sm" onClick={() => handleGuess('longer')}>LONGER 📏</button>
        <button className="btn btn-teal btn-sm" onClick={() => handleGuess('shorter')}>SHORTER ✂️</button>
        <button className="btn btn-outline btn-sm" onClick={() => handleGuess('same')}>SAME LENGTH 🤝</button>
      </div>

      {feedback === 'correct' && (
        <p className="animate-bounce-in" style={{ color: 'var(--green)', fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginTop: 16 }}>
          ✅ Correct! 🌟
        </p>
      )}
      {feedback === 'wrong' && (
        <p style={{ color: 'var(--red)', fontFamily: 'var(--font-display)', animation: 'shake 0.4s ease', marginTop: 16 }}>
          ❌ Look again!
        </p>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STATION 3: Sort from Shortest to Longest (Abstract)
// ═══════════════════════════════════════════════════
function Station3({ onNext }) {
  const { play } = useAudio();
  const [items, setItems] = useState([
    { id: 'C', color: '#6C3FC5', lengthPx: 250 },
    { id: 'A', color: '#FF6B35', lengthPx: 100 },
    { id: 'B', color: '#0FB5AE', lengthPx: 180 },
  ]);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(false);
  const narrationRef = useRef(null);

  useEffect(() => {
    narrationRef.current?.cancel();
    narrationRef.current = narrate(simulateStation3Intro());
    return () => narrationRef.current?.cancel();
  }, []);

  const handleCheck = () => {
    const isSorted = items[0].id === 'A' && items[1].id === 'B' && items[2].id === 'C';
    narrationRef.current?.cancel();

    if (isSorted) {
      play('correct');
      setValidated(true);
      setTimeout(onNext, 2000);
    } else {
      play('wrong');
      setError(true);
      setTimeout(() => setError(false), 800);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>📊 Sort: Shortest → Longest</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        Drag the sticks. Top = Shortest, Bottom = Longest.
      </p>

      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400, margin: '0 auto 24px', listStyle: 'none' }}
      >
        {items.map((item) => (
          <Reorder.Item
            key={item.id}
            value={item}
            className={`drag-item ${validated ? 'validated' : ''}`}
          >
            <GameObject type="stick" color={item.color} lengthPx={item.lengthPx} />
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <button
        className="btn btn-pink"
        onClick={handleCheck}
        disabled={validated}
        style={error ? { animation: 'shake 0.4s ease' } : {}}
      >
        {validated ? '✅ Sorted!' : 'Check Order!'}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN: SimulatePhase
// ═══════════════════════════════════════════════════
export default function SimulatePhase() {
  const { advance } = usePhase();
  const { play } = useAudio();
  const [station, setStation] = useState(0);
  const narrationRef = useRef(null);

  const handleStationDone = useCallback(() => {
    play('celebrate');
    if (station < STATIONS.length - 1) {
      setTimeout(() => setStation(prev => prev + 1), 500);
    } else {
      narrationRef.current?.cancel();
      narrationRef.current = narrate(simulateAllComplete());
      setTimeout(() => {
        stopNarration();
        advance();
      }, 3000);
    }
  }, [station, advance, play]);

  useEffect(() => {
    return () => {
      narrationRef.current?.cancel();
      stopNarration();
    };
  }, []);

  const renderStation = () => {
    switch (station) {
      case 0: return <Station1 onNext={handleStationDone} />;
      case 1: return <Station2 onNext={handleStationDone} />;
      case 2: return <Station3 onNext={handleStationDone} />;
      default: return null;
    }
  };

  return (
    <div className="simulate-screen">
      <div className="phase-badge phase-badge-simulate" style={{ marginBottom: 16 }}>
        03 · Simulate
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--white)', marginBottom: 8, textAlign: 'center' }}>
        The Sandbox
      </h2>

      {/* CPA Station Tabs */}
      <div className="station-tabs">
        {STATIONS.map((s) => {
          const isActive = s.id === station;
          const isCompleted = s.id < station;
          return (
            <div key={s.id} className={`station-tab ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
              <span>{s.icon}</span>
              <span>{s.title}</span>
              <span style={{ fontSize: '0.7rem', color: 'inherit', opacity: 0.7 }}>({s.subtitle})</span>
              {isCompleted && <span>✓</span>}
            </div>
          );
        })}
      </div>

      {/* Station Content */}
      <div className="glass-card" style={{ width: '100%' }}>
        <div key={station} className="animate-fade-in">
          {renderStation()}
        </div>
      </div>
    </div>
  );
}
