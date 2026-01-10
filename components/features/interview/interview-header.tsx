/**
 * Interview Header Component (Presentational)
 * Displays interview session header information
 */

interface InterviewHeaderProps {
  role: string;
  currentQuestionIndex: number;
  totalQuestions: number;
}

export function InterviewHeader({
  role,
  currentQuestionIndex,
  totalQuestions,
}: InterviewHeaderProps) {
  const statusText =
    currentQuestionIndex === -1
      ? "Ready to Start"
      : `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm z-10">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
        <span className="font-medium text-sm text-neutral-200">
          Live Interview
        </span>
      </div>
      <span className="font-medium text-sm text-neutral-200">
        Interview for {role}
      </span>
      <div className="text-sm text-neutral-400">{statusText}</div>
    </header>
  );
}
