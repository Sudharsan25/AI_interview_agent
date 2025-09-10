"use client";

import { useParams } from "next/navigation";

const InterviewSession = () => {
    const params = useParams();
    const interviewId = params.id as string;


    return (
        <>
      <div className='flex flex-col gap-4 items-center'>
        Interview Details, ID: {interviewId}
      </div>
        
    </>
    );
};

export default InterviewSession;
