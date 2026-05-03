// Simple API handler that doesn't require Express
import { getFilterOptions, getKpiData, getPatientBillingTrend } from '../dist/server/healthcareApi.js';

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  try {
    // Route to appropriate handler
    if (pathname === '/api/healthcare/filter-options') {
      const options = getFilterOptions();
      return res.status(200).json(options);
    }

    if (pathname === '/api/healthcare/kpis') {
      const filters = Object.fromEntries(url.searchParams.entries());
      const kpiData = getKpiData(filters);
      return res.status(200).json(kpiData);
    }

    if (pathname === '/api/healthcare/patient-billing-trend') {
      const filters = Object.fromEntries(url.searchParams.entries());
      const trendData = getPatientBillingTrend(filters);
      return res.status(200).json(trendData);
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}