@echo off
REM Test script for healthcare API endpoints (Windows)
REM This tests the local server to ensure all endpoints work correctly

echo 🔍 Testing Healthcare API Endpoints
echo ==================================
echo.

set BASE_URL=http://localhost:3000

REM Test 1: Filter Options
echo 1. Testing /api/healthcare/filter-options
curl -s "%BASE_URL%/api/healthcare/filter-options" > temp_response.json
findstr "hospitals" temp_response.json >nul
if %errorlevel% equ 0 (
    echo ✅ PASS: Filter options endpoint working
) else (
    echo ❌ FAIL: Filter options endpoint not working
)
echo.

REM Test 2: KPIs
echo 2. Testing /api/healthcare/kpis
curl -s "%BASE_URL%/api/healthcare/kpis" > temp_response.json
findstr "patientVolume" temp_response.json >nul
if %errorlevel% equ 0 (
    echo ✅ PASS: KPIs endpoint working
) else (
    echo ❌ FAIL: KPIs endpoint not working
)
echo.

REM Test 3: Patient Billing Trend
echo 3. Testing /api/healthcare/patient-billing-trend
curl -s "%BASE_URL%/api/healthcare/patient-billing-trend?granularity=monthly" > temp_response.json
findstr "label" temp_response.json >nul
if %errorlevel% equ 0 (
    echo ✅ PASS: Patient billing trend endpoint working
) else (
    echo ❌ FAIL: Patient billing trend endpoint not working
)
echo.

del temp_response.json

echo ==================================
echo ✅ All API tests completed!
echo.
echo 🌐 Open your browser to test the UI:
echo    http://localhost:3000/dashboard
echo.
pause