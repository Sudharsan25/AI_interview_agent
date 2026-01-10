import { db } from "@/drizzle/db";
import { questions, interviews } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Interview, Question } from "@/types";

/**
 * Service for question-related operations
 */

/**
 * Fetches all questions associated with a specific interview ID.
 * @param interviewId The ID of the interview.
 * @returns A promise that resolves to an array of question objects.
 */
export async function getQuestionsByInterviewId(
  interviewId: string
): Promise<Question[]> {
  return await db
    .select()
    .from(questions)
    .where(eq(questions.interviewId, interviewId));
}

/**
 * Fetches interview data including details and questions
 * @param interviewId The ID of the interview
 * @returns Interview data with details and questions
 */
export async function getInterviewData(interviewId: string): Promise<{
  details: Interview;
  questions: Question[];
}> {
  // Fetch the main interview details
  const interviewDetails = await db
    .select()
    .from(interviews)
    .where(eq(interviews.id, interviewId));

  // If no interview is found, trigger a 404 page
  if (interviewDetails.length === 0) {
    notFound();
  }

  // Fetch the associated questions
  const interviewQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.interviewId, interviewId));

  return {
    details: interviewDetails[0] as Interview,
    questions: interviewQuestions as Question[],
  };
}
