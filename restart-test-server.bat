@echo off
echo Stopping any existing Node.js servers...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo Starting new test server on port 3001...
set PORT=3001
node local-test-server.js
pause