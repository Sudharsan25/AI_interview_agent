import { getInterviewData } from "@/lib/services";
import { notFound } from "next/navigation";
import { InterviewSessionContainer } from "@/components/features/interview";

interface InterviewSessionPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Interview Session Page (Server Component)
 * Fetches interview data and renders the session container
 * The InterviewSessionContainer is a client component, so it will hydrate on the client
 */
export default async function InterviewSessionPage({
  params,
}: InterviewSessionPageProps) {
  const { id: interviewId } = await params;

  try {
    const interviewData = await getInterviewData(interviewId);

    return (
      <div className="flex flex-col items-center">
        <InterviewSessionContainer initialData={interviewData} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
