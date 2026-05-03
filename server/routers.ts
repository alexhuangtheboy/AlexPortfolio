import { systemRouter } from "./_core/systemRouter";
import { router } from "./_core/trpc";
import { salaryRouter } from "./routers/salary";

export const appRouter = router({
  system: systemRouter,
  salary: salaryRouter,
});

export type AppRouter = typeof appRouter;
