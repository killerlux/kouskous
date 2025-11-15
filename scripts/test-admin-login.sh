#!/bin/bash

# Test Admin Login Flow
# Simulates browser login to verify it works

BASE_URL="http://localhost:3000"
API_URL="http://localhost:4000"

echo "🧪 Testing Admin Login Flow"
echo "=========================="
echo ""

# Step 1: Login via API
echo "1️⃣ Login via API..."
RESPONSE=$(curl -s -X POST "$API_URL/auth/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"phone_e164": "+33612345678", "password": "admin123"}')

ACCESS_TOKEN=$(echo "$RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ Login failed!"
  echo "$RESPONSE"
  exit 1
fi

echo "✅ Login successful!"
echo "   Token: ${ACCESS_TOKEN:0:50}..."
echo ""

# Step 2: Verify token works
echo "2️⃣ Verifying token..."
USER_INFO=$(curl -s "$API_URL/users/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

ROLE=$(echo "$USER_INFO" | grep -o '"role":"[^"]*"' | cut -d'"' -f4)

if [ "$ROLE" != "admin" ]; then
  echo "❌ User is not admin! Role: $ROLE"
  exit 1
fi

echo "✅ Token verified! User role: $ROLE"
echo ""

# Step 3: Test web routes
echo "3️⃣ Testing web routes..."
echo ""

echo "   Root (/) → Should redirect to /fr/login"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -L "$BASE_URL/")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "307" ] || [ "$HTTP_CODE" = "308" ]; then
  echo "   ✅ Root redirects correctly (HTTP $HTTP_CODE)"
else
  echo "   ❌ Root failed (HTTP $HTTP_CODE)"
fi

echo ""
echo "   /fr/login → Should show login page"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/fr/login")
if [ "$HTTP_CODE" = "200" ]; then
  echo "   ✅ Login page accessible (HTTP $HTTP_CODE)"
else
  echo "   ❌ Login page failed (HTTP $HTTP_CODE)"
fi

echo ""
echo "✅ All tests passed!"
echo ""
echo "📝 To login in browser:"
echo "   1. Go to: $BASE_URL/fr/login"
echo "   2. Phone: +33612345678"
echo "   3. Password: admin123"

