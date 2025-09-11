import InterviewClient from "@/components/InterviewClient";
import { getInterviewData } from "@/server/questions";

const InterviewSession = async ({ params }: { params: { id: string } }) => {
    const interviewId = await params.id as string;

    const interviewData = await getInterviewData(interviewId);

    return (
        <>
      <div className='flex flex-col gap-4 items-center'>
        <InterviewClient initialData={interviewData} />
      </div>
        
    </>
    );
};

export default InterviewSession;
