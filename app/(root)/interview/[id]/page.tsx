"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming you have Card components
import { Mic, MicOff, Play, Pause, RotateCcw } from 'lucide-react'; // Icons for recorder

// Define the structure for a question
interface Question {
    id: string;
    questionText: string;
}

const InterviewSession = () => {
    const params = useParams();
    const interviewId = params.id as string;

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for voice recorder
    const [isRecording, setIsRecording] = useState(false);
    // MODIFICATION: Use useRef for audioChunks to avoid stale closure in onstop
    const audioChunksRef = useRef<Blob[]>([]);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);

    // Fetch questions from the API
    useEffect(() => {
        if (!interviewId) {
            setError("Interview ID is missing.");
            setLoading(false);
            return;
        }

        const fetchQuestions = async () => {
            try {
                const response = await fetch(`/api/interview/${interviewId}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch questions.');
                }
                const data = await response.json();
                setQuestions(data.questions);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error("Error fetching questions:", err);
                setError(err.message || "An error occurred while fetching questions.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [interviewId]);

    // Navigation handlers for flashcards
    const goToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            resetAudioRecorder(); // Reset recorder when changing questions
        }
    };

    const goToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prevIndex => prevIndex - 1);
            resetAudioRecorder(); // Reset recorder when changing questions
        }
    };

    const resetAudioRecorder = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        audioChunksRef.current = []; // MODIFICATION: Reset ref directly
        setAudioBlob(null);
        if (audioPlayerRef.current) {
            audioPlayerRef.current.pause();
            audioPlayerRef.current.currentTime = 0;
            setIsPlayingAudio(false);
            // Revoke object URL if it exists to free memory
            if (audioPlayerRef.current.src && audioPlayerRef.current.src.startsWith('blob:')) {
                URL.revokeObjectURL(audioPlayerRef.current.src);
                audioPlayerRef.current.src = ''; // Clear the source
            }
        }
        console.log("Audio recorder reset.");
    };

    // Voice Recorder Logic
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Check for supported MIME types for better compatibility
            let mimeType = 'audio/webm';
            if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
                mimeType = 'audio/webm;codecs=opus';
            } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
                mimeType = 'audio/ogg';
            }
            // Fallback to default if others not supported, or let MediaRecorder pick
            const options = { mimeType };
            console.log("Using MIME type for recording:", mimeType);

            const mediaRecorder = new MediaRecorder(stream, options);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = []; // MODIFICATION: Initialize ref for new recording

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    // MODIFICATION: Push directly to ref's current array
                    audioChunksRef.current.push(event.data);
                    console.log("Data available chunk size:", event.data.size, "Total chunks:", audioChunksRef.current.length);
                } else {
                    console.log("Empty data chunk received.");
                }
            };

            mediaRecorder.onstop = () => {
                // MODIFICATION: Use the ref's current value to create the Blob
                console.log("Recording stopped. Final audio chunks count:", audioChunksRef.current.length);
                const blob = new Blob(audioChunksRef.current, { type: mimeType });
                console.log("Audio Blob created, size:", blob.size, "type:", blob.type);
                setAudioBlob(blob);
                // Clean up stream tracks
                stream.getTracks().forEach(track => track.stop());
                setIsRecording(false); // Set recording state to false after stop
            };

            mediaRecorder.onerror = (event) => {
                console.error("MediaRecorder error:", event.error);
                alert(`Recording error: ${event.error.name} - ${event.error.message}`);
                setIsRecording(false);
                stream.getTracks().forEach(track => track.stop()); // Ensure stream is stopped on error
            };

            mediaRecorder.start();
            setIsRecording(true);
            setAudioBlob(null); // Clear previous recording
            setIsPlayingAudio(false); // Stop playback if any
            if (audioPlayerRef.current) {
                audioPlayerRef.current.pause();
                audioPlayerRef.current.currentTime = 0;
            }
            console.log("Recording started.");
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please ensure it's connected and permissions are granted.");
            setIsRecording(false);
        }
    };

const pauseRecording = () => {
        if (audioPlayerRef.current) {
            audioPlayerRef.current.pause();
            setIsPlayingAudio(false);
            console.log("Audio playback paused.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            console.log("Stopping recording...");
            mediaRecorderRef.current.stop();
            // setIsRecording(false) is now handled in mediaRecorder.onstop
        }
    };

    const playRecording = () => {
        if (audioBlob && audioBlob.size > 0) { // Ensure blob exists and has data
            console.log("Attempting to play audio blob, size:", audioBlob.size);
            const audioUrl = URL.createObjectURL(audioBlob);
            if (audioPlayerRef.current) {
                audioPlayerRef.current.src = audioUrl;
                audioPlayerRef.current.play()
                    .then(() => {
                        setIsPlayingAudio(true);
                        console.log("Audio playback started.");
                    })
                    .catch(e => {
                        console.error("Error playing audio:", e);
                        alert("Failed to play audio. The recording might be corrupted or unsupported.");
                        setIsPlayingAudio(false);
                        URL.revokeObjectURL(audioUrl); // Clean up URL on play error
                    });
                audioPlayerRef.current.onended = () => {
                    setIsPlayingAudio(false);
                    console.log("Audio playback ended.");
                    URL.revokeObjectURL(audioUrl); // Clean up the URL after playback
                    if (audioPlayerRef.current) audioPlayerRef.current.src = ''; // Clear src
                };
            }
        } else {
            console.warn("No valid audio blob to play.");
            alert("No recording found or recording is empty. Please record first.");
        }
    };

    const currentQuestion = questions[currentQuestionIndex];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
                <p>Loading interview questions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-red-400">
                <p>Error: {error}</p>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
                <p>No questions found for this interview.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-inter">
            <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center gap-6">
                {/* Logo and Title */}
                <div className="flex flex-row gap-2 justify-center items-center">
                    {/* Placeholder for your logo, ensure /logo.svg exists or replace */}
                    <Image src="/logo.svg" alt="logo" height={32} width={38} />
                    <h2 className="text-primary-100 text-2xl font-bold">Interview Session</h2>
                </div>

                {/* Question Flashcard */}
                <Card className="w-full bg-gray-700 text-white border-none rounded-lg shadow-md">
                    <CardHeader className="flex flex-row justify-between items-center pb-2">
                        <CardTitle className="text-lg text-gray-300">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </CardTitle>
                        <div className="flex space-x-2">
                            <Button
                                onClick={goToPreviousQuestion}
                                disabled={currentQuestionIndex === 0}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </Button>
                            <Button
                                onClick={goToNextQuestion}
                                disabled={currentQuestionIndex === questions.length - 1}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <p className="text-xl text-center font-medium">
                            {currentQuestion.questionText}
                        </p>
                    </CardContent>
                </Card>

                {/* Voice Recorder Section */}
                <div className="w-full bg-gray-700 rounded-lg p-4 flex flex-col items-center gap-4 shadow-md">
                    <h4 className="text-lg font-semibold">Voice Recorder</h4>
                    <div className="flex space-x-4">
                        <Button
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold transition duration-200 ease-in-out
                                ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                        >
                            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                            {isRecording ? 'Stop Recording' : 'Start Recording'}
                        </Button>
                        <Button
                            onClick={resetAudioRecorder}
                            disabled={isRecording}
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gray-500 hover:bg-gray-600 text-white font-semibold transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RotateCcw size={20} />
                            Reset
                        </Button>
                    </div>
                    {isRecording && (
                        <p className="text-red-400 animate-pulse">Recording...</p>
                    )}
                    {audioBlob && !isRecording && (
                        <div className="flex items-center gap-3 mt-2">
                            <audio ref={audioPlayerRef} controls className="hidden"></audio> {/* Hidden audio element */}
                            <Button
                                onClick={isPlayingAudio ? pauseRecording : playRecording}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold transition duration-200 ease-in-out
                                    ${isPlayingAudio ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-purple-500 hover:bg-purple-600'}`}
                            >
                                {isPlayingAudio ? <Pause size={20} /> : <Play size={20} />}
                                {isPlayingAudio ? 'Pause Playback' : 'Play Recording'}
                            </Button>
                            <span className="text-sm text-gray-300">Audio Ready</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InterviewSession;
