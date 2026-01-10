import { ContentWrapper } from "@/components/layouts";
import { InterviewFormContainer } from "@/components/features/interview";

/**
 * Interview Create Page (Server Component)
 * Renders the interview creation form
 */
export default async function InterviewCreatePage() {
  return (
    <ContentWrapper>
      <div className="flex flex-col gap-4 items-center">
        <InterviewFormContainer />
      </div>
    </ContentWrapper>
  );
}