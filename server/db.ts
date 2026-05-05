import { drizzle } from "drizzle-orm/mysql2";

let dbInstance: ReturnType<typeof drizzle> | null = null;
let dbInitError: Error | null = null;

export function getDb() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    return null;
  }

  // Return existing instance or error
  if (dbInitError) {
    console.error("Database initialization failed:", dbInitError);
    return null;
  }

  if (!dbInstance) {
    try {
      dbInstance = drizzle(connectionString);
    } catch (error) {
      dbInitError = error as Error;
      console.error("Failed to initialize database:", error);
      return null;
    }
  }

  return dbInstance;
}
