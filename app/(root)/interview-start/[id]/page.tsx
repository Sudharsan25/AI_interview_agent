import InterviewClient from "@/components/InterviewClient";
import { getInterviewData } from "@/server/questions";

const InterviewSession = async ({ params }: { params: { id: string } }) => {
  const interviewSessionParams = await params;
  const interviewId = interviewSessionParams.id as string;

  const interviewData = await getInterviewData(interviewId);

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center pt-12 pb-8">
          <span className="text-lg text-white font-bold">
            Interview for {interviewData.details.role} Role
          </span>
        </div>
        <InterviewClient initialData={interviewData} />
      </div>
    </>
  );
};

export default InterviewSession;
