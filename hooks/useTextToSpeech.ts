// in hooks/useTextToSpeech.ts

"use client";

import { useState } from 'react';

// Define the props for the hook
interface UseTextToSpeechProps {
  onEnd?: () => void; // A callback function to run when speech finishes
}

export const useTextToSpeech = ({ onEnd }: UseTextToSpeechProps = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const play = async (text: string) => {
    // Don't start a new speech if one is already playing
    if (isSpeaking || !text) return;

    setIsSpeaking(true);

    try {
      // 1. Call your internal API route to get the audio
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get audio stream from server.');
      }

      // 2. Play the audio stream in the browser
      const audioContext = new AudioContext();
      const source = audioContext.createBufferSource();
      const audioBuffer = await audioContext.decodeAudioData(await response.arrayBuffer());
      
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);

      // 3. Set up the onended event to clean up
      source.onended = () => {
        setIsSpeaking(false);
        if (onEnd) {
          onEnd();
        }
      };

    } catch (error) {
      console.error("Error playing text-to-speech:", error);
      setIsSpeaking(false);
    }
  };

  return { isSpeaking, play };
};