/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { InterviewClientProps } from "@/types";
import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
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
    "Welcome! Click 'I am ready' to begin."
  );

  // 2. Replace audio recorder logic with live transcription hook
  const { isListening, transcript, startListening, stopListening } =
    useLiveTranscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTranscripts, setCompletedTranscripts] = useState<
    Record<string, string>
  >({});

  const router = useRouter();

  // 3. Connect the TTS hook's onEnd callback to start the live transcription
  const { isSpeaking: isAgentSpeaking, play: playAgentAudio } = useTextToSpeech(
    {
      onEnd: startListening,
    }
  );

  const handleNextQuestion = async () => {
    // If the user was speaking, stop listening first.
    if (isListening) {
      await stopListening();
      const currentQuestionId = questions[currentQuestionIndex].id;
      // The `transcript` state now holds the final answer for the last question
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
      setAgentTranscript(nextQuestionText);
      playAgentAudio(nextQuestionText); // This will trigger startListening() onEnd
    } else {
      setAgentTranscript(
        "Thank you for completing the interview! Please wait while we process your results."
        // set interview.completed to be true;
      );
      // 4. The handleFinishInterview function is now much simpler
      await handleFinishInterview();
    }
  };

  const handleFinishInterview = async () => {
    setIsProcessing(true);
    console.log(
      "🚀 Interview finished. All completed transcripts:",
      completedTranscripts
    );
    // In a real implementation, you would now send `completedTranscripts`
    // to the server for processing instead of audio blobs.
    // For this assessment, we will just redirect.
    // Simulate a short delay for processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    router.push(`/interview/${interviewDetails.id}/feedback`);
    setIsProcessing(false);
  };

  // Determine the button text based on the current state
  const getButtonText = () => {
    if (isProcessing) return "Processing...";
    if (isListening) return "Finish Answering";
    if (currentQuestionIndex === -1) return "I am ready";
    if (currentQuestionIndex >= questions.length - 1) return "Finish Interview";
    return "Next Question";
  };

  return (
    <div className="flex h-fit w-full text-foreground">
      <aside className="w-64 flex-col border-r bg-muted/60 ml-8 mt-8 p-6 hidden md:flex">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Questions</h2>
        </div>
        <nav className="flex flex-col gap-2">
          {questions.map((question, index) => (
            <Button
              key={question.id}
              variant="ghost"
              className={clsx("justify-start text-left", {
                "bg-accent text-accent-foreground":
                  index === currentQuestionIndex,
              })}>
              {`Question ${index + 1}`}
            </Button>
          ))}
        </nav>
      </aside>

      <main className="flex flex-1 flex-col p-4 md:p-8 min-h-[800]">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 ">
          <Card
            className={clsx(
              "flex flex-col items-center justify-center text-center transition-all duration-300",
              {
                "ring-2 ring-blue-500 ring-offset-4 ring-offset-background":
                  isAgentSpeaking,
              }
            )}>
            <CardContent className="flex flex-col items-center justify-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-3xl">AI</AvatarFallback>
              </Avatar>
              {isAgentSpeaking && (
                <div className="text-sm text-blue-400 animate-pulse">
                  Speaking...
                </div>
              )}
              <p className="text-lg text-muted-foreground p-4 min-h-[100px]">
                {agentTranscript}
              </p>
            </CardContent>
          </Card>
          <Card
            className={clsx(
              "flex flex-col items-center justify-center text-center transition-all duration-300",
              // 5. Update the UI to reflect the 'isListening' state from the new hook
              {
                "ring-2 ring-green-500 ring-offset-4 ring-offset-background":
                  isListening,
              }
            )}>
            <CardContent className="flex flex-col items-center justify-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-3xl">You</AvatarFallback>
              </Avatar>
              {isListening && (
                <div className="text-sm text-green-400 animate-pulse">
                  Listening...
                </div>
              )}
              {/* 6. Display the live transcript from the hook */}
              <p className="text-lg text-muted-foreground p-4 min-h-[100px]">
                {transcript || session?.user.name}
              </p>
            </CardContent>
          </Card>
        </div>

        <footer className="flex items-center justify-center pt-8">
          <Button
            size="lg"
            onClick={handleNextQuestion}
            disabled={isAgentSpeaking || isProcessing}>
            {getButtonText()}
          </Button>
        </footer>
      </main>
    </div>
  );
};

export default InterviewClient;
