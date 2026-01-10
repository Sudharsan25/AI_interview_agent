"use client";

/**
 * Interview Session Container Component
 * Orchestrates interview session state and UI
 * Separates container logic from presentational components
 */

import { useSession } from "@/lib/auth-client";
import { useInterviewSession } from "@/hooks";
import type { InterviewClientProps } from "@/types";
import { InterviewHeader } from "./interview-header";
import { InterviewerView } from "./interviewer-view";
import { UserView } from "./user-view";
import { InterviewControls } from "./interview-controls";

export function InterviewSessionContainer({
  initialData,
}: InterviewClientProps) {
  const { data: session } = useSession();
  const {
    currentQuestionIndex,
    agentTranscript,
    isListening,
    transcript,
    isProcessing,
    isAgentSpeaking,
    handleStartInterview,
    handleNextQuestion,
    handleFinishInterview,
    toggleListening,
  } = useInterviewSession({
    interview: initialData.details,
    questions: initialData.questions,
    interviewId: initialData.details.id,
  });

  const userName = session?.user?.name || "Candidate";
  const totalQuestions = initialData.questions.length;

  return (
    <div className="flex flex-col h-screen w-full bg-neutral-950 text-white overflow-hidden">
      <InterviewHeader
        role={initialData.details.role}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
      />

      <main className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
        <InterviewerView
          isSpeaking={isAgentSpeaking}
          transcript={agentTranscript}
        />
        <UserView
          userName={userName}
          isListening={isListening}
          transcript={transcript}
        />
      </main>

      <InterviewControls
        currentQuestionIndex={currentQuestionIndex}
        isListening={isListening}
        isAgentSpeaking={isAgentSpeaking}
        isProcessing={isProcessing}
        onStartInterview={handleStartInterview}
        onToggleListening={toggleListening}
        onNextQuestion={handleNextQuestion}
        onFinishInterview={handleFinishInterview}
      />
    </div>
  );
}
