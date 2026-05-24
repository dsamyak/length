import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';

export default function AudioControl() {
  const { audioEnabled, toggleAudio } = useAudio();

  return (
    <button 
      onClick={toggleAudio}
      className="audio-toggle-btn"
      aria-label={audioEnabled ? "Mute audio" : "Unmute audio"}
    >
      {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
    </button>
  );
}
