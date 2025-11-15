#!/bin/bash
# Quick API testing script
# Usage: ./scripts/test-api.sh

set -e

BASE_URL="${API_URL:-http://localhost:4000}"
echo "🧪 Testing API at $BASE_URL"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test health endpoint
echo "1. Testing health endpoint..."
HEALTH=$(curl -s "$BASE_URL/health")
if echo "$HEALTH" | grep -q "ok"; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}✗ Health check failed${NC}"
    exit 1
fi
echo ""

# Test auth - verify phone
echo "2. Testing auth - verify phone..."
VERIFY=$(curl -s -X POST "$BASE_URL/auth/verify-phone" \
    -H "Content-Type: application/json" \
    -d '{"phone_e164": "+21612345678"}')
echo -e "${GREEN}✓ Phone verification sent${NC}"
echo ""

# Test auth - exchange token (dev mode with 000000 OTP)
echo "3. Testing auth - exchange token..."
TOKEN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/exchange-token" \
    -H "Content-Type: application/json" \
    -d '{"phone_e164": "+21612345678", "otp_code": "000000"}')

ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
    echo -e "${RED}✗ Failed to get access token${NC}"
    echo "Response: $TOKEN_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✓ Got access token: ${ACCESS_TOKEN:0:20}...${NC}"
echo ""

# Test authenticated endpoint
echo "4. Testing authenticated endpoint - GET /users/me..."
USER_RESPONSE=$(curl -s "$BASE_URL/users/me" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$USER_RESPONSE" | grep -q "phone_e164"; then
    echo -e "${GREEN}✓ User endpoint working${NC}"
    echo "User: $USER_RESPONSE"
else
    echo -e "${RED}✗ User endpoint failed${NC}"
    echo "Response: $USER_RESPONSE"
    exit 1
fi
echo ""

# Test creating a ride
echo "5. Testing ride creation..."
RIDE_RESPONSE=$(curl -s -X POST "$BASE_URL/rides" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "pickup": {"lat": 36.8065, "lng": 10.1815},
        "dropoff": {"lat": 36.8027, "lng": 10.1658},
        "idempotency_key": "test-'$(date +%s)'"
    }')

RIDE_ID=$(echo "$RIDE_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$RIDE_ID" ]; then
    echo -e "${RED}✗ Failed to create ride${NC}"
    echo "Response: $RIDE_RESPONSE"
else
    echo -e "${GREEN}✓ Ride created: $RIDE_ID${NC}"
fi
echo ""

# Test getting ride
if [ ! -z "$RIDE_ID" ]; then
    echo "6. Testing GET ride..."
    GET_RIDE=$(curl -s "$BASE_URL/rides/$RIDE_ID" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    if echo "$GET_RIDE" | grep -q "$RIDE_ID"; then
        echo -e "${GREEN}✓ Ride retrieved successfully${NC}"
    else
        echo -e "${RED}✗ Failed to get ride${NC}"
    fi
fi
echo ""

echo "========================================="
echo -e "${GREEN}✅ API tests completed!${NC}"
echo "========================================="
echo ""
echo "📝 Access token for manual testing:"
echo "$ACCESS_TOKEN"
echo ""
echo "📚 Open Swagger docs: $BASE_URL/api/docs"
echo "   Click 'Authorize' and paste token above"

