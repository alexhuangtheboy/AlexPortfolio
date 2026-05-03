import { createServer } from 'http';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getFilterOptions,
  getKpiData,
  getPatientBillingTrend,
} from '../server/healthcareApi.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Serve static files from dist/public
const staticPath = path.resolve(__dirname, '..', 'dist', 'public');
app.use(express.static(staticPath));

// Healthcare API Routes
app.get('/api/healthcare/filter-options', (_req, res) => {
  try {
    const options = getFilterOptions();
    res.json(options);
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({ error: 'Failed to load filter options' });
  }
});

app.get('/api/healthcare/kpis', (req, res) => {
  try {
    const kpiData = getKpiData(req.query);
    res.json(kpiData);
  } catch (error) {
    console.error('Error fetching KPI data:', error);
    res.status(500).json({ error: 'Failed to load KPI data' });
  }
});

app.get('/api/healthcare/patient-billing-trend', (req, res) => {
  try {
    const trendData = getPatientBillingTrend(req.query);
    res.json(trendData);
  } catch (error) {
    console.error('Error fetching trend data:', error);
    res.status(500).json({ error: 'Failed to load trend data' });
  }
});

// Handle client-side routing - serve index.html for all routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// Create server
const server = createServer(app);

// Vercel serverless function handler
export default function handler(req: any, res: any) {
  server.emit('request', req, res);
}