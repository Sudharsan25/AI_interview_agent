// in hooks/useLiveTranscription.ts

"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
// 1. Import from the Deepgram SDK
import { createClient, LiveClient, LiveTranscriptionEvents } from "@deepgram/sdk";

// The hook's public interface remains the same
interface LiveTranscriptionHook {
  isListening: boolean;
  transcript: string;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
}

export const useLiveTranscription = (): LiveTranscriptionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  // Refs to hold the persistent instances
  const deepgramConnectionRef = useRef<LiveClient | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const finalTranscriptRef = useRef<string>('');

  const startListening = useCallback(async () => {
    if (isListening) return;

    setIsListening(true);
    finalTranscriptRef.current = '';
    setTranscript('');

    try {
      // 2. Fetch the temporary key from your new Deepgram endpoint
      const response = await fetch('/api/deepgram');
      const data = await response.json();

      if (!data.apiKey) {
        throw new Error('Failed to get Deepgram temporary key.');
      }

      // 3. Initialize the Deepgram client and establish the live connection
      const deepgram = createClient(data.apiKey);
      const connection = deepgram.listen.live({
        model: 'nova-2',
        smart_format: true,
        interim_results: true, // Enable partial transcripts for a live effect
      });
      deepgramConnectionRef.current = connection;

      // 4. Set up the event handlers for the connection
      connection.on(LiveTranscriptionEvents.Open, async () => {
        // 5. Get microphone stream and create MediaRecorder once connected
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = recorder;

        // 6. Set up the pipe: recorder -> Deepgram
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0 && connection.getReadyState() === 1) { // WebSocket.OPEN = 1
            connection.send(event.data);
          }
        };

        // 7. Start recording
        recorder.start(250); // Send audio chunks every 250ms
      });

      connection.on(LiveTranscriptionEvents.Transcript, (transcriptionData) => {
        const text = transcriptionData.channel.alternatives[0].transcript;
        if (transcriptionData.is_final) {
          finalTranscriptRef.current += text + ' ';
          setTranscript(finalTranscriptRef.current);
        } else {
          setTranscript(finalTranscriptRef.current + text);
        }
      });

      connection.on(LiveTranscriptionEvents.Error, (error) => console.error('Deepgram error:', error));
      connection.on(LiveTranscriptionEvents.Close, () => console.log('Deepgram connection closed.'));

    } catch (error) {
      console.error('Error starting live transcription:', error);
      setIsListening(false);
    }
  }, [isListening]);

  const stopListening = useCallback(async () => {
    if (!isListening) return;

    // Stop the recorder and microphone tracks
    if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    // Close the Deepgram connection
    if (deepgramConnectionRef.current) {
        deepgramConnectionRef.current.finish();
    }

    // Reset refs and state
    mediaRecorderRef.current = null;
    deepgramConnectionRef.current = null;
    setIsListening(false);
  }, [isListening]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return { isListening, transcript, startListening, stopListening };
};