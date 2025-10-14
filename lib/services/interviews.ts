import { db } from "@/drizzle/db";
import { interviews } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

// Type for creating a new interview (you can customize this)
type NewInterview = typeof interviews.$inferInsert;

// --- READ OPERATIONS ---

/**
 * Fetches all interviews for a specific user.
 * @param userId - The ID of the user.
 * @returns A promise that resolves to an array of interviews.
 */
export async function getInterviewsByUserId(userId: string) {
  return await db
    .select()
    .from(interviews)
    .where(eq(interviews.userId, userId));
}

export async function getUpcomingInterviewsByUserId(userId: string) {
  return await db
    .select()
    .from(interviews)
    .where(
      // 2. Use the 'and' operator to combine multiple conditions
      and(
        eq(interviews.userId, userId), // Condition 1: Match the user ID
        eq(interviews.completed, false) // Condition 2: Match completion status
      )
    );
}
/**
 * Fetches a single interview by its unique ID.
 * @param id - The ID of the interview.
 * @returns A promise that resolves to the interview object or undefined if not found.
 */
export async function getInterviewById(id: string) {
  const result = await db
    .select()
    .from(interviews)
    .where(eq(interviews.id, id));
  return result[0]; // .where() returns an array, so we take the first element
}

// --- CREATE OPERATION ---

/**
 * Creates a new interview record in the database.
 * @param data - The data for the new interview.
 * @returns A promise that resolves to the newly created interview.
 */
export async function createInterview(data: NewInterview) {
  const result = await db.insert(interviews).values(data).returning();
  return result[0];
}

// --- UPDATE OPERATION ---

/**
 * Updates an existing interview record.
 * @param id - The ID of the interview to update.
 * @param data - The data to update.
 * @returns A promise that resolves to the updated interview.
 */
export async function updateInterview(id: string, data: Partial<NewInterview>) {
  const result = await db
    .update(interviews)
    .set(data)
    .where(eq(interviews.id, id))
    .returning();
  return result[0];
}

// --- DELETE OPERATION ---

/**
 * Deletes an interview record by its ID.
 * @param id - The ID of the interview to delete.
 * @returns A promise that resolves to the deleted interview.
 */
export async function deleteInterview(id: string) {
  const result = await db
    .delete(interviews)
    .where(eq(interviews.id, id))
    .returning();
  return result[0];
}
