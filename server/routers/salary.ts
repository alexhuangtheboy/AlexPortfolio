import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { salaryPredictions, type InsertSalaryPrediction } from "../../drizzle/schema";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";

interface PredictionInput {
  occupation: string;
  age: number;
  gender: string;
  education: string;
  yearsOfExperience: number;
  currentSalary: number;
}

interface PredictionResult {
  predictedSalary10Years: number;
  confidenceScore: number;
  salaryGrowth: number;
  growthPercentage: number;
  modelType: string;
  modelR2: number;
  averageError: number;
}

function predictSalary(input: PredictionInput): PredictionResult {
  const baseGrowthRate = 0.0934;

  const occupationMultipliers: Record<string, number> = {
    "Software Engineer": 1.15,
    "Data Scientist": 1.12,
    "Data Engineer": 1.14,
    "DevOps Engineer": 1.13,
    "Product Manager": 1.08,
    Designer: 0.95,
    "Business Analyst": 1.05,
    "Project Manager": 1.06,
    Consultant: 1.1,
    Other: 1,
  };

  const educationMultipliers: Record<string, number> = {
    "High School": 0.85,
    Bachelor: 1,
    Master: 1.2,
    PhD: 1.35,
  };

  const genderMultipliers: Record<string, number> = {
    Male: 1,
    Female: 1.02,
    Other: 1,
  };

  let experienceBonus = Math.min(input.yearsOfExperience * 0.02, 0.4);
  if (input.yearsOfExperience > 20) {
    experienceBonus = 0.4 + (input.yearsOfExperience - 20) * 0.005;
  }

  let ageAdjustment = 1;
  if (input.age < 30) {
    ageAdjustment = 1.1;
  } else if (input.age > 50) {
    ageAdjustment = 0.95;
  }

  const occupationMult = occupationMultipliers[input.occupation] ?? 1;
  const educationMult = educationMultipliers[input.education] ?? 1;
  const genderMult = genderMultipliers[input.gender] ?? 1;

  const annualGrowthRate =
    baseGrowthRate *
    occupationMult *
    educationMult *
    genderMult *
    (1 + experienceBonus) *
    ageAdjustment;

  const predictedSalary10Years = Math.round(
    input.currentSalary * Math.pow(1 + annualGrowthRate, 10)
  );

  let confidenceScore = 70;
  if (input.yearsOfExperience >= 2) confidenceScore += 10;
  if (input.education === "Master" || input.education === "PhD") confidenceScore += 5;
  if (input.currentSalary >= 30000) confidenceScore += 5;
  if (input.yearsOfExperience > 30) confidenceScore -= 10;

  confidenceScore = Math.max(55, Math.min(92, confidenceScore));

  const salaryGrowth = predictedSalary10Years - input.currentSalary;
  const growthPercentage =
    input.currentSalary > 0 ? (salaryGrowth / input.currentSalary) * 100 : 0;

  return {
    predictedSalary10Years,
    confidenceScore,
    salaryGrowth,
    growthPercentage,
    modelType: "TypeScript heuristic model",
    modelR2: 0,
    averageError: 0,
  };
}

export const salaryRouter = router({
  predict: publicProcedure
    .input(
      z.object({
        visitorToken: z.string().min(1).max(64),
        occupation: z.string().min(1),
        age: z.number().min(0),
        gender: z.string().min(1),
        education: z.string().min(1),
        yearsOfExperience: z.number().min(0),
        currentSalary: z.number().min(0),
      })
    )
    .mutation(async ({ input }) => {
      const prediction = predictSalary(input);
      const db = getDb();

      if (db) {
        try {
          const record: InsertSalaryPrediction = {
            visitorToken: input.visitorToken,
            userId: null,
            occupation: input.occupation,
            age: input.age,
            gender: input.gender,
            education: input.education,
            yearsOfExperience: input.yearsOfExperience,
            currentSalary: input.currentSalary,
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

      return prediction;
    }),

  history: publicProcedure
    .input(
      z.object({
        visitorToken: z.string().min(1).max(64),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      if (!db) {
        return [];
      }

      try {
        return await db
          .select()
          .from(salaryPredictions)
          .where(eq(salaryPredictions.visitorToken, input.visitorToken))
          .orderBy(desc(salaryPredictions.createdAt))
          .limit(8);
      } catch (error) {
        console.error("Failed to fetch prediction history:", error);
        return [];
      }
    }),
});
