/**
 * User View Component (Presentational)
 * Displays the user's avatar and speaking status
 */

import { Avatar, AvatarFallback } from "@/components/ui";
import { clsx } from "clsx";
import { MicIcon, MicOffIcon } from "@/components/ui/icons";

interface UserViewProps {
  userName: string;
  isListening: boolean;
  transcript: string;
}

export function UserView({ userName, isListening, transcript }: UserViewProps) {
  return (
    <div className="flex-1 relative bg-neutral-800/50 rounded-2xl overflow-hidden border border-neutral-700/50 shadow-2xl">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
        <div
          className={clsx(
            "w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all duration-300",
            isListening
              ? "bg-green-500/20 ring-4 ring-green-500/40 scale-110"
              : "bg-neutral-700"
          )}>
          <Avatar className="w-28 h-28 border-4 border-neutral-800">
            <AvatarFallback className="text-4xl bg-green-600 text-white">
              ME
            </AvatarFallback>
          </Avatar>
        </div>

        <h3 className="text-xl font-semibold mb-2">{userName}</h3>
        <div className="max-w-md min-h-[3rem]">
          {isListening ? (
            <p className="text-green-400 text-lg font-medium animate-pulse">
              Listening...
            </p>
          ) : (
            <p className="text-neutral-500 text-sm">Microphone is off</p>
          )}
          {transcript && isListening && (
            <p className="text-neutral-300 text-sm mt-2 line-clamp-2">
              "{transcript}"
            </p>
          )}
        </div>
      </div>
      <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
        {isListening ? <MicIcon size={16} /> : <MicOffIcon size={16} />} You
      </div>
    </div>
  );
}
