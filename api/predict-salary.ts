import type { IncomingMessage, ServerResponse } from "node:http";
import { salaryPredictions, type InsertSalaryPrediction } from "../drizzle/schema";
import { getDb } from "../server/db";
import { predictSalary } from "../server/salaryPredictor";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  try {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    const { visitorToken, occupation, age, gender, education, yearsOfExperience, currentSalary } = body;

    if (!visitorToken || !occupation || !gender || !education) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Missing required fields" }));
      return;
    }

    const prediction = predictSalary({
      occupation,
      age: Number(age),
      gender,
      education,
      yearsOfExperience: Number(yearsOfExperience),
      currentSalary: Number(currentSalary),
    });

    const db = getDb();
    if (db) {
      try {
        const record: InsertSalaryPrediction = {
          visitorToken,
          userId: null,
          occupation,
          age: Number(age),
          gender,
          education,
          yearsOfExperience: Number(yearsOfExperience),
          currentSalary: Number(currentSalary),
          predictedSalary10Years: prediction.predictedSalary10Years,
          confidenceScore: prediction.confidenceScore,
          modelType: prediction.modelType,
          growthPercentage: Math.round(prediction.growthPercentage),
        };
        await db.insert(salaryPredictions).values(record);
      } catch (error) {
        console.error("Failed to save prediction:", error);
      }
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(prediction));
  } catch (error) {
    console.error("Prediction API error:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
}
