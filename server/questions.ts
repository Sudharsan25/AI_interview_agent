import { db } from '@/drizzle/db';
import { questions, interviews } from '@/drizzle/schema';
import { InterviewClientProps } from '@/types';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
// Helper function to fetch the data

// Define a type alias for the return value to keep the function signature clean
type InterviewData = InterviewClientProps['initialData'];

export async function getInterviewData(interviewId: string): Promise<InterviewData> {
  // Fetch the main interview details
  const interviewDetails = await db.select()
    .from(interviews)
    .where(eq(interviews.id, interviewId));

  // If no interview is found, trigger a 404 page
  if (interviewDetails.length === 0) {
    notFound();
  }

  // Fetch the associated questions
  const interviewQuestions = await db.select()
    .from(questions)
    .where(eq(questions.interviewId, interviewId));

  return {
    details: interviewDetails[0],
    questions: interviewQuestions,
  };
}