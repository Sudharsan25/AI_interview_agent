"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTextToSpeech } from "./useTextToSpeech";
import { useLiveTranscription } from "./useAudioRecorder";
import type { Interview, Question } from "@/types";
import { processInterviewCompletion } from "@/lib/services/client";
import { toast } from "sonner";

interface UseInterviewSessionProps {
  interview: Interview;
  questions: Question[];
  interviewId: string;
}

interface UseInterviewSessionReturn {
  // State
  currentQuestionIndex: number;
  agentTranscript: string;
  isListening: boolean;
  transcript: string;
  isProcessing: boolean;
  isAgentSpeaking: boolean;
  completedTranscripts: Record<string, string>;

  // Actions
  handleStartInterview: () => Promise<void>;
  handleNextQuestion: () => Promise<void>;
  handleFinishInterview: () => Promise<void>;
  toggleListening: () => Promise<void>;
}

/**
 * Custom hook for managing interview session state and logic
 * Separates business logic from UI components
 */
export function useInterviewSession({
  interview, // Keep for interface compatibility but not used in logic
  questions,
  interviewId,
}: UseInterviewSessionProps): UseInterviewSessionReturn {
  // Suppress unused variable warning - interview is kept for interface compatibility
  void interview;

  const router = useRouter();

  // Component state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [agentTranscript, setAgentTranscript] = useState(
    "Welcome! Click 'Start Interview' to begin."
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTranscripts, setCompletedTranscripts] = useState<
    Record<string, string>
  >({});

  // Audio hooks
  const { isListening, transcript, startListening, stopListening } =
    useLiveTranscription();

  const { isSpeaking: isAgentSpeaking, play: playAgentAudio } = useTextToSpeech(
    {
      onEnd: () => {
        startListening();
      },
    }
  );

  // Helper function to format question text
  const formatQuestionText = useCallback(
    (index: number, questionText: string) => {
      return `Question ${index + 1}: ${questionText}`;
    },
    []
  );

  // Handle finishing the interview (defined first since it's used by handleNextQuestion)
  const handleFinishInterview = useCallback(async () => {
    // Calculate if interview is complete (all questions answered)
    let finalTranscripts = { ...completedTranscripts };

    // Save current transcript if listening
    if (isListening) {
      await stopListening();
      const currentQuestionId = questions[currentQuestionIndex]?.id;
      if (currentQuestionId && transcript) {
        finalTranscripts = {
          ...finalTranscripts,
          [currentQuestionId]: transcript,
        };
      }
    }

    // Check if all questions have been answered
    // An interview is complete if:
    // 1. We've answered all questions (transcripts for all question IDs)
    // 2. AND we've reached or passed the last question index
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(finalTranscripts).length;

    // Get all question IDs to check if we have transcripts for all
    const allQuestionIds = questions.map((q) => q.id);

    // Check if we have transcripts for all questions
    // Important: every() returns true for empty arrays, so we need to check count first
    const hasAllTranscripts =
      totalQuestions > 0 &&
      allQuestionIds.every(
        (id) => finalTranscripts[id] && finalTranscripts[id].trim().length > 0
      );

    // Interview is complete ONLY if:
    // - We have transcripts for ALL questions (non-empty, and count matches)
    // - We're at or past the last question index
    const isComplete =
      totalQuestions > 0 &&
      hasAllTranscripts &&
      answeredQuestions === totalQuestions &&
      currentQuestionIndex >= totalQuestions - 1;

    // Debug logging
    console.log("[handleFinishInterview] Debug:", {
      totalQuestions,
      answeredQuestions,
      currentQuestionIndex,
      hasAllTranscripts,
      isComplete,
      transcriptKeys: Object.keys(finalTranscripts),
      allQuestionIds,
    });

    // Show confirmation dialog if not complete
    // This dialog should ALWAYS show when user manually clicks "End Interview"
    // unless all questions are truly complete
    if (!isComplete) {
      console.log(
        "[handleFinishInterview] Interview not complete, showing confirmation dialog"
      );
      const confirmed = window.confirm(
        "Your interview is not complete yet. Do you want to end it now? Your progress will be saved, but the interview will be marked as incomplete."
      );
      if (!confirmed) {
        console.log("[handleFinishInterview] User cancelled ending interview");
        return; // User cancelled
      }
      console.log(
        "[handleFinishInterview] User confirmed ending incomplete interview"
      );
    } else {
      console.log(
        "[handleFinishInterview] Interview is complete, proceeding without confirmation"
      );
    }

    setIsProcessing(true);

    try {
      await processInterviewCompletion(
        interviewId,
        finalTranscripts,
        isComplete
      );

      // Show success message based on completion status
      if (isComplete) {
        toast.success(
          "🎉 You have completed the mock interview session! Great job!",
          {
            duration: 5000,
          }
        );
      } else {
        toast.info("Interview ended. Your progress has been saved.", {
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Error processing interview:", error);
      toast.error("Failed to save interview progress. Please try again.");
      setIsProcessing(false);
      return;
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    router.push("/home");
    setIsProcessing(false);
  }, [
    isListening,
    transcript,
    currentQuestionIndex,
    questions,
    completedTranscripts,
    interviewId,
    stopListening,
    router,
  ]);

  // Handle starting the interview
  const handleStartInterview = useCallback(async () => {
    const nextIndex = 0;
    setCurrentQuestionIndex(nextIndex);
    const questionText = questions[nextIndex]?.questionText || "";
    setAgentTranscript(formatQuestionText(nextIndex, questionText));
    playAgentAudio(questionText);
  }, [questions, formatQuestionText, playAgentAudio]);

  // Handle moving to next question
  const handleNextQuestion = useCallback(async () => {
    // Save current transcript if listening
    if (isListening) {
      await stopListening();
      const currentQuestionId = questions[currentQuestionIndex]?.id;
      if (currentQuestionId && transcript) {
        setCompletedTranscripts((prev) => ({
          ...prev,
          [currentQuestionId]: transcript,
        }));
      }
    }

    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      const questionText = questions[nextIndex]?.questionText || "";
      setAgentTranscript(formatQuestionText(nextIndex, questionText));
      playAgentAudio(questionText);
    } else {
      setAgentTranscript(
        "Thank you for completing the interview! Please wait while we process your results."
      );
      await handleFinishInterview();
    }
  }, [
    isListening,
    transcript,
    currentQuestionIndex,
    questions,
    stopListening,
    formatQuestionText,
    playAgentAudio,
    handleFinishInterview,
  ]);

  // Toggle listening state
  const toggleListening = useCallback(async () => {
    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    // State
    currentQuestionIndex,
    agentTranscript,
    isListening,
    transcript,
    isProcessing,
    isAgentSpeaking,
    completedTranscripts,

    // Actions
    handleStartInterview,
    handleNextQuestion,
    handleFinishInterview,
    toggleListening,
  };
}
