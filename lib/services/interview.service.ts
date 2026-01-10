import { db } from "@/drizzle/db";
import { interviews, questions } from "@/drizzle/schema";
import { and, eq, desc } from "drizzle-orm";
import type { Interview } from "@/types";

/**
 * Service for interview-related operations
 */

// Type for creating a new interview
type NewInterview = typeof interviews.$inferInsert;

/**
 * Fetches all interviews for a specific user.
 * @param userId - The ID of the user.
 * @returns A promise that resolves to an array of interviews.
 */
export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[]> {
  try {
    const result = await db
      .select()
      .from(interviews)
      .where(eq(interviews.userId, userId))
      .orderBy(desc(interviews.createdAt));
    
    // Debug logging
    console.log("[getInterviewsByUserId] Querying for userId:", userId);
    console.log("[getInterviewsByUserId] Query result count:", result.length);
    if (result.length > 0) {
      console.log("[getInterviewsByUserId] Sample result:", {
        id: result[0]?.id,
        userId: result[0]?.userId,
        role: result[0]?.role,
        createdAt: result[0]?.createdAt,
      });
    } else {
      console.log("[getInterviewsByUserId] No interviews found for userId:", userId);
    }
    
    // Ensure proper serialization - convert Date objects to ISO strings if needed
    return result.map((interview) => ({
      ...interview,
      createdAt: interview.createdAt instanceof Date 
        ? interview.createdAt 
        : new Date(interview.createdAt),
    })) as Interview[];
  } catch (error) {
    console.error("[getInterviewsByUserId] Database error:", error);
    throw error;
  }
}

/**
 * Fetches upcoming/incomplete interviews for a specific user.
 * @param userId - The ID of the user.
 * @returns A promise that resolves to an array of incomplete interviews.
 */
export async function getUpcomingInterviewsByUserId(
  userId: string
): Promise<Interview[]> {
  return await db
    .select()
    .from(interviews)
    .where(
      and(
        eq(interviews.userId, userId),
        eq(interviews.completed, false)
      )
    ) as Promise<Interview[]>;
}

/**
 * Fetches a single interview by its unique ID.
 * @param id - The ID of the interview.
 * @returns A promise that resolves to the interview object or undefined if not found.
 */
export async function getInterviewById(
  id: string
): Promise<Interview | undefined> {
  const result = await db
    .select()
    .from(interviews)
    .where(eq(interviews.id, id));
  return result[0] as Interview | undefined;
}

/**
 * Creates a new interview record in the database.
 * @param data - The data for the new interview.
 * @returns A promise that resolves to the newly created interview.
 */
export async function createInterview(
  data: NewInterview
): Promise<Interview> {
  const result = await db.insert(interviews).values(data).returning();
  return result[0] as Interview;
}

/**
 * Creates questions for an interview.
 * @param interviewId - The ID of the interview.
 * @param questionsData - Array of question texts.
 * @returns A promise that resolves when questions are created.
 */
export async function createQuestions(
  interviewId: string,
  questionsData: string[]
): Promise<void> {
  const questionsToInsert = questionsData.map((questionText) => ({
    questionText: questionText.trim(),
    interviewId: interviewId,
  }));

  if (questionsToInsert.length > 0) {
    await db.insert(questions).values(questionsToInsert);
  }
}

/**
 * Updates an existing interview record.
 * @param id - The ID of the interview to update.
 * @param data - The data to update.
 * @returns A promise that resolves to the updated interview.
 */
export async function updateInterview(
  id: string,
  data: Partial<NewInterview>
): Promise<Interview> {
  const result = await db
    .update(interviews)
    .set(data)
    .where(eq(interviews.id, id))
    .returning();
  return result[0] as Interview;
}

/**
 * Deletes an interview record by its ID.
 * @param id - The ID of the interview to delete.
 * @returns A promise that resolves to the deleted interview.
 */
export async function deleteInterview(id: string): Promise<Interview> {
  const result = await db
    .delete(interviews)
    .where(eq(interviews.id, id))
    .returning();
  return result[0] as Interview;
}
