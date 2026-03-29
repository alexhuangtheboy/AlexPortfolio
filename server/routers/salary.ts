import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { InsertSalaryPrediction, salaryPredictions } from "../../drizzle/schema";
import { getDb } from "../db";

/**
 * Salary Prediction ML Model
 * Predicts 10-year salary based on occupation, age, gender, education, experience, and current salary
 */

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
}

/**
 * Simple ML model for salary prediction
 * Based on industry benchmarks and growth factors
 */
function predictSalary(input: PredictionInput): PredictionResult {
  let baseGrowthRate = 0.03; // 3% annual growth baseline
  let confidenceScore = 70;

  // Occupation-based growth multiplier
  const occupationMultipliers: Record<string, number> = {
    "Software Engineer": 1.15,
    "Data Scientist": 1.12,
    "Data Engineer": 1.14,
    "DevOps Engineer": 1.13,
    "Product Manager": 1.08,
    "Designer": 0.95,
    "Business Analyst": 1.05,
    "Project Manager": 1.06,
    "Consultant": 1.10,
    "Other": 1.0,
  };

  // Education multiplier
  const educationMultipliers: Record<string, number> = {
    "High School": 0.85,
    "Bachelor": 1.0,
    "Master": 1.2,
    "PhD": 1.35,
  };

  // Gender adjustment (accounting for wage gap - normalized)
  const genderMultiplier: Record<string, number> = {
    "Male": 1.0,
    "Female": 1.02,
    "Other": 1.0,
  };

  // Experience bonus (diminishing returns after 20 years)
  let experienceBonus = Math.min(input.yearsOfExperience * 0.02, 0.4);
  if (input.yearsOfExperience > 20) {
    experienceBonus = 0.4 + (input.yearsOfExperience - 20) * 0.005;
  }

  // Age adjustment (younger professionals have more growth potential)
  let ageAdjustment = 1.0;
  if (input.age < 30) {
    ageAdjustment = 1.1;
  } else if (input.age > 50) {
    ageAdjustment = 0.95;
  }

  // Calculate combined growth rate
  const occupationMult = occupationMultipliers[input.occupation] || 1.0;
  const educationMult = educationMultipliers[input.education] || 1.0;
  const genderMult = genderMultiplier[input.gender] || 1.0;

  const combinedGrowthRate =
    baseGrowthRate *
    occupationMult *
    educationMult *
    genderMult *
    (1 + experienceBonus) *
    ageAdjustment;

  // Calculate 10-year projection (compound growth)
  const predictedSalary10Years = Math.round(
    input.currentSalary * Math.pow(1 + combinedGrowthRate, 10)
  );

  // Adjust confidence based on input factors
  if (input.yearsOfExperience < 2) {
    confidenceScore -= 15; // Less data for early-career professionals
  }
  if (input.yearsOfExperience > 30) {
    confidenceScore -= 10; // Harder to predict for late-career
  }
  if (input.education === "PhD") {
    confidenceScore += 5; // Higher confidence for advanced degrees
  }

  // Ensure confidence score is between 50-95
  confidenceScore = Math.max(50, Math.min(95, confidenceScore));

  const salaryGrowth = predictedSalary10Years - input.currentSalary;
  const growthPercentage = (salaryGrowth / input.currentSalary) * 100;

  return {
    predictedSalary10Years,
    confidenceScore,
    salaryGrowth,
    growthPercentage,
  };
}

export const salaryRouter = router({
  predict: publicProcedure
    .input(
      z.object({
        occupation: z.string().min(1),
        age: z.number().min(18).max(80),
        gender: z.string().min(1),
        education: z.string().min(1),
        yearsOfExperience: z.number().min(0).max(60),
        currentSalary: z.number().min(0),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Get prediction from ML model
      const prediction = predictSalary(input);

      // If user is authenticated, save to database
      if (ctx.user) {
        const db = await getDb();
        if (db) {
          try {
            const record: InsertSalaryPrediction = {
              userId: ctx.user.id,
              occupation: input.occupation,
              age: input.age,
              gender: input.gender,
              education: input.education,
              yearsOfExperience: input.yearsOfExperience,
              currentSalary: input.currentSalary,
              predictedSalary10Years: prediction.predictedSalary10Years,
              confidenceScore: prediction.confidenceScore,
            };
            await db.insert(salaryPredictions).values(record);
          } catch (error) {
            console.error("Failed to save prediction:", error);
            // Continue anyway - prediction is still valid
          }
        }
      }

      return prediction;
    }),

  // Get user's prediction history
  history: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      return [];
    }

    const db = await getDb();
    if (!db) {
      return [];
    }

    try {
      const { eq } = await import("drizzle-orm");
      const records = await db
        .select()
        .from(salaryPredictions)
        .where(eq(salaryPredictions.userId, ctx.user.id))
        .orderBy((t) => t.createdAt);
      return records;
    } catch (error) {
      console.error("Failed to fetch prediction history:", error);
      return [];
    }
  }),
});
