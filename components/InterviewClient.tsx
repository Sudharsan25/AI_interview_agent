/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { InterviewClientProps } from '@/types';
import React, { useState } from 'react'
import { Card, CardContent } from './ui/card';
import {Avatar, AvatarFallback} from "./ui/avatar";
import { CameraFeed } from './CameraFeed';
import { Button } from './ui/button';
import { clsx } from 'clsx';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useRouter } from 'next/navigation';

const InterviewClient = ({ initialData }: InterviewClientProps) => {
    // No changes to your state management and hooks, it's well-structured.
    const [interviewDetails, setInterviewDetails] = useState(initialData.details);
    const [questions, setQuestions] = useState(initialData.questions);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
    const [agentTranscript, setAgentTranscript] = useState("Welcome! Click 'I am ready' to begin.");

    const [audioRecordings, setAudioRecordings] = useState<Record<string, Blob>>({});
    const { isRecording, startRecording, stopRecording } = useAudioRecorder();
    const [isProcessing, setIsProcessing] = useState(false);

    const router = useRouter();
    // The onEnd callback will now automatically start the recording
    const { isSpeaking: isAgentSpeaking, play: playAgentAudio } = useTextToSpeech({
      onEnd: startRecording
    });

    const handleNextQuestion = async () => {
        if (isRecording) {
            const audioBlob = await stopRecording();
            const currentQuestionId = questions[currentQuestionIndex].id;
            setAudioRecordings(prev => ({ ...prev, [currentQuestionId]: audioBlob }));
            console.log(`✅ Audio for question ${currentQuestionIndex + 1} (ID: ${currentQuestionId}) saved to state.`, { audioBlob });                
        }

        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
            setCurrentQuestionIndex(nextIndex);
            const nextQuestionText = questions[nextIndex].questionText;
            setAgentTranscript(nextQuestionText);
            playAgentAudio(nextQuestionText);
        } else {
            setAgentTranscript("Thank you for completing the interview! Please wait while we process your results.");
            // The interview is over, now we need to trigger the final processing step
            await handleFinishInterview();
        }
    };

    const handleFinishInterview = async () => {
        setIsProcessing(true);
        const formData = new FormData();

        // --- ADDED LOG ---
        console.log("🚀 Starting final processing. Uploading all recorded audio blobs:", audioRecordings);

        for (const questionId in audioRecordings) {
            formData.append(questionId, audioRecordings[questionId], `question_${questionId}.webm`);
        }

        try {
            const response = await fetch(`/api/interview/${interviewDetails.id}/process`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to process interview.');
            }

            const result = await response.json();
            
            // --- ADDED LOG ---
            console.log("✅ Server processing complete. API Response:", result);

            router.push(`/interview/${interviewDetails.id}/feedback`);

        } catch (error) {
            console.error("Error finishing interview:", error);
        } finally {
            setIsProcessing(false);
        }
    };


    return (
        <div className='flex h-screen w-full bg-background text-foreground'>
            <aside className="w-64 flex-col border-r bg-muted/40 p-4 hidden md:flex">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Questions</h2>
                </div>
                <nav className="flex flex-col gap-2">
                    {questions.map((question, index) => (
                        <Button
                            key={question.id}
                            variant="ghost"
                            className={clsx(
                                "justify-start text-left",
                                // 1. UI LINK: Sidebar now highlights the active question
                                { "bg-accent text-accent-foreground": index === currentQuestionIndex }
                            )}
                        >
                            {`Question ${index + 1}`}
                        </Button>
                    ))}
                </nav>
            </aside>
            
            <main className='flex flex-1 flex-col p-4 md:p-8'>
                <div className='flex-1 grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <Card className={clsx(
                        "flex flex-col items-center justify-center text-center transition-all duration-300",
                        // 2. UI LINK: Interviewer card now glows when the agent is speaking
                        { "ring-2 ring-blue-500 ring-offset-4 ring-offset-background": isAgentSpeaking }
                    )}>
                        <CardContent className="flex flex-col items-center justify-center gap-6">
                            <Avatar className="w-24 h-24">
                                <AvatarFallback className="text-3xl">AI</AvatarFallback>
                            </Avatar>
                            {isAgentSpeaking && <div className="text-sm text-blue-400 animate-pulse">Speaking...</div>}
                            <p className="text-lg text-muted-foreground p-4 min-h-[100px]">
                                {/* 3. UI LINK: Agent's text is now driven by state */}
                                {agentTranscript}
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card className={clsx(
                        "transition-all duration-300",
                        // 4. UI LINK: Camera feed card now glows when recording
                        { "ring-2 ring-green-500 ring-offset-4 ring-offset-background": isRecording }
                    )}>
                        <CameraFeed />
                    </Card>
                </div>

                <footer className="flex items-center justify-center pt-8">
                    <Button 
                      size="lg"
                      // 6. UI LINK: Button is now connected to the handler
                      onClick={handleNextQuestion}
                      // 7. UI LINK: Button is disabled while the AI is speaking
                      disabled={isAgentSpeaking}
                    >
                        {/* 8. UI LINK: Button text is now dynamic */}
                        {currentQuestionIndex === -1 ? "I am ready" : "Next Question"}
                    </Button>
                </footer>
            </main>
        </div>
    );
};

export default InterviewClient;