import React from 'react';
import { usePhase } from './hooks/usePhase';
import FloatingNumbers from './components/ui/FloatingNumbers';
import AudioControl from './components/ui/AudioControl';

// Phase Components
import IntroScreen from './components/phases/IntroScreen';
import WonderPhase from './components/phases/WonderPhase';
import StoryPhase from './components/phases/StoryPhase';
import SimulatePhase from './components/phases/SimulatePhase';
import PlayPhase from './components/phases/PlayPhase';
import ReflectPhase from './components/phases/ReflectPhase';

const JOURNEY = [
  { id: 'wonder', label: 'Wonder', icon: '🔍', num: '01' },
  { id: 'story', label: 'Story', icon: '📖', num: '02' },
  { id: 'simulate', label: 'Simulate', icon: '🧪', num: '03' },
  { id: 'play', label: 'Play', icon: '🎮', num: '04' },
  { id: 'reflect', label: 'Reflect', icon: '📓', num: '05' },
];

function JourneyBar({ currentPhase, completedPhases }) {
  return (
    <div className="journey-bar">
      {JOURNEY.map((step, idx) => {
        const isActive = step.id === currentPhase;
        const isCompleted = completedPhases.includes(step.id);
        const cls = `journey-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;

        return (
          <React.Fragment key={step.id}>
            <div className={cls}>
              <div className="journey-step-dot">
                {isCompleted ? '✓' : step.num}
              </div>
              <span className="journey-step-label">{step.label}</span>
            </div>
            {idx < JOURNEY.length - 1 && (
              <div className={`journey-connector ${isCompleted ? 'filled' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function App() {
  const { phase, advanceTo, PHASES, completedPhases } = usePhase();

  const isIntro = phase === PHASES.INTRO;

  const renderPhase = () => {
    switch (phase) {
      case PHASES.INTRO:    return <IntroScreen />;
      case PHASES.WONDER:   return <WonderPhase />;
      case PHASES.STORY:    return <StoryPhase />;
      case PHASES.SIMULATE: return <SimulatePhase />;
      case PHASES.PLAY:     return <PlayPhase />;
      case PHASES.REFLECT:  return <ReflectPhase />;
      default:              return <IntroScreen />;
    }
  };

  return (
    <>
      <FloatingNumbers />

      <div className="app-container">
        {/* Audio toggle */}
        <AudioControl />

        {/* Home button (hidden on intro) */}
        {!isIntro && (
          <button className="home-btn" onClick={() => advanceTo(PHASES.INTRO)}>
            🏠 Home
          </button>
        )}

        {/* Journey bar (hidden on intro) */}
        {!isIntro && (
          <JourneyBar currentPhase={phase} completedPhases={completedPhases} />
        )}

        {/* Phase content */}
        {renderPhase()}
      </div>
    </>
  );
}

export default App;
