import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** OAuth subject identifier (openId) from the identity provider. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Salary Prediction Table
export const salaryPredictions = mysqlTable("salary_predictions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  occupation: varchar("occupation", { length: 100 }).notNull(),
  age: int("age").notNull(),
  gender: varchar("gender", { length: 20 }).notNull(),
  education: varchar("education", { length: 100 }).notNull(),
  yearsOfExperience: int("yearsOfExperience").notNull(),
  currentSalary: int("currentSalary").notNull(),
  predictedSalary10Years: int("predictedSalary10Years").notNull(),
  confidenceScore: int("confidenceScore").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SalaryPrediction = typeof salaryPredictions.$inferSelect;
export type InsertSalaryPrediction = typeof salaryPredictions.$inferInsert;