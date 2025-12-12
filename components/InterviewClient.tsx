/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { InterviewClientProps } from "@/types";
import React, { useState } from "react";

import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { clsx } from "clsx";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
// 1. Import the new live transcription hook and remove the old recorder hook
import { useLiveTranscription } from "@/hooks/useAudioRecorder";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

const InterviewClient = ({ initialData }: InterviewClientProps) => {
  const { data: session } = useSession();
  const [interviewDetails, setInterviewDetails] = useState(initialData.details);
  const [questions, setQuestions] = useState(initialData.questions);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [agentTranscript, setAgentTranscript] = useState(
    "Welcome! Click 'Start Interview' to begin."
  );

  const { isListening, transcript, startListening, stopListening } =
    useLiveTranscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTranscripts, setCompletedTranscripts] = useState<
    Record<string, string>
  >({});

  const router = useRouter();

  const { isSpeaking: isAgentSpeaking, play: playAgentAudio } = useTextToSpeech(
    {
      onEnd: () => {
        // Optional: Auto-start listening after agent finishes, 
        // but user has a manual 'Start Speaking' button now too.
        // We can keep this for convenience or remove if strict manual control is desired.
        // Keeping it for flow fluidity as per original design.
        startListening();
      },
    }
  );

  const handleStartInterview = async () => {
      const nextIndex = 0;
      setCurrentQuestionIndex(nextIndex);
      const nextQuestionText = questions[nextIndex].questionText;
      setAgentTranscript(
        "Question " + (nextIndex + 1) + ": " + nextQuestionText
      );
      playAgentAudio(nextQuestionText);
  };

  const handleNextQuestion = async () => {
    if (isListening) {
      await stopListening();
      const currentQuestionId = questions[currentQuestionIndex].id;
      console.log(
        `✅ Final transcript for question ${currentQuestionIndex + 1}:`,
        transcript
      );
      setCompletedTranscripts((prev) => ({
        ...prev,
        [currentQuestionId]: transcript,
      }));
    }

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      const nextQuestionText = questions[nextIndex].questionText;
      setAgentTranscript(
        "Question " + (nextIndex + 1) + ": " + nextQuestionText
      );
      playAgentAudio(nextQuestionText);
    } else {
      setAgentTranscript(
        "Thank you for completing the interview! Please wait while we process your results."
      );
      await handleFinishInterview();
    }
  };

  const handleFinishInterview = async () => {
    setIsProcessing(true);
    // If listening, stop and save current
    if (isListening) {
        await stopListening();
        if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.length) {
             const currentQuestionId = questions[currentQuestionIndex].id;
             setCompletedTranscripts((prev) => ({
                ...prev,
                [currentQuestionId]: transcript,
              }));
        }
    }

    console.log(
      "🚀 Interview finished. All completed transcripts:",
      completedTranscripts
    );
    
    await new Promise((resolve) => setTimeout(resolve, 2000));

    router.push(`/home`);
    setIsProcessing(false);
  };

  // Icons
  const MicIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
  );
  const MicOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" x2="23" y1="1" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
  );
  const VideoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
  );
  const PhoneOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="23" x2="1" y1="1" y2="23"/></svg>
  );
  const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
  );
  const SkipForwardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" x2="19" y1="5" y2="19"/></svg>
  );

  return (
    <div className="flex flex-col h-screen w-full bg-neutral-950 text-white overflow-hidden">
      {/* Header / Top Bar */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
           <span className="font-medium text-sm text-neutral-200">Live Interview</span>
           
        </div>
        <span className="font-medium text-sm text-neutral-200">Interview for {interviewDetails.role}</span>
        <div className="text-sm text-neutral-400">
            {currentQuestionIndex === -1 ? "Ready to Start" : `Question ${currentQuestionIndex + 1} of ${questions.length}`}
        </div>
      </header>

      {/* Main Content - Split Screen */}
      <main className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
        
        {/* AI Interviewer View */}
        <div className="flex-1 relative bg-neutral-800/50 rounded-2xl overflow-hidden border border-neutral-700/50 shadow-2xl">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <div className={clsx(
                    "w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all duration-300",
                    isAgentSpeaking ? "bg-blue-500/20 ring-4 ring-blue-500/40 scale-110" : "bg-neutral-700"
                )}>
                    <Avatar className="w-28 h-28 border-4 border-neutral-800">
                        <AvatarFallback className="text-4xl bg-blue-600 text-white">AI</AvatarFallback>
                    </Avatar>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">Interviewer</h3>
                <div className="max-w-md">
                     {isAgentSpeaking ? (
                         <div className="flex items-center justify-center gap-1 h-6">
                             <span className="w-1 h-3 bg-blue-400 animate-bounce [animation-delay:-0.3s]"></span>
                             <span className="w-1 h-5 bg-blue-400 animate-bounce [animation-delay:-0.15s]"></span>
                             <span className="w-1 h-3 bg-blue-400 animate-bounce"></span>
                         </div>
                     ) : (
                         <p className="text-neutral-400 text-sm line-clamp-3">{agentTranscript}</p>
                     )}
                </div>
            </div>
            <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
                <MicIcon /> AI Interviewer
            </div>
        </div>

        {/* User View */}
        <div className="flex-1 relative bg-neutral-800/50 rounded-2xl overflow-hidden border border-neutral-700/50 shadow-2xl">
             <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <div className={clsx(
                    "w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all duration-300",
                    isListening ? "bg-green-500/20 ring-4 ring-green-500/40 scale-110" : "bg-neutral-700"
                )}>
                    <Avatar className="w-28 h-28 border-4 border-neutral-800">
                        <AvatarFallback className="text-4xl bg-green-600 text-white">ME</AvatarFallback>
                    </Avatar>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{session?.user?.name || "Candidate"}</h3>
                 <div className="max-w-md min-h-[3rem]">
                     {isListening ? (
                         <p className="text-green-400 text-lg font-medium animate-pulse">Listening...</p>
                     ) : (
                         <p className="text-neutral-500 text-sm">Microphone is off</p>
                     )}
                     {transcript && isListening && (
                         <p className="text-neutral-300 text-sm mt-2 line-clamp-2">"{transcript}"</p>
                     )}
                </div>
            </div>
             <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
                {isListening ? <MicIcon /> : <MicOffIcon />} You
            </div>
        </div>

      </main>

      {/* Control Bar */}
      <footer className="h-24 bg-neutral-900 border-t border-neutral-800 flex items-center justify-center gap-6 px-4">
        
        {currentQuestionIndex === -1 && (
            <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 text-lg shadow-lg shadow-blue-900/20"
                onClick={handleStartInterview}
            >
                <PlayIcon /> Start Interview
            </Button>
        )}

        {currentQuestionIndex >= 0 && (
            <>
                <Button
                    variant={isListening ? "destructive" : "secondary"}
                    size="icon"
                    className={clsx(
                        "w-14 h-14 rounded-full transition-all duration-300", 
                        isListening ? "bg-red-500 hover:bg-red-600" : "bg-neutral-700 hover:bg-neutral-600"
                    )}
                    onClick={() => isListening ? stopListening() : startListening()}
                    title={isListening ? "Stop Speaking" : "Start Speaking"}
                >
                    {isListening ? <MicOffIcon /> : <MicIcon />}
                </Button>
                
                {/* Visual label for the mic button for clarity as requested */}
                <div className="hidden md:block absolute bottom-24 bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none opacity-0 transition-opacity group-hover:opacity-100">
                    {isListening ? "Stop Speaking" : "Start Speaking"}
                </div>

                <Button
                    variant="secondary"
                    size="lg"
                    className="bg-neutral-700 hover:bg-neutral-600 text-white rounded-full px-6 py-6"
                    onClick={handleNextQuestion}
                    disabled={isAgentSpeaking || isProcessing}
                >
                    <SkipForwardIcon /> Next Question
                </Button>

                 <Button
                    variant="destructive"
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-6"
                    onClick={handleFinishInterview}
                >
                    <PhoneOffIcon /> End Interview
                </Button>
            </>
        )}

      </footer>
    </div>
  );
};

export default InterviewClient;
