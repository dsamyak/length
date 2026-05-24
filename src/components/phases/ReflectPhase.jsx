import { useState, useEffect, useCallback, useRef } from 'react';
import { usePhase } from '../../hooks/usePhase';
import { useAudio } from '../../hooks/useAudio';
import { narrate, stopNarration } from '../../utils/audio';
import {
  reflectIntroNarration,
  reflectCorrectNarration,
  reflectWrongNarration,
  reflectConfidenceNarration,
  reflectCertificateNarration
} from '../../utils/narration';

const REFLECT_QUESTIONS = [
  {
    q: "John has a red pencil and a blue pencil. The red one stretches further on the table. What does that mean?",
    options: [
      { text: "The red pencil is LONGER", correct: true, emoji: "📏" },
      { text: "The blue pencil is LONGER", correct: false, emoji: "❌" },
      { text: "They are the same length", correct: false, emoji: "❓" },
    ],
  },
  {
    q: "How do Emily and Michel compare two sticks?",
    options: [
      { text: "Stack them on top of each other", correct: false, emoji: "❌" },
      { text: "Line up one end and check the other end", correct: true, emoji: "✅" },
      { text: "Guess without looking", correct: false, emoji: "❓" },
    ],
  },
  {
    q: "If an object stops sooner than another, we say it is…",
    options: [
      { text: "SHORTER", correct: true, emoji: "✂️" },
      { text: "LONGER", correct: false, emoji: "❌" },
      { text: "HEAVIER", correct: false, emoji: "❓" },
    ],
  },
];

const CONFIDENCE_LEVELS = [
  { emoji: '😊', label: "I can compare any lengths!", color: '#4caf50' },
  { emoji: '🙂', label: 'I can compare most objects!', color: '#ff9800' },
  { emoji: '😐', label: "I'm still learning", color: '#42a5f5' },
];

export default function ReflectPhase() {
  const { advanceTo, PHASES } = usePhase();
  const { play } = useAudio();

  // Steps: 0 = teach-back quiz, 1 = confidence, 2 = certificate
  const [step, setStep] = useState(0);
  const [teachIdx, setTeachIdx] = useState(0);
  const [teachAnswered, setTeachAnswered] = useState(false);
  const [teachCorrect, setTeachCorrect] = useState(0);
  const [confidence, setConfidence] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);
  const narrationRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      narrationRef.current?.cancel();
      stopNarration();
    };
  }, []);

  // Step narrations
  useEffect(() => {
    narrationRef.current?.cancel();
    if (step === 0 && teachIdx === 0) {
      narrationRef.current = narrate(reflectIntroNarration());
    } else if (step === 1) {
      narrationRef.current = narrate(reflectConfidenceNarration());
    } else if (step === 2) {
      narrationRef.current = narrate(reflectCertificateNarration());
    }
  }, [step, teachIdx]);

  useEffect(() => {
    if (showConfetti) {
      const pieces = Array.from({ length: 40 }, (_, i) => ({
        id: i, x: Math.random() * 100, delay: Math.random() * 2,
        color: ['#ffc107', '#e91e63', '#4caf50', '#2196f3', '#ff5722', '#9c27b0'][i % 6],
        size: 6 + Math.random() * 10, duration: 2 + Math.random() * 3,
      }));
      setConfettiPieces(pieces);
    }
  }, [showConfetti]);

  const handleTeachAnswer = useCallback((option) => {
    if (teachAnswered) return;
    setTeachAnswered(true);
    narrationRef.current?.cancel();

    if (option.correct) {
      play('correct');
      narrationRef.current = narrate(reflectCorrectNarration());
      setTeachCorrect(c => c + 1);
    } else {
      play('wrong');
      narrationRef.current = narrate(reflectWrongNarration());
    }

    setTimeout(() => {
      setTeachAnswered(false);
      if (teachIdx < REFLECT_QUESTIONS.length - 1) {
        setTeachIdx(i => i + 1);
      } else {
        setStep(1); // go to confidence
      }
    }, 1500);
  }, [teachAnswered, teachIdx, play]);

  const handleConfidence = (level) => {
    setConfidence(level);
    play('celebrate');
    setStep(2);
    setTimeout(() => setShowConfetti(true), 300);
  };

  // ─── RENDER: Teach-Back Quiz ─────────────────
  if (step === 0) {
    const rq = REFLECT_QUESTIONS[teachIdx];
    return (
      <div className="reflect-screen">
        <div className="phase-badge phase-badge-reflect" style={{ marginBottom: 24 }}>
          05 · Reflect
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--white)', marginBottom: 8 }}>
          Quick Check! 📝
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
          Question {teachIdx + 1} of {REFLECT_QUESTIONS.length}
        </p>

        <div className="progress-dots" style={{ marginBottom: 24 }}>
          {REFLECT_QUESTIONS.map((_, idx) => (
            <div key={idx} className={`progress-dot ${idx === teachIdx ? 'active' : idx < teachIdx ? 'completed' : ''}`} />
          ))}
        </div>

        <div className="teach-back-card">
          <p className="teach-back-q">{rq.q}</p>
          <div className="teach-back-options">
            {rq.options.map((opt, oi) => {
              let cls = 'teach-back-option';
              if (teachAnswered) {
                if (opt.correct) cls += ' correct';
                else cls += ' wrong';
              }
              return (
                <div key={oi} className={cls} onClick={() => handleTeachAnswer(opt)}>
                  <span className="emoji">{opt.emoji}</span>
                  <span>{opt.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─── RENDER: Confidence Rating ───────────────
  if (step === 1) {
    return (
      <div className="reflect-screen">
        <div className="phase-badge phase-badge-reflect" style={{ marginBottom: 24 }}>
          05 · Reflect
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--white)', marginBottom: 8 }}>
          How confident do you feel? 🎯
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
          Be honest — there's no wrong answer!
        </p>

        <div className="confidence-card">
          <div className="confidence-options">
            {CONFIDENCE_LEVELS.map((level, idx) => (
              <div
                key={idx}
                className="confidence-option"
                onClick={() => handleConfidence(level)}
                style={{ borderColor: level.color, background: `${level.color}15` }}
              >
                <span className="confidence-emoji">{level.emoji}</span>
                <span className="confidence-label" style={{ color: level.color }}>{level.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── RENDER: Certificate ─────────────────────
  return (
    <div className="reflect-screen">
      <div className="certificate">
        <div className="certificate-header">🏆 Certificate of Achievement</div>
        <h2 className="certificate-title">Lesson Complete!</h2>
        <p className="certificate-topic">Length: Longer & Shorter</p>

        <div className="star-display" style={{ marginBottom: 16 }}>
          {[1, 2, 3].map(i => (
            <span key={i} className={`star ${i <= Math.min(3, teachCorrect) ? 'earned' : 'empty'}`} style={{ fontSize: '2.5rem' }}>⭐</span>
          ))}
        </div>

        <div className="certificate-stats">
          <div className="certificate-stat">
            <div className="certificate-stat-value">{teachCorrect}/{REFLECT_QUESTIONS.length}</div>
            <div className="certificate-stat-label">Quiz Score</div>
          </div>
          <div className="certificate-stat">
            <div className="certificate-stat-value">{confidence?.emoji || '😊'}</div>
            <div className="certificate-stat-label">Confidence</div>
          </div>
          <div className="certificate-stat">
            <div className="certificate-stat-value">📏</div>
            <div className="certificate-stat-label">Topic</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => advanceTo(PHASES.INTRO)}>
            🏠 Home
          </button>
          <button className="btn btn-outline" onClick={() => { setStep(0); setTeachIdx(0); setTeachCorrect(0); setShowConfetti(false); }}>
            🔄 Replay
          </button>
        </div>
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div className="confetti-container">
          {confettiPieces.map(piece => (
            <div key={piece.id} className="confetti-piece" style={{
              left: `${piece.x}%`, width: piece.size, height: piece.size,
              backgroundColor: piece.color, animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
