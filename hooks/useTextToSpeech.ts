// in hooks/useTextToSpeech.ts

"use client";

import { useState, useRef, useEffect, useCallback } from 'react';

// Define the props the hook can accept
interface UseTextToSpeechProps {
  // A callback function to run when speech finishes playing
  onEnd?: () => void;
}

export const useTextToSpeech = ({ onEnd }: UseTextToSpeechProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Use a ref to hold the Audio object so it persists across re-renders
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Use a ref to hold the object URL to prevent memory leaks
  const audioUrlRef = useRef<string | null>(null);

  const play = useCallback(async (text: string) => {
    // Prevent starting a new speech if one is already loading or playing
    if (isLoading || isSpeaking || !text) return;

    setIsLoading(true);

    try {
      // 1. Call your internal API route to get the audio stream
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get audio stream from the server.');
      }

      // 2. Convert the streamed response into a Blob and create a playable URL
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;

      // 3. Create a new Audio object and store it in the ref
      const audio = new Audio(url);
      audioRef.current = audio;
      
      // 4. Set up event listeners for when playback starts and ends
      audio.onplay = () => {
        setIsLoading(false);
        setIsSpeaking(true);
      };
      
      audio.onended = () => {
        setIsSpeaking(false);
        if (onEnd) {
          onEnd();
        }
      };
      
      audio.onerror = () => {
        console.error("Error playing audio.");
        setIsLoading(false);
        setIsSpeaking(false);
      };

      audio.play();

    } catch (error) {
      console.error("Error in useTextToSpeech hook:", error);
      setIsLoading(false);
      setIsSpeaking(false);
    }
  }, [isLoading, isSpeaking, onEnd]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }
  }, []);
  
  // Cleanup function to run when the component using the hook unmounts
  useEffect(() => {
    return () => {
      // Stop any playing audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      // Revoke the object URL to prevent memory leaks
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  return { isLoading, isSpeaking, play, stop };
};