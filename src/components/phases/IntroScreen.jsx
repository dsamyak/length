import { useEffect, useRef } from 'react';
import { usePhase } from '../../hooks/usePhase';
import { narrate, stopNarration } from '../../utils/audio';
import { introNarration } from '../../utils/narration';

const JOURNEY_PHASES = [
  { icon: '🔍', label: 'Wonder', desc: 'A length mystery!' },
  { icon: '📖', label: 'Story', desc: 'See length in action' },
  { icon: '🧪', label: 'Simulate', desc: 'Build & compare' },
  { icon: '🎮', label: 'Play', desc: 'Gamified challenges' },
  { icon: '📓', label: 'Reflect', desc: 'What did you learn?' },
];

export default function IntroScreen() {
  const { advance } = usePhase();
  const narrationRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      narrationRef.current = narrate(introNarration());
    }, 200);
    return () => {
      clearTimeout(timer);
      narrationRef.current?.cancel();
      stopNarration();
    };
  }, []);

  const handleStart = () => {
    narrationRef.current?.cancel();
    stopNarration();
    advance();
  };

  return (
    <div className="intro-screen">
      {/* Curriculum badge */}
      <div className="intro-badge">
        ✨ &nbsp;·&nbsp; Grade 1 Maths
      </div>

      {/* Title */}
      <h1 className="intro-title">
        Length: Longer &amp; Shorter
      </h1>
      <p className="intro-subtitle">
        📏 Comparing Objects by Length
      </p>
      <p className="intro-description">
        Discover how to compare objects by their length! Learn what "longer" and
        "shorter" mean through interactive stories, hands-on simulations, and
        fun challenges.
      </p>

      {/* Journey map */}
      <div className="intro-journey-map">
        {JOURNEY_PHASES.map((phase, idx) => (
          <div key={phase.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="intro-journey-step">
              <span className="intro-journey-icon">{phase.icon}</span>
              <span className="intro-journey-label">{phase.label}</span>
              <span className="intro-journey-desc">{phase.desc}</span>
            </div>
            {idx < JOURNEY_PHASES.length - 1 && (
              <span className="intro-journey-arrow">→</span>
            )}
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button className="btn btn-primary btn-lg" onClick={handleStart}>
        🚀 Start Learning!
      </button>
    </div>
  );
}
