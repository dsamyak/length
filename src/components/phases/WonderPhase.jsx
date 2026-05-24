import { useState, useMemo, useEffect, useRef } from 'react';
import { usePhase } from '../../hooks/usePhase';
import { useAudio } from '../../hooks/useAudio';
import { narrate, stopNarration } from '../../utils/audio';
import { wonderNarration, wonderDiscoverNarration } from '../../utils/narration';

const WONDER_QUESTIONS = [
  {
    question: "John has two sticks. One reaches the wall, the other doesn't...",
    subtext: "How can he tell which stick is LONGER?",
    emoji: "📏",
    bgEmojis: ["📏", "✨", "🔍", "❓"],
  },
  {
    question: "Two snakes are side by side. One stretches much further!",
    subtext: "Which snake is SHORTER — and how do you know?",
    emoji: "🐍",
    bgEmojis: ["🐍", "🏁", "📏", "🔍"],
  },
  {
    question: "Emily lined up her coloured pencils on the desk...",
    subtext: "Can she find which pencil is the LONGEST?",
    emoji: "✏️",
    bgEmojis: ["✏️", "📐", "🎨", "✨"],
  },
  {
    question: "Michel found two ribbons on the floor...",
    subtext: "One ribbon is shorter! How does he figure it out?",
    emoji: "🎀",
    bgEmojis: ["🎀", "🔎", "📏", "💡"],
  },
  {
    question: "Sarah and Tom each have a skipping rope...",
    subtext: "If we stretch them out, how can we compare which rope is longer?",
    emoji: "🪢",
    bgEmojis: ["🪢", "🤔", "📏", "⭐"],
  },
];

export default function WonderPhase() {
  const { advance } = usePhase();
  const { play } = useAudio();
  const [stage, setStage] = useState(0); // 0=question, 1=discover
  const [particles, setParticles] = useState([]);
  const narrationRef = useRef(null);

  const wonder = useMemo(
    () => WONDER_QUESTIONS[Math.floor(Math.random() * WONDER_QUESTIONS.length)],
    []
  );

  // Spawn background particles
  useEffect(() => {
    const p = wonder.bgEmojis.flatMap((e, gi) =>
      Array.from({ length: 3 }, (_, pi) => ({
        id: `${gi}-${pi}`,
        emoji: e,
        top: `${10 + Math.random() * 70}%`,
        left: `${5 + Math.random() * 85}%`,
        delay: `${gi * 1.5 + pi * 0.5}s`,
        size: 1.8 + Math.random() * 1.5,
      }))
    );
    setParticles(p);
  }, [wonder]);

  // Play narration
  useEffect(() => {
    if (stage === 0) {
      narrationRef.current?.cancel();
      const timer = setTimeout(() => {
        narrationRef.current = narrate(wonderNarration(wonder.question));
      }, 500);
      return () => clearTimeout(timer);
    } else if (stage === 1) {
      narrationRef.current?.cancel();
      narrationRef.current = narrate(wonderDiscoverNarration());
    }
    return () => {
      narrationRef.current?.cancel();
    };
  }, [stage, wonder]);

  const handleDiscover = () => {
    play('correct');
    setStage(1);
  };

  const handleNext = () => {
    narrationRef.current?.cancel();
    stopNarration();
    play('correct');
    advance();
  };

  return (
    <div className="wonder-screen">
      {/* Background emoji particles */}
      {particles.map(p => (
        <span
          key={p.id}
          className="wonder-emoji-bg"
          style={{
            top: p.top,
            left: p.left,
            fontSize: `${p.size}rem`,
            animationDelay: p.delay,
          }}
        >
          {p.emoji}
        </span>
      ))}

      <div className="phase-badge phase-badge-wonder" style={{ marginBottom: 24 }}>
        01 · Wonder
      </div>

      {stage === 0 ? (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="wonder-emoji">{wonder.emoji}</div>
          <h1 className="wonder-question">{wonder.question}</h1>
          <p className="wonder-subtext">{wonder.subtext}</p>
          <button className="btn btn-primary btn-lg" onClick={handleDiscover}>
            Let's Find Out! 🚀
          </button>
        </div>
      ) : (
        <div className="animate-bounce-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="wonder-emoji">💡</div>
          <h1 className="wonder-question">Great Question!</h1>
          <p className="wonder-subtext">
            We compare by putting things side-by-side. The one that stretches 
            further is LONGER — the other is SHORTER!
          </p>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: '0.95rem' }}>
            Let's see this in action through a story...
          </p>
          <button className="btn btn-green btn-lg" onClick={handleNext}>
            Let's Go! →
          </button>
        </div>
      )}
    </div>
  );
}
