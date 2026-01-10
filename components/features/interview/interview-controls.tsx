/**
 * Interview Controls Component (Container)
 * Handles interview control actions
 */

import { Button } from "@/components/ui";
import { clsx } from "clsx";
import {
  MicIcon,
  MicOffIcon,
  PlayIcon,
  SkipForwardIcon,
  PhoneOffIcon,
} from "@/components/ui/icons";

interface InterviewControlsProps {
  currentQuestionIndex: number;
  isListening: boolean;
  isAgentSpeaking: boolean;
  isProcessing: boolean;
  onStartInterview: () => void;
  onToggleListening: () => void;
  onNextQuestion: () => void;
  onFinishInterview: () => void;
}

export function InterviewControls({
  currentQuestionIndex,
  isListening,
  isAgentSpeaking,
  isProcessing,
  onStartInterview,
  onToggleListening,
  onNextQuestion,
  onFinishInterview,
}: InterviewControlsProps) {
  // Start interview button
  if (currentQuestionIndex === -1) {
    return (
      <footer className="min-h-[88px] sm:h-24 bg-neutral-900 border-t border-neutral-800 flex items-center justify-center gap-6 px-4 py-3 sm:py-0">
        <Button
          size="lg"
          className="min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 sm:px-8 py-3 sm:py-6 text-base sm:text-lg shadow-lg shadow-blue-900/20"
          onClick={onStartInterview}
          disabled={isProcessing}>
          <PlayIcon size={20} className="sm:w-6 sm:h-6" />
          Start Interview
        </Button>
      </footer>
    );
  }

  // Active interview controls
  return (
    <footer className="min-h-[88px] sm:h-24 bg-neutral-900 border-t border-neutral-800 flex items-center justify-center gap-3 sm:gap-6 px-4 py-3 sm:py-0">
      <Button
        variant={isListening ? "destructive" : "secondary"}
        size="icon"
        className={clsx(
          "min-w-[44px] min-h-[44px] w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-300",
          isListening
            ? "bg-red-500 hover:bg-red-600"
            : "bg-neutral-700 hover:bg-neutral-600"
        )}
        onClick={onToggleListening}
        disabled={isProcessing}
        title={isListening ? "Stop Speaking" : "Start Speaking"}
        aria-label={isListening ? "Stop Speaking" : "Start Speaking"}>
        {isListening ? <MicOffIcon size={20} /> : <MicIcon size={20} />}
      </Button>

      <Button
        variant="secondary"
        size="lg"
        className="min-h-[44px] bg-neutral-700 hover:bg-neutral-600 text-white rounded-full px-4 sm:px-6 py-3 sm:py-6 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onNextQuestion}
        disabled={isAgentSpeaking || isProcessing}>
        <SkipForwardIcon size={18} className="sm:w-5 sm:h-5" /> 
        <span className="hidden sm:inline">Next Question</span>
        <span className="sm:hidden">Next</span>
      </Button>

      <Button
        variant="destructive"
        size="lg"
        className="min-h-[44px] bg-red-600 hover:bg-red-700 text-white rounded-full px-4 sm:px-6 py-3 sm:py-6 text-sm sm:text-base"
        onClick={onFinishInterview}
        disabled={isProcessing}>
        <PhoneOffIcon size={18} className="sm:w-5 sm:h-5" /> 
        <span className="hidden sm:inline">End Interview</span>
        <span className="sm:hidden">End</span>
      </Button>
    </footer>
  );
}
