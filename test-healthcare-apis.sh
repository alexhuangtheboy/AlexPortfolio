#!/bin/bash

# Test script for healthcare API endpoints
# This tests the local server to ensure all endpoints work correctly

echo "🔍 Testing Healthcare API Endpoints"
echo "=================================="
echo ""

BASE_URL="http://localhost:3000"

# Test 1: Filter Options
echo "1. Testing /api/healthcare/filter-options"
RESPONSE=$(curl -s "$BASE_URL/api/healthcare/filter-options")
if echo "$RESPONSE" | grep -q "hospitals"; then
    echo "✅ PASS: Filter options endpoint working"
    echo "   Found $(echo "$RESPONSE" | grep -o '"hospitals":\[' | wc -l) hospitals"
else
    echo "❌ FAIL: Filter options endpoint not working"
fi
echo ""

# Test 2: KPIs
echo "2. Testing /api/healthcare/kpis"
RESPONSE=$(curl -s "$BASE_URL/api/healthcare/kpis")
if echo "$RESPONSE" | grep -q "patientVolume"; then
    echo "✅ PASS: KPIs endpoint working"
    PATIENT_VOLUME=$(echo "$RESPONSE" | grep -o '"patientVolume":[0-9]*' | cut -d':' -f2)
    echo "   Patient Volume: $PATIENT_VOLUME"
else
    echo "❌ FAIL: KPIs endpoint not working"
fi
echo ""

# Test 3: Patient Billing Trend
echo "3. Testing /api/healthcare/patient-billing-trend"
RESPONSE=$(curl -s "$BASE_URL/api/healthcare/patient-billing-trend?granularity=monthly")
if echo "$RESPONSE" | grep -q "label"; then
    echo "✅ PASS: Patient billing trend endpoint working"
    DATA_POINTS=$(echo "$RESPONSE" | grep -o '"label"' | wc -l)
    echo "   Data points returned: $DATA_POINTS"
else
    echo "❌ FAIL: Patient billing trend endpoint not working"
fi
echo ""

echo "=================================="
echo "✅ All API tests completed!"
echo ""
echo "🌐 Open your browser to test the UI:"
echo "   http://localhost:3000/dashboard"
echo ""