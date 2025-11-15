# Expert Verification & Testing Guide

**Role:** DevOps/SRE Engineer / QA Lead  
**Objective:** Comprehensive system verification, testing, and production readiness assessment  
**Date:** 2025-11-15

---

## 🎯 Pre-Verification Checklist

Before starting, ensure:
- [ ] All services are running (`docker compose -f infra/docker-compose.dev.yml ps`)
- [ ] Database migrations are applied (`pnpm --filter @taxi/backend migration:run`)
- [ ] No uncommitted changes (`git status`)
- [ ] CI/CD pipeline is green (check GitHub Actions)

---

## Phase 1: Service Health Verification

### 1.1 Docker Services Status

```bash
cd /home/aymen/Téléchargements/uber
docker compose -f infra/docker-compose.dev.yml ps
```

**Expected Output:**
- ✅ `infra-backend-1`: Up (healthy)
- ✅ `infra-postgres-1`: Up (healthy)
- ✅ `infra-redis-1`: Up (healthy)
- ✅ `infra-realtime-1`: Up (running)

**If issues found:**
- Check logs: `docker compose -f infra/docker-compose.dev.yml logs <service>`
- Restart service: `docker compose -f infra/docker-compose.dev.yml restart <service>`
- Rebuild if needed: `docker compose -f infra/docker-compose.dev.yml build <service>`

### 1.2 Health Endpoints

```bash
# Backend health
curl -s http://localhost:4000/health | jq .
curl -s http://localhost:4000/health/ready | jq .
curl -s http://localhost:4000/health/live | jq .

# Expected: All return {"status": "ok"}
```

**Fix if failing:**
- Check database connection in backend logs
- Verify DATABASE_URL in docker-compose environment
- Check PostgreSQL is accessible: `psql -h localhost -p 15432 -U postgres -d taxi_dev`

### 1.3 Database Connectivity

```bash
# Test PostgreSQL connection
export PGPASSWORD=postgres
psql -h localhost -p 15432 -U postgres -d taxi_dev -c "SELECT version();"
psql -h localhost -p 15432 -U postgres -d taxi_dev -c "SELECT PostGIS_version();"

# Test Redis connection
redis-cli -h localhost -p 16379 ping
# Expected: PONG
```

**Fix if failing:**
- Check port conflicts: `lsof -i :15432` or `lsof -i :16379`
- Verify docker-compose ports are correct
- Check service logs for connection errors

---

## Phase 2: Authentication Flow Testing

### 2.1 OTP Request (Mock Firebase)

**Note:** Firebase is not configured locally. This test verifies the endpoint structure.

```bash
# Test phone verification endpoint
curl -X POST http://localhost:4000/auth/verify-phone \
  -H "Content-Type: application/json" \
  -d '{"phone_e164": "+21612345678"}'

# Expected: 204 No Content (or 401 if Firebase not configured)
```

**Fix if failing:**
- Check auth service logs: `docker compose -f infra/docker-compose.dev.yml logs backend | grep -i auth`
- Verify Firebase Admin SDK initialization in `apps/backend/src/modules/auth/auth.service.ts`
- For local testing, consider mocking Firebase or using test credentials

### 2.2 Token Exchange (With Mock OTP)

```bash
# Test token exchange (will fail without Firebase, but validates structure)
curl -X POST http://localhost:4000/auth/exchange-token \
  -H "Content-Type: application/json" \
  -d '{
    "phone_e164": "+21612345678",
    "otp_code": "123456"
  }' | jq .

# Expected: 401 with "Authentication service not configured" or validation errors
```

**Fix if failing:**
- Verify DTO validation: Check `apps/backend/src/modules/auth/dto/exchange-token.dto.ts`
- Check rate limiting: Should allow 5 requests per minute
- Verify JWT secret configuration

### 2.3 Rate Limiting Verification

```bash
# Test rate limiting on verify-phone (3 req/min)
for i in {1..5}; do
  echo "Request $i:"
  curl -X POST http://localhost:4000/auth/verify-phone \
    -H "Content-Type: application/json" \
    -d '{"phone_e164": "+21612345678"}' \
    -w "\nHTTP Status: %{http_code}\n\n"
  sleep 1
done

# Expected: First 3 succeed, then 429 Too Many Requests
```

**Fix if failing:**
- Check ThrottlerModule configuration in `apps/backend/src/app.module.ts`
- Verify Redis is connected (Throttler uses Redis)
- Check `@nestjs/throttler` package version

---

## Phase 3: Authenticated Endpoint Testing

### 3.1 Generate Test JWT Token

**Option A: Use Firebase Admin SDK (if configured)**

```bash
# Create a test script to generate JWT
node -e "
const admin = require('firebase-admin');
// Initialize Firebase Admin (if configured)
// Generate custom token and exchange for JWT
"
```

**Option B: Mock JWT for Testing**

Create a test script to generate a valid JWT:

```bash
cat > /tmp/generate-test-jwt.js << 'EOF'
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'dev-secret';

const token = jwt.sign(
  {
    id: 'test-user-id',
    phone_e164: '+21612345678',
    role: 'rider'
  },
  secret,
  { expiresIn: '15m' }
);

console.log(token);
EOF

# Run it (requires jwt package)
node /tmp/generate-test-jwt.js
```

### 3.2 Test Protected Endpoints

```bash
# Set your test token
export TEST_TOKEN="your-jwt-token-here"

# Test /users/me
curl -X GET http://localhost:4000/users/me \
  -H "Authorization: Bearer $TEST_TOKEN" \
  | jq .

# Expected: User object or 401 if token invalid
```

**Fix if failing:**
- Verify JWT_SECRET matches between token generation and backend
- Check JwtAuthGuard configuration
- Verify token expiration (15 minutes)
- Check user exists in database

### 3.3 Test Ride Creation (Authenticated)

```bash
curl -X POST http://localhost:4000/rides \
  -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pickup": {"lat": 36.8065, "lng": 10.1815},
    "dropoff": {"lat": 36.8027, "lng": 10.1658}
  }' | jq .

# Expected: Ride object with status "pending" or validation errors
```

**Fix if failing:**
- Check RidesService implementation
- Verify PostGIS functions are available
- Check database schema (rides table exists)
- Verify idempotency_key handling

---

## Phase 4: Database Schema Verification

### 4.1 Verify All Tables Exist

```bash
export PGPASSWORD=postgres
psql -h localhost -p 15432 -U postgres -d taxi_dev << 'EOF'
\dt
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
EOF
```

**Expected Tables:**
- users
- drivers
- vehicles
- rides
- earnings_ledger
- documents
- device_tokens
- deposits
- migrations

**Fix if missing:**
- Run migrations: `pnpm --filter @taxi/backend migration:run`
- Check migration files in `apps/backend/src/migrations/`
- Verify data-source.ts configuration

### 4.2 Verify PostGIS Extensions

```bash
psql -h localhost -p 15432 -U postgres -d taxi_dev -c "\dx"
```

**Expected:**
- postgis
- uuid-ossp

**Fix if missing:**
- Run: `CREATE EXTENSION IF NOT EXISTS postgis;`
- Run: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

### 4.3 Verify Materialized View

```bash
psql -h localhost -p 15432 -U postgres -d taxi_dev << 'EOF'
-- Check materialized view exists
SELECT * FROM driver_balances_mv LIMIT 1;

-- Test refresh function
SELECT refresh_driver_balances();
EOF
```

**Fix if missing:**
- Run the SQL from migration or manually create:
```sql
CREATE MATERIALIZED VIEW driver_balances_mv AS
SELECT
  driver_id,
  SUM(CASE WHEN direction = 'credit' THEN amount_cents ELSE -amount_cents END) AS balance_cents,
  MAX(created_at) AS last_updated
FROM earnings_ledger
GROUP BY driver_id;

CREATE UNIQUE INDEX idx_driver_balances_driver_id ON driver_balances_mv(driver_id);
```

---

## Phase 5: Realtime Service Verification

### 5.1 Socket.IO Server Status

```bash
# Check if server is listening
netstat -tlnp | grep 4001 || ss -tlnp | grep 4001

# Check logs
docker compose -f infra/docker-compose.dev.yml logs realtime | tail -20
```

**Expected:**
- Port 4001 listening
- Logs show "Nest application successfully started"
- No connection errors

**Fix if failing:**
- Check circular dependency resolution (forwardRef)
- Verify Redis connection
- Check for missing dependencies (@nestjs/platform-express)

### 5.2 Test Socket.IO Connection

**Install socket.io-client for testing:**

```bash
npm install -g socket.io-client
# Or use a test script
```

**Test connection:**

```javascript
// test-socket.js
const io = require('socket.io-client');

const clientSocket = io('http://localhost:4001/client', {
  transports: ['websocket']
});

clientSocket.on('connect', () => {
  console.log('✅ Connected to /client namespace');
  clientSocket.disconnect();
  process.exit(0);
});

clientSocket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error.message);
  process.exit(1);
});

setTimeout(() => {
  console.log('⏱️ Connection timeout');
  process.exit(1);
}, 5000);
```

**Fix if failing:**
- Check CORS configuration in realtime main.ts
- Verify namespace configuration in gateways
- Check Redis connection for presence service

---

## Phase 6: API Documentation Verification

### 6.1 Swagger UI Accessibility

```bash
# Test Swagger UI
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:4000/api/docs

# Expected: 200
```

**Fix if failing:**
- Check SwaggerModule configuration in main.ts
- Verify @nestjs/swagger package version
- Check for TypeScript compilation errors

### 6.2 OpenAPI Spec Validation

```bash
# Download and validate OpenAPI spec
curl -s http://localhost:4000/api/docs-json > /tmp/openapi.json
jq '.info' /tmp/openapi.json

# Check all routes are documented
jq '.paths | keys' /tmp/openapi.json
```

**Expected:**
- Valid JSON
- All endpoints documented
- Proper schemas for DTOs

**Fix if failing:**
- Add @ApiTags, @ApiOperation decorators
- Verify DTOs have @ApiProperty decorators
- Check for missing Swagger decorators

---

## Phase 7: Security Verification

### 7.1 Authentication Guards

```bash
# Test all protected endpoints return 401 without token
ENDPOINTS=(
  "/users/me"
  "/drivers/me"
  "/rides"
  "/admin/deposits"
  "/device-tokens"
)

for endpoint in "${ENDPOINTS[@]}"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:4000$endpoint")
  if [ "$status" != "401" ]; then
    echo "❌ $endpoint returned $status (expected 401)"
  else
    echo "✅ $endpoint correctly protected"
  fi
done
```

**Fix if failing:**
- Add @UseGuards(JwtAuthGuard) to controllers
- Verify JwtStrategy is configured
- Check JWT_SECRET is set

### 7.2 Role-Based Access Control (RBAC)

```bash
# Test admin endpoints require admin role
# (Requires JWT with role: 'admin')
curl -X GET http://localhost:4000/admin/deposits \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  | jq .

# Expected: 200 with data OR 403 if not admin
```

**Fix if failing:**
- Verify @Roles('admin') decorator on admin endpoints
- Check RolesGuard is configured globally
- Verify user.role is set correctly in JWT

### 7.3 Input Validation

```bash
# Test invalid phone format
curl -X POST http://localhost:4000/auth/verify-phone \
  -H "Content-Type: application/json" \
  -d '{"phone_e164": "invalid"}' | jq .

# Expected: 400 with validation errors
```

**Fix if failing:**
- Check class-validator decorators on DTOs
- Verify ValidationPipe is configured globally
- Check DTO files for proper validation rules

---

## Phase 8: Performance & Load Testing

### 8.1 Basic Performance Test

```bash
# Test response times
time curl -s http://localhost:4000/health > /dev/null

# Expected: < 100ms
```

### 8.2 Database Query Performance

```bash
# Test PostGIS query performance
psql -h localhost -p 15432 -U postgres -d taxi_dev << 'EOF'
EXPLAIN ANALYZE
SELECT * FROM drivers 
WHERE ST_DWithin(
  location,
  ST_SetSRID(ST_MakePoint(10.1815, 36.8065), 4326),
  5000
)
LIMIT 10;
EOF
```

**Fix if slow:**
- Verify GiST index on location columns
- Check for missing indexes on foreign keys
- Analyze table statistics: `ANALYZE drivers;`

---

## Phase 9: Error Handling Verification

### 9.1 Test Error Responses

```bash
# Test 404 for non-existent resource
curl -X GET http://localhost:4000/rides/00000000-0000-0000-0000-000000000000 \
  -H "Authorization: Bearer $TEST_TOKEN" \
  | jq .

# Expected: 404 Not Found with proper error format
```

**Fix if failing:**
- Check exception filters
- Verify error response format matches API spec
- Ensure proper HTTP status codes

### 9.2 Test Validation Errors

```bash
# Test invalid ride data
curl -X POST http://localhost:4000/rides \
  -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"pickup": {"lat": "invalid"}}' | jq .

# Expected: 400 with detailed validation errors
```

---

## Phase 10: Integration Testing

### 10.1 Full Auth Flow (If Firebase Configured)

```bash
# 1. Request OTP
curl -X POST http://localhost:4000/auth/verify-phone \
  -H "Content-Type: application/json" \
  -d '{"phone_e164": "+21612345678"}'

# 2. Exchange OTP for token (use real OTP from Firebase)
export ACCESS_TOKEN=$(curl -X POST http://localhost:4000/auth/exchange-token \
  -H "Content-Type: application/json" \
  -d '{"phone_e164": "+21612345678", "otp_code": "123456"}' \
  | jq -r '.access_token')

# 3. Use token to access protected endpoint
curl -X GET http://localhost:4000/users/me \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
```

### 10.2 Full Ride Flow

```bash
# 1. Create ride
RIDE_ID=$(curl -X POST http://localhost:4000/rides \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pickup": {"lat": 36.8065, "lng": 10.1815},
    "dropoff": {"lat": 36.8027, "lng": 10.1658}
  }' | jq -r '.id')

# 2. Get ride status
curl -X GET "http://localhost:4000/rides/$RIDE_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .

# 3. Cancel ride (if needed)
curl -X POST "http://localhost:4000/rides/$RIDE_ID/cancel" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
```

---

## Phase 11: Logging & Monitoring Verification

### 11.1 Check Structured Logging

```bash
# Check backend logs format
docker compose -f infra/docker-compose.dev.yml logs backend | tail -20

# Expected: Structured JSON logs (if configured)
```

**Fix if needed:**
- Configure Winston or Pino logger
- Add correlation IDs for request tracing
- Ensure no PII in logs

### 11.2 Check Error Logging

```bash
# Trigger an error and check logs
curl -X GET http://localhost:4000/nonexistent

# Check logs for error details
docker compose -f infra/docker-compose.dev.yml logs backend | grep -i error | tail -5
```

---

## Phase 12: Production Readiness Checklist

### 12.1 Environment Configuration

- [ ] All secrets are in environment variables (not hardcoded)
- [ ] `.env.example` file exists with placeholders
- [ ] No secrets committed to git (check `.gitignore`)
- [ ] Production environment variables documented

### 12.2 Database

- [ ] Migrations are versioned and tested
- [ ] Backup strategy documented
- [ ] Connection pooling configured
- [ ] Indexes optimized for query patterns

### 12.3 Security

- [ ] JWT secrets are strong and rotated
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (TypeORM parameterized queries)

### 12.4 Monitoring

- [ ] Health checks configured
- [ ] Logging strategy in place
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Metrics collection (Prometheus, etc.)

### 12.5 Documentation

- [ ] API documentation complete (Swagger)
- [ ] Architecture documentation updated
- [ ] Deployment runbook created
- [ ] Incident response plan documented

---

## 🐛 Common Issues & Fixes

### Issue: Database Connection Refused

**Symptoms:** Backend logs show "ECONNREFUSED"

**Fix:**
```bash
# Check PostgreSQL is running
docker compose -f infra/docker-compose.dev.yml ps postgres

# Check connection string
docker compose -f infra/docker-compose.dev.yml exec backend env | grep DATABASE_URL

# Restart services
docker compose -f infra/docker-compose.dev.yml restart backend postgres
```

### Issue: Circular Dependency in Realtime

**Symptoms:** "Nest can't resolve dependencies"

**Fix:**
- Use `forwardRef()` in constructor injections
- Ensure providers are listed in correct order in AppModule
- Check for missing `@Injectable()` decorators

### Issue: Swagger Not Loading

**Symptoms:** 404 on `/api/docs`

**Fix:**
- Verify SwaggerModule is imported in main.ts
- Check for TypeScript compilation errors
- Ensure all DTOs have proper decorators

### Issue: JWT Validation Failing

**Symptoms:** 401 even with valid token

**Fix:**
- Verify JWT_SECRET matches between token generation and validation
- Check token expiration
- Verify JwtStrategy is configured correctly

---

## 📊 Test Results Template

Create a test results file:

```bash
cat > docs/TEST_RESULTS_$(date +%Y%m%d).md << 'EOF'
# Test Results - $(date +%Y-%m-%d)

## Environment
- Backend: http://localhost:4000
- Realtime: http://localhost:4001
- PostgreSQL: localhost:15432
- Redis: localhost:16379

## Test Results

### Phase 1: Service Health
- [ ] All services running
- [ ] Health endpoints responding
- [ ] Database connectivity verified

### Phase 2: Authentication
- [ ] OTP request working
- [ ] Token exchange working
- [ ] Rate limiting working

### Phase 3: Protected Endpoints
- [ ] User endpoints protected
- [ ] Driver endpoints protected
- [ ] Ride endpoints protected
- [ ] Admin endpoints protected

### Phase 4: Database
- [ ] All tables exist
- [ ] PostGIS extensions enabled
- [ ] Materialized view working

### Phase 5: Realtime
- [ ] Socket.IO server running
- [ ] Namespaces accessible
- [ ] Connection handling working

### Phase 6: Documentation
- [ ] Swagger UI accessible
- [ ] OpenAPI spec valid
- [ ] All endpoints documented

### Phase 7: Security
- [ ] Authentication guards working
- [ ] RBAC working
- [ ] Input validation working

### Phase 8: Performance
- [ ] Response times acceptable
- [ ] Database queries optimized

### Phase 9: Error Handling
- [ ] Error responses proper format
- [ ] Validation errors detailed

### Phase 10: Integration
- [ ] Full auth flow working
- [ ] Full ride flow working

## Issues Found
(List any issues found)

## Recommendations
(List recommendations for improvements)
EOF
```

---

## ✅ Sign-Off

After completing all phases:

1. **Document all findings** in test results
2. **Create issues** for any bugs found
3. **Update documentation** with any changes
4. **Commit test results** to repository
5. **Update deployment readiness** document

**Expert Signature:** _________________  
**Date:** _________________

---

## 📞 Escalation

If critical issues are found that block deployment:

1. Document the issue in detail
2. Create a GitHub issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Logs and error messages
   - Environment details
3. Notify the development team
4. Update the deployment readiness status

---

**Last Updated:** 2025-11-15  
**Version:** 1.0

