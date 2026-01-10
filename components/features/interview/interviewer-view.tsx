/**
 * Interviewer View Component (Presentational)
 * Displays the AI interviewer's avatar and status
 */

import { Avatar, AvatarFallback } from "@/components/ui";
import { clsx } from "clsx";
import { MicIcon } from "@/components/ui/icons";

interface InterviewerViewProps {
  isSpeaking: boolean;
  transcript: string;
}

export function InterviewerView({
  isSpeaking,
  transcript,
}: InterviewerViewProps) {
  return (
    <div className="flex-1 relative bg-neutral-800/50 rounded-2xl overflow-hidden border border-neutral-700/50 shadow-2xl">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
        <div
          className={clsx(
            "w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all duration-300",
            isSpeaking
              ? "bg-blue-500/20 ring-4 ring-blue-500/40 scale-110"
              : "bg-neutral-700"
          )}>
          <Avatar className="w-28 h-28 border-4 border-neutral-800">
            <AvatarFallback className="text-4xl bg-blue-600 text-white">
              AI
            </AvatarFallback>
          </Avatar>
        </div>

        <h3 className="text-xl font-semibold mb-2">Interviewer</h3>
        <div className="max-w-md">
          {isSpeaking ? (
            <div className="flex items-center justify-center gap-1 h-6">
              <span className="w-1 h-3 bg-blue-400 animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1 h-5 bg-blue-400 animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1 h-3 bg-blue-400 animate-bounce"></span>
            </div>
          ) : (
            <p className="text-neutral-400 text-sm line-clamp-3">{transcript}</p>
          )}
        </div>
      </div>
      <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
        <MicIcon size={16} />
        AI Interviewer
      </div>
    </div>
  );
}
