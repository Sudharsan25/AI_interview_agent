import { db } from "@/drizzle/db";
import { user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import type { User } from "@/types";

/**
 * Service for user-related operations
 */

/**
 * Gets user by email
 * @param email - User email
 * @returns User or undefined
 */
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const result = await db
    .select()
    .from(user)
    .where(eq(user.email, email));
  return result[0] as User | undefined;
}

/**
 * Gets user by ID
 * @param id - User ID
 * @returns User or undefined
 */
export async function getUserById(id: string): Promise<User | undefined> {
  const result = await db.select().from(user).where(eq(user.id, id));
  return result[0] as User | undefined;
}
