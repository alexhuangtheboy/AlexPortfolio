import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { extname, join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the healthcare API handler
let healthcareHandler = null;
try {
  const healthcareModule = await import('./api/healthcare.js');
  healthcareHandler = healthcareModule.default;
  console.log('✓ Healthcare API handler loaded');
} catch (error) {
  console.error('✗ Failed to load healthcare API handler:', error.message);
}

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = resolve(__dirname, 'dist/public');

// MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

function getMimeType(filePath) {
  const ext = extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

// Mock request/response objects similar to Vercel
function createMockRequest(req) {
  return {
    method: req.method,
    url: req.url,
    headers: req.headers,
    // Add any other properties your handler might need
  };
}

function createMockResponse(res) {
  const headers = {};
  let statusCode = 200;
  let body = null;

  return {
    setHeader(name, value) {
      headers[name] = value;
      return this;
    },
    getHeader(name) {
      return headers[name];
    },
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      body = JSON.stringify(data);
      headers['Content-Type'] = 'application/json';
      this.send(body);
    },
    send(data) {
      body = data;
      if (!headers['Content-Type']) {
        headers['Content-Type'] = 'text/plain';
      }
      this.end();
    },
    end() {
      // Write headers
      Object.entries(headers).forEach(([name, value]) => {
        res.setHeader(name, value);
      });
      res.writeHead(statusCode);
      res.end(body);
    },
  };
}

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  console.log(`${req.method} ${pathname}`);

  // Handle API routes
  if (pathname.startsWith('/api/healthcare/')) {
    if (healthcareHandler) {
      const mockReq = createMockRequest(req);
      const mockRes = createMockResponse(res);
      healthcareHandler(mockReq, mockRes);
    } else {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Healthcare API handler not loaded' }));
    }
    return;
  }

  // Handle other API routes (tRPC, etc.)
  if (pathname.startsWith('/api/')) {
    res.writeHead(501, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'API endpoint not implemented in local test' }));
    return;
  }

  // Handle static files
  let filePath = join(PUBLIC_DIR, pathname);

  // If it's a directory, try to serve index.html
  if (filePath.endsWith('/') || !extname(filePath)) {
    filePath = join(filePath, 'index.html');
  }

  // Check if file exists
  if (existsSync(filePath)) {
    try {
      const content = readFileSync(filePath);
      const mimeType = getMimeType(filePath);
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(content);
      return;
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
    }
  }

  // For client-side routing, serve index.html for all non-API routes
  const indexPath = join(PUBLIC_DIR, 'index.html');
  if (existsSync(indexPath)) {
    try {
      const content = readFileSync(indexPath);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
      return;
    } catch (error) {
      console.error('Error reading index.html:', error);
    }
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('<h1>404 Not Found</h1>');
});

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Local Test Server Running                           ║
║                                                           ║
║   📍 URL: http://localhost:${PORT}                        ║
║                                                           ║
║   📊 Test Healthcare Dashboard:                           ║
║      http://localhost:${PORT}/dashboard                    ║
║                                                           ║
║   🔍 Test API Endpoints:                                  ║
║      http://localhost:${PORT}/api/healthcare/filter-options
║      http://localhost:${PORT}/api/healthcare/kpis         ║
║      http://localhost:${PORT}/api/healthcare/patient-billing-trend
║                                                           ║
║   Press Ctrl+C to stop                                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});