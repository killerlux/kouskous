#!/bin/bash
# Endpoint Testing Script
# Tests all API endpoints with curl

set -e

BASE_URL="${BASE_URL:-http://localhost:4000}"
JWT_TOKEN="${JWT_TOKEN:-}"

echo "🔍 Testing Taxi Platform API Endpoints"
echo "======================================"
echo "Base URL: $BASE_URL"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5
    local accept_429=${6:-false}  # Optional: accept 429 as valid (for rate limiting)
    
    echo -n "Testing $method $endpoint... "
    
    # Small delay to avoid rate limiting
    sleep 0.2
    
    if [ -n "$data" ]; then
        if [ -n "$JWT_TOKEN" ]; then
            status=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" \
                "$BASE_URL$endpoint" \
                -H "Content-Type: application/json" \
                -H "Authorization: Bearer $JWT_TOKEN" \
                -d "$data")
        else
            status=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" \
                "$BASE_URL$endpoint" \
                -H "Content-Type: application/json" \
                -d "$data")
        fi
    else
        if [ -n "$JWT_TOKEN" ]; then
            status=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" \
                "$BASE_URL$endpoint" \
                -H "Authorization: Bearer $JWT_TOKEN")
        else
            status=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" \
                "$BASE_URL$endpoint")
        fi
    fi
    
    if [ "$status" = "$expected_status" ] || ([ "$accept_429" = "true" ] && [ "$status" = "429" ]); then
        if [ "$status" = "429" ]; then
            echo -e "${YELLOW}⚠️  $status (rate limited)${NC} $description"
        else
            echo -e "${GREEN}✅ $status${NC} $description"
        fi
        return 0
    else
        echo -e "${RED}❌ Expected $expected_status, got $status${NC} $description"
        return 1
    fi
}

# Health Endpoints
echo "1️⃣ HEALTH ENDPOINTS"
echo "-------------------"
test_endpoint "GET" "/health" "" "200" "(should return 200)"
test_endpoint "GET" "/health/ready" "" "200" "(should return 200)"
test_endpoint "GET" "/health/live" "" "200" "(should return 200)"
echo ""

# Auth Endpoints
echo "2️⃣ AUTHENTICATION ENDPOINTS"
echo "---------------------------"
test_endpoint "POST" "/auth/verify-phone" '{"phone_e164": "+21612345678"}' "204" "(valid phone)"
test_endpoint "POST" "/auth/verify-phone" '{"phone_e164": "invalid"}' "400" "(invalid phone - validation)" "true"
test_endpoint "POST" "/auth/exchange-token" '{"phone_e164": "+21612345678"}' "400" "(missing OTP - validation)"
echo ""

# Protected Endpoints (should return 401 without token)
echo "3️⃣ PROTECTED ENDPOINTS (without auth)"
echo "--------------------------------------"
test_endpoint "GET" "/users/me" "" "401" "(should require auth)"
test_endpoint "GET" "/drivers/me" "" "401" "(should require auth)"
test_endpoint "POST" "/rides" '{"pickup": {"lat": 36.8065, "lng": 10.1815}}' "401" "(should require auth)"
test_endpoint "GET" "/admin/deposits" "" "401" "(should require auth)"
test_endpoint "GET" "/admin/deposits/pending" "" "401" "(should require auth)"
test_endpoint "POST" "/device-tokens" '{"platform": "ios"}' "401" "(should require auth)"
echo ""

# Admin Endpoints
echo "4️⃣ ADMIN ENDPOINTS (without auth)"
echo "----------------------------------"
test_endpoint "GET" "/admin/deposits" "" "401" "(should require admin auth)"
test_endpoint "GET" "/admin/deposits/pending" "" "401" "(should require admin auth)"
echo ""

# Swagger Documentation
echo "5️⃣ API DOCUMENTATION"
echo "--------------------"
test_endpoint "GET" "/api/docs" "" "200" "(Swagger UI)"
test_endpoint "GET" "/api/docs-json" "" "200" "(OpenAPI spec)"
echo ""

# Summary
echo "📊 SUMMARY"
echo "=========="
echo ""
echo "✅ All endpoints tested"
echo ""
echo "To test with authentication, set JWT_TOKEN:"
echo "  export JWT_TOKEN='your-jwt-token'"
echo "  ./scripts/test-endpoints.sh"
echo ""
echo "To test against different environment:"
echo "  export BASE_URL='https://api.example.com'"
echo "  ./scripts/test-endpoints.sh"
echo ""

