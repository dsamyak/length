import { useContext, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { AppContext } from '../context/AppContext';

// Safe Howl wrapper to avoid crashing if files are missing
const createSafeHowl = (config) => {
  try {
    return new Howl(config);
  } catch (e) {
    console.warn('Howl initialization failed', e);
    return { play: () => {}, stop: () => {}, fade: () => {}, volume: () => {} };
  }
};

const sounds = {
  correct: createSafeHowl({ src: ['/audio/sfx/correct.mp3'] }),
  wrong: createSafeHowl({ src: ['/audio/sfx/wrong.mp3'] }),
  bgMusic: createSafeHowl({ src: ['/audio/music/bg_loop.mp3'], loop: true, volume: 0.3 }),
  celebrate: createSafeHowl({ src: ['/audio/sfx/celebrate.mp3'] }),
};

export function useAudio() {
  const { state, dispatch } = useContext(AppContext);
  const { audioEnabled } = state;
  const activeNarration = useRef(null);

  const toggleAudio = () => {
    dispatch({ type: 'TOGGLE_AUDIO' });
  };

  useEffect(() => {
    if (audioEnabled) {
      if (state.phase === 'practice') {
        sounds.bgMusic.play();
      }
    } else {
      Howler.mute(true);
    }
    
    if (audioEnabled) {
        Howler.mute(false);
    }

    return () => {
      // Cleanup if needed
    };
  }, [audioEnabled, state.phase]);

  const play = (key) => {
    if (audioEnabled && sounds[key]) {
      sounds[key].play();
    }
  };

  const playNarration = (src) => {
    if (!audioEnabled) return;
    
    if (activeNarration.current) {
      activeNarration.current.stop();
    }

    activeNarration.current = createSafeHowl({ 
      src: [src], 
      autoplay: true,
      onend: () => {
        activeNarration.current = null;
      }
    });
  };

  const stopNarration = () => {
    if (activeNarration.current) {
      activeNarration.current.stop();
      activeNarration.current = null;
    }
  };

  return { play, playNarration, stopNarration, toggleAudio, audioEnabled };
}
