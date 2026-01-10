/**
 * Loading state for interview session page
 */

export default function InterviewSessionLoading() {
  return (
    <div className="flex flex-col h-screen w-full bg-neutral-950 text-white items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-neutral-400 text-lg">Loading interview session...</p>
      </div>
    </div>
  );
}
