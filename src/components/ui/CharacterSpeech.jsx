import React, { useEffect } from 'react';
import { useAudio } from '../../hooks/useAudio';

export default function CharacterSpeech({ character = 'milo', text, audioSrc, position = 'left' }) {
  const { playNarration } = useAudio();

  useEffect(() => {
    if (audioSrc) {
      playNarration(audioSrc);
    }
  }, [audioSrc]);

  const imageSrc = character === 'milo' ? '/images/characters/milo.png' : '/images/characters/sari.png';

  return (
    <div className={`speech-bubble-wrapper ${position === 'right' ? 'right' : ''}`}>
      <img 
        src={imageSrc} 
        alt={character}
        className="speech-character"
      />
      <div className="speech-bubble animate-bounce-in">
        <p>{text}</p>
      </div>
    </div>
  );
}
