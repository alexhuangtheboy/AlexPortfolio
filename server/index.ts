import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import {
  getFilterOptions,
  getKpiData,
  getPatientBillingTrend,
} from "./healthcareApi.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Healthcare API Routes
  app.get("/api/healthcare/filter-options", (_req, res) => {
    try {
      const options = getFilterOptions();
      res.json(options);
    } catch (error) {
      console.error("Error fetching filter options:", error);
      res.status(500).json({ error: "Failed to load filter options" });
    }
  });

  app.get("/api/healthcare/kpis", (req, res) => {
    try {
      const kpiData = getKpiData(req.query);
      res.json(kpiData);
    } catch (error) {
      console.error("Error fetching KPI data:", error);
      res.status(500).json({ error: "Failed to load KPI data" });
    }
  });

  app.get("/api/healthcare/patient-billing-trend", (req, res) => {
    try {
      const trendData = getPatientBillingTrend(req.query);
      res.json(trendData);
    } catch (error) {
      console.error("Error fetching trend data:", error);
      res.status(500).json({ error: "Failed to load trend data" });
    }
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
