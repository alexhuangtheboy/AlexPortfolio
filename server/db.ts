import { drizzle } from "drizzle-orm/mysql2";

let dbInstance: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    return null;
  }

  if (!dbInstance) {
    dbInstance = drizzle(connectionString);
  }

  return dbInstance;
}
