import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { usePhase } from '../../hooks/usePhase';
import { useAudio } from '../../hooks/useAudio';
import { questionPool } from '../../data/questions';
import { shuffle } from '../../utils/randomiser';
import QuestionRenderer from '../questions/QuestionRenderer';
import StarRating from '../ui/StarRating';
import { narrate, stopNarration } from '../../utils/audio';
import {
  playWorldIntro,
  playCorrectNarration,
  playWrongNarration,
  playWorldComplete
} from '../../utils/narration';

const WORLDS = [
  { id: 0, name: 'Pencil Park', icon: '✏️', color: '#ff4081', desc: 'Qs 1–5' },
  { id: 1, name: 'Ribbon Road', icon: '🎀', color: '#4caf50', desc: 'Qs 6–10' },
  { id: 2, name: 'Snake Trail', icon: '🐍', color: '#03a9f4', desc: 'Qs 11–15' },
  { id: 3, name: 'Stick Forest', icon: '🌲', color: '#ff9800', desc: 'Qs 16–20' },
];

const QS_PER_WORLD = 5;

function calcXP(attempt, streak) {
  const base = attempt === 1 ? 10 : 5;
  return base + (streak >= 5 ? 5 : 0);
}

function calcStars(correct, total) {
  const pct = correct / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

export default function PlayPhase() {
  const { advance } = usePhase();
  const { play } = useAudio();

  // World map state
  const [currentWorld, setCurrentWorld] = useState(-1); // -1 = world map
  const [worldResults, setWorldResults] = useState({});

  // In-world state
  const [worldQuestions, setWorldQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [xpPopup, setXpPopup] = useState(null);
  const [worldComplete, setWorldComplete] = useState(false);
  const narrationRef = useRef(null);

  const q = worldQuestions[qIndex];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      narrationRef.current?.cancel();
      stopNarration();
    };
  }, []);

  const startWorld = useCallback((worldId) => {
    // Generate a fresh set of shuffled questions for this world
    const shuffled = shuffle([...questionPool]);
    const start = worldId * QS_PER_WORLD;
    const worldQs = shuffled.slice(start % shuffled.length, (start % shuffled.length) + QS_PER_WORLD);
    // If we don't have enough, wrap around
    while (worldQs.length < QS_PER_WORLD) {
      worldQs.push(shuffled[worldQs.length % shuffled.length]);
    }
    setWorldQuestions(worldQs);
    setCurrentWorld(worldId);
    setQIndex(0); setScore(0); setLives(3); setStreak(0);
    setWorldComplete(false); setFeedback(null); setAnswered(false);

    narrationRef.current?.cancel();
    const wName = WORLDS.find(w => w.id === worldId)?.name;
    narrationRef.current = narrate(playWorldIntro(wName));
  }, []);

  const handleAnswer = useCallback((isCorrect) => {
    if (answered) return;
    setAnswered(true);
    narrationRef.current?.cancel();

    if (isCorrect) {
      play('correct');
      narrationRef.current = narrate(playCorrectNarration());
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setScore(s => s + 1);
      const xp = calcXP(1, newStreak);
      setTotalXP(x => x + xp);
      setXpPopup(`+${xp} XP`);
      setTimeout(() => setXpPopup(null), 1500);
      setFeedback('correct');
    } else {
      play('wrong');
      narrationRef.current = narrate(playWrongNarration());
      setStreak(0);
      setLives(l => l - 1);
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      setAnswered(false);

      if (qIndex + 1 >= worldQuestions.length) {
        // World complete
        const finalScore = isCorrect ? score + 1 : score;
        const stars = calcStars(finalScore, worldQuestions.length);
        setWorldResults(prev => ({
          ...prev,
          [currentWorld]: { score: finalScore, total: worldQuestions.length, stars }
        }));
        play('celebrate');
        setWorldComplete(true);
        const wName = WORLDS.find(w => w.id === currentWorld)?.name;
        narrationRef.current?.cancel();
        narrationRef.current = narrate(playWorldComplete(wName, stars));
      } else {
        setQIndex(i => i + 1);
      }
    }, 1800);
  }, [answered, qIndex, worldQuestions, score, streak, maxStreak, currentWorld, play]);

  // ─── RENDER: World Map ───────────────────────
  if (currentWorld === -1) {
    const allCompleted = Object.keys(worldResults).length >= WORLDS.length;
    return (
      <div className="play-screen">
        <div className="phase-badge phase-badge-play" style={{ marginBottom: 16 }}>
          04 · Play
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--white)', marginBottom: 8 }}>
          Choose Your World!
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
          {allCompleted ? 'All worlds completed! 🎉' : 'Start from any world you like.'}
        </p>

        {/* HUD summary */}
        <div className="hud" style={{ marginBottom: 24 }}>
          <div className="hud-item">⭐ {Object.values(worldResults).reduce((a, r) => a + (r.stars || 0), 0)} stars</div>
          <div className="hud-item">✨ {totalXP} XP</div>
          <div className="hud-item">🔥 {maxStreak} best streak</div>
        </div>

        <div className="world-map">
          {WORLDS.map(w => {
            const result = worldResults[w.id];
            const completed = !!result;
            return (
              <div
                key={w.id}
                className={`world-card ${completed ? 'completed' : ''}`}
                onClick={() => startWorld(w.id)}
              >
                <span className="world-icon">{w.icon}</span>
                <span className="world-name">{w.name}</span>
                <span className="world-desc">{w.desc}</span>
                {completed && (
                  <span className="world-stars">
                    {'⭐'.repeat(result.stars)}{'☆'.repeat(3 - result.stars)}
                    {' '}{result.score}/{result.total}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {allCompleted && (
          <button className="btn btn-green btn-lg" style={{ marginTop: 32 }} onClick={advance}>
            Continue to Reflect →
          </button>
        )}
      </div>
    );
  }

  // ─── RENDER: World Complete ──────────────────
  if (worldComplete) {
    const result = worldResults[currentWorld];
    return (
      <div className="play-screen">
        <div className="world-complete glass-card" style={{ maxWidth: 500 }}>
          <span style={{ fontSize: '4rem' }}>{WORLDS[currentWorld].icon}</span>
          <h2>{WORLDS[currentWorld].name} Complete!</h2>
          <StarRating score={result.score} total={result.total} large />
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--white)', margin: '12px 0' }}>
            {result.score} / {result.total} correct
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
            <button className="btn btn-outline" onClick={() => setCurrentWorld(-1)}>
              🗺️ World Map
            </button>
            <button className="btn btn-primary" onClick={() => startWorld(currentWorld)}>
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── RENDER: In-World Question ───────────────
  if (!q) return null;

  return (
    <div className="play-screen">
      <div className="phase-badge phase-badge-play" style={{ marginBottom: 12 }}>
        {WORLDS[currentWorld].icon} {WORLDS[currentWorld].name}
      </div>

      {/* HUD */}
      <div className="hud">
        <div className="hud-item">❤️ {lives}</div>
        <div className="hud-item">✨ {totalXP} XP</div>
        <div className="hud-item">🔥 {streak}</div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-container" style={{ maxWidth: 400, margin: '0 auto 16px' }}>
        <div className="progress-bar-label">
          <span>Question {qIndex + 1} / {worldQuestions.length}</span>
          <span>{score} correct</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${((qIndex + 1) / worldQuestions.length) * 100}%` }} />
        </div>
      </div>

      <div key={q.id} className="animate-fade-in" style={{ width: '100%' }}>
        <QuestionRenderer question={q} onAnswer={handleAnswer} externalMode />
      </div>

      {/* XP Popup */}
      {xpPopup && <div className="xp-popup">{xpPopup}</div>}

      {/* Feedback overlay */}
      {feedback && (
        <div className="feedback-overlay">
          <div className={`feedback-card ${feedback === 'correct' ? 'feedback-correct' : 'feedback-wrong'}`}>
            {feedback === 'correct' ? '🎉 Correct!' : '❌ Not quite!'}
          </div>
        </div>
      )}
    </div>
  );
}
