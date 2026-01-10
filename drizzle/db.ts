import { getXataClient } from "@/src/xata";
import { drizzle } from "drizzle-orm/xata-http";

/**
 * Database instance - Server-side only
 * This should NEVER be imported in client components
 * Use API routes or server actions to access the database from client code
 */

let dbInstance: ReturnType<typeof drizzle> | null = null;

function initializeDb() {
  // Runtime check to prevent browser usage
  if (typeof window !== "undefined") {
    throw new Error(
      "Database access is not allowed in the browser. Use API routes or server actions instead."
    );
  }

  if (!dbInstance) {
    const xata = getXataClient();
    dbInstance = drizzle(xata);
  }

  return dbInstance;
}

// Lazy initialization - only creates connection when db is actually used
export const db = initializeDb();
