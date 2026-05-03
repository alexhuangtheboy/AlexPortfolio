import type { IncomingMessage, ServerResponse } from "node:http";
import { desc, eq } from "drizzle-orm";
import { salaryPredictions } from "../drizzle/schema";
import { getDb } from "../server/db";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  try {
    const url = new URL(req.url ?? "", "http://localhost");
    const visitorToken = url.searchParams.get("visitorToken");

    if (!visitorToken) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "visitorToken is required" }));
      return;
    }

    const db = getDb();
    if (!db) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify([]));
      return;
    }

    const records = await db
      .select()
      .from(salaryPredictions)
      .where(eq(salaryPredictions.visitorToken, visitorToken))
      .orderBy(desc(salaryPredictions.createdAt))
      .limit(8);

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(records));
  } catch (error) {
    console.error("Prediction history API error:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
}
