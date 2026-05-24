import { useState, useEffect, useRef } from 'react';
import { usePhase } from '../../hooks/usePhase';
import { useAudio } from '../../hooks/useAudio';
import { narrate, stopNarration } from '../../utils/audio';
import { getStoryNarration } from '../../utils/narration';

const STORY_SLIDES = [
  {
    image: '/images/story/story_problem.png',
    title: "John's Pencils",
    text: 'John has two pencils — a long red one and a short blue one. He places them on the desk and wonders...',
    highlight: '"Which pencil is LONGER?"',
    mascotText: "Let's help John find out! ✏️",
  },
  {
    image: '/images/story/story_comparing.png',
    title: 'Comparing Side by Side',
    text: 'Emily shows John a trick: line up the pencils so their left ends match. The one that sticks out further on the right is LONGER!',
    highlight: '"Put them side by side and look at the ends!"',
    mascotText: 'Align the ends! 📏',
  },
  {
    image: '/images/story/story_concept.png',
    title: 'Longer & Shorter',
    text: 'Now John sees it clearly! The red pencil stretches further — it is LONGER. The blue pencil stops earlier — it is SHORTER. When something goes further, we say it is "longer".',
    highlight: '"Longer means it stretches further. Shorter means it stops sooner!"',
    mascotText: 'The secret of length! 🔍',
  },
  {
    image: '/images/story/story_practice.png',
    title: "Let's Compare Everything!",
    text: 'John and Emily are excited! They started comparing ribbons, crayons, and even toy trains. "Comparing is so fun!" said Michel, joining them. "Can we practice more?"',
    highlight: '"Comparing by length — here we come!"',
    mascotText: 'Your turn now! 🚀',
  },
];

export default function StoryPhase() {
  const { advance } = usePhase();
  const { play } = useAudio();
  const [slide, setSlide] = useState(0);
  const [anim, setAnim] = useState(false);
  const [textVis, setTextVis] = useState(false);
  const [hlVis, setHlVis] = useState(false);
  const narrationRef = useRef(null);

  const s = STORY_SLIDES[slide];

  // Staggered reveal + narration
  useEffect(() => {
    setAnim(true);
    setTextVis(false);
    setHlVis(false);

    // Play narration for the current slide
    narrationRef.current?.cancel();
    const narTimer = setTimeout(() => {
      narrationRef.current = narrate(getStoryNarration(slide));
    }, 400);

    const t1 = setTimeout(() => setTextVis(true), 600);
    const t2 = setTimeout(() => setHlVis(true), 1200);

    return () => { 
      clearTimeout(t1); 
      clearTimeout(t2); 
      clearTimeout(narTimer);
      narrationRef.current?.cancel();
    };
  }, [slide]);

  const goNext = () => {
    narrationRef.current?.cancel();
    if (slide < STORY_SLIDES.length - 1) {
      play('correct');
      setAnim(false);
      setTimeout(() => setSlide(prev => prev + 1), 200);
    } else {
      play('correct');
      stopNarration();
      advance();
    }
  };

  const goBack = () => {
    if (slide > 0) {
      setAnim(false);
      setTimeout(() => setSlide(prev => prev - 1), 200);
    }
  };

  return (
    <div className="story-screen">
      <div className="phase-badge phase-badge-story" style={{ marginBottom: 20 }}>
        02 · Story
      </div>

      {/* Progress dots */}
      <div className="progress-dots" style={{ marginBottom: 20 }}>
        {STORY_SLIDES.map((_, idx) => (
          <div
            key={idx}
            className={`progress-dot ${idx === slide ? 'active' : idx < slide ? 'completed' : ''}`}
          />
        ))}
      </div>

      <div className="glass-card" style={{ width: '100%' }}>
        <div key={slide} className={anim ? 'story-slide' : ''} style={{ opacity: anim ? 1 : 0, transition: 'opacity 0.2s' }}>
          {/* Story Image */}
          <div className="story-slide-image">
            <img src={s.image} alt={s.title} />
          </div>

          {/* Title */}
          <h2 className="story-title">{s.title}</h2>

          {/* Story Text — fades in */}
          <div style={{ opacity: textVis ? 1 : 0, transition: 'opacity 0.5s', transform: textVis ? 'translateY(0)' : 'translateY(10px)' }}>
            <p className="story-text">{s.text}</p>
          </div>

          {/* Highlight Quote — fades in later */}
          <div style={{ opacity: hlVis ? 1 : 0, transition: 'opacity 0.5s', transform: hlVis ? 'translateY(0)' : 'translateY(10px)' }}>
            <div className="story-highlight">{s.highlight}</div>
          </div>

          {/* Mascot footer */}
          <div className="story-mascot">
            <span>🐒</span>
            <span>{s.mascotText}</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="story-nav">
          <button
            className="btn btn-outline btn-sm"
            onClick={goBack}
            disabled={slide === 0}
            style={{ opacity: slide === 0 ? 0.3 : 1 }}
          >
            ← Back
          </button>

          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {slide + 1} / {STORY_SLIDES.length}
          </span>

          <button className="btn btn-primary btn-sm" onClick={goNext}>
            {slide < STORY_SLIDES.length - 1 ? 'Next →' : 'Go to Sandbox! 🧪'}
          </button>
        </div>
      </div>
    </div>
  );
}
