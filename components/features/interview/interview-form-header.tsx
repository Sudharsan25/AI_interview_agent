/**
 * Interview Form Header Component (Presentational)
 * Displays form header information
 */

export function InterviewFormHeader() {
  return (
    <div className="text-center space-y-2">
      <h2 className="text-3xl font-bold text-white tracking-tight">
        Create New Interview
      </h2>
      <p className="text-neutral-400 max-w-md mx-auto">
        Configure your AI interview session. Provide the details below to
        generate a tailored experience.
      </p>
    </div>
  );
}
