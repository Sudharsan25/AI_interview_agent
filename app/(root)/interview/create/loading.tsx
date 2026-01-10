/**
 * Loading state for interview create page
 */

import { ContentWrapper } from "@/components/layouts";

export default function InterviewCreateLoading() {
  return (
    <ContentWrapper>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-neutral-400 text-lg">Loading form...</p>
      </div>
    </ContentWrapper>
  );
}
