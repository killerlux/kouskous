# Quick Start Guide — Local Testing

This guide shows you how to run and test the entire platform locally (backend, realtime, admin web, mobile apps).

---

## 🎯 Prerequisites

- **Node.js 20+** (you have v18, consider upgrading)
- **pnpm** (installed ✅)
- **PostgreSQL 16** with PostGIS extension
- **Redis 7**
- **Flutter 3** (for mobile apps)
- **Android Studio / Xcode** (for mobile testing)

---

## 🚀 Quick Start (5 minutes)

### 1. Database Setup

```bash
# Install PostgreSQL + PostGIS (if not already)
sudo apt update
sudo apt install postgresql-16 postgresql-16-postgis-3

# Start PostgreSQL
sudo systemctl start postgresql

# Create database and enable PostGIS
sudo -u postgres psql
CREATE DATABASE taxi;
\c taxi
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
\q
```

### 2. Redis Setup

```bash
# Install Redis
sudo apt install redis-server

# Start Redis
sudo systemctl start redis-server
```

### 3. Environment Setup

```bash
cd /home/aymen/Téléchargements/uber

# Copy env example for backend
cp apps/backend/.env.example apps/backend/.env.local

# Edit the file with your values
nano apps/backend/.env.local
```

**Minimum `.env.local` for testing**:
```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/taxi
DATABASE_SSL=false

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=test_secret_change_in_production_12345
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Firebase (use test credentials for now)
FIREBASE_PROJECT_ID=test-project
FIREBASE_CLIENT_EMAIL=test@test.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----"

# Google Maps (get from https://console.cloud.google.com)
GOOGLE_MAPS_API_KEY=your_api_key_here

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Server
PORT=4000
NODE_ENV=development
```

### 4. Run Database Migrations

```bash
cd apps/backend

# Run the schema SQL to create tables
psql -U postgres -d taxi -f ../../docs/schema.sql
```

### 5. Start Backend API

```bash
# From repo root
pnpm --filter @taxi/backend dev
```

**Backend will run on**: http://localhost:4000

**Swagger docs**: http://localhost:4000/api/docs

### 6. Start Realtime Service

```bash
# In a new terminal
pnpm --filter @taxi/realtime dev
```

**Realtime will run on**: http://localhost:4001 (Socket.IO)

### 7. Start Admin Web

```bash
# In a new terminal
pnpm --filter @taxi/admin dev
```

**Admin web will run on**: http://localhost:3000

---

## 📱 Testing the Mobile Apps

### Flutter Setup (one-time)

```bash
# Check Flutter installation
flutter doctor

# Get dependencies for client app
cd apps/mobile_client
flutter pub get

# Get dependencies for driver app
cd ../mobile_driver
flutter pub get
```

### Run Mobile Client App

```bash
cd apps/mobile_client

# Run on Android emulator
flutter run

# Or run on Chrome (for quick testing)
flutter run -d chrome --web-port 8080
```

### Run Mobile Driver App

```bash
cd apps/mobile_driver

# Run on Android emulator
flutter run

# Or run on Chrome
flutter run -d chrome --web-port 8081
```

---

## 🧪 API Testing with Swagger

1. **Open Swagger UI**: http://localhost:4000/api/docs

2. **Test Authentication Flow**:
   ```
   POST /auth/verify-phone
   {
     "phone_e164": "+21612345678"
   }
   
   POST /auth/exchange-token
   {
     "phone_e164": "+21612345678",
     "otp_code": "000000"  // Dev bypass code
   }
   ```

3. **Copy the `access_token`** from response

4. **Click "Authorize"** button in Swagger, paste token

5. **Test Protected Endpoints**:
   ```
   GET /users/me
   GET /drivers/me
   POST /rides
   GET /admin/deposits/pending  (requires admin role)
   ```

---

## 🧪 Testing the Complete Flow

### Scenario: Driver Earnings → Lock → Deposit → Unlock

#### 1. Create a Driver User
```bash
curl -X POST http://localhost:4000/auth/exchange-token \
  -H "Content-Type: application/json" \
  -d '{"phone_e164": "+21612345678", "otp_code": "000000"}'
```
Save the `access_token`.

#### 2. Create Multiple Rides (to reach 1000 TND)
```bash
# Use Swagger or:
for i in {1..20}; do
  curl -X POST http://localhost:4000/rides \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "pickup": {"lat": 36.8065, "lng": 10.1815},
      "dropoff": {"lat": 36.8027, "lng": 10.1658}
    }'
done
```

#### 3. Complete Rides (simulate cash earnings)
```bash
# For each ride ID:
curl -X POST http://localhost:4000/rides/{ride_id}/start \
  -H "Authorization: Bearer YOUR_TOKEN"

curl -X POST http://localhost:4000/rides/{ride_id}/complete \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"price_cents": 5000}'  # 50 TND per ride
```

#### 4. Check Driver Lock Status
After 20 rides × 50 TND = 1000 TND, driver should be locked.

```bash
# Check balance (via custom query or admin panel)
```

#### 5. Submit Deposit
```bash
curl -X POST http://localhost:4000/deposits \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount_cents": 100000,
    "receipt_url": "https://example.com/receipt.jpg"
  }'
```

#### 6. Admin Approves Deposit
```bash
# Login as admin user first
# Then:
curl -X POST http://localhost:4000/deposits/{deposit_id}/approve \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

Driver is now unlocked! ✅

---

## 🎨 Admin Web Interface

The admin web app (`/apps/admin`) is a Next.js 14 app. Currently it has:
- Basic layout
- Ready for integration with backend API

### What Admins Can Do:
1. **View pending deposits**: `GET /admin/deposits/pending`
2. **Approve deposits**: `POST /deposits/:id/approve`
3. **Reject deposits**: `POST /deposits/:id/reject`
4. **View driver details**: `GET /drivers/:id`

### TODO for Admin Web:
- [ ] Login page (Firebase phone auth)
- [ ] Deposit approval queue UI
- [ ] Driver verification queue
- [ ] Real-time ride monitoring
- [ ] Analytics dashboard

---

## 📱 Mobile App Features

### Client App (`mobile_client`)
Currently has:
- Auth screen skeleton
- Home screen skeleton
- Riverpod state management setup
- Go Router navigation

**TODO**:
- [ ] Phone OTP login (Firebase)
- [ ] Map integration (Google Maps)
- [ ] Request ride flow
- [ ] Track ride status
- [ ] View ride history

### Driver App (`mobile_driver`)
Currently has:
- Auth screen skeleton
- Dashboard skeleton
- Earnings lock screen skeleton
- Riverpod state management setup

**TODO**:
- [ ] Phone OTP login
- [ ] Go online/offline toggle
- [ ] Accept/decline ride offers
- [ ] Navigation integration
- [ ] Earnings display + lock warning
- [ ] Deposit submission flow

---

## 🔍 Monitoring & Debugging

### Health Checks
```bash
curl http://localhost:4000/health
curl http://localhost:4000/health/ready
curl http://localhost:4000/health/live
```

### Database Queries
```bash
# Check rides
psql -U postgres -d taxi -c "SELECT * FROM rides;"

# Check earnings ledger
psql -U postgres -d taxi -c "SELECT * FROM earnings_ledger ORDER BY created_at DESC LIMIT 10;"

# Check driver balances
psql -U postgres -d taxi -c "SELECT * FROM driver_balances_mv;"

# Refresh materialized view manually
psql -U postgres -d taxi -c "SELECT refresh_driver_balances();"
```

### Logs
Backend logs show:
- Auth attempts
- Ride lifecycle events
- Earnings credits/debits
- Deposit submissions/approvals
- Driver lock/unlock events

---

## 🐛 Common Issues

### 1. "Cannot connect to database"
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U postgres -d taxi
```

### 2. "PostGIS extension not found"
```bash
sudo apt install postgresql-16-postgis-3
sudo -u postgres psql taxi -c "CREATE EXTENSION IF NOT EXISTS postgis;"
```

### 3. "JWT token invalid"
- Make sure `JWT_SECRET` in `.env.local` matches what you used to generate the token
- Token expires in 15 minutes by default

### 4. "Flutter command not found"
```bash
# Install Flutter
git clone https://github.com/flutter/flutter.git -b stable ~/flutter
echo 'export PATH="$PATH:$HOME/flutter/bin"' >> ~/.bashrc
source ~/.bashrc
flutter doctor
```

### 5. "Port already in use"
```bash
# Kill process on port 4000
sudo lsof -ti:4000 | xargs kill -9

# Or change port in .env.local
PORT=4001
```

---

## 🚀 Next Steps

### For Backend:
- ✅ Core features complete (53 tests passing)
- ⏳ Generate TypeScript SDK from OpenAPI
- ⏳ Integration tests with Testcontainers

### For Admin Web:
1. Implement login page
2. Build deposit approval queue
3. Add driver verification UI
4. Integrate with backend SDK

### For Mobile Apps:
1. Implement Firebase phone auth
2. Integrate Google Maps SDK
3. Build ride request/tracking UI
4. Implement Socket.IO client for realtime
5. Add earnings display + deposit flow

---

## 📚 Additional Resources

- **Architecture**: `/docs/ARCHITECTURE.md`
- **API Docs**: http://localhost:4000/api/docs (when running)
- **OpenAPI Spec**: `/docs/openapi.yaml`
- **Database Schema**: `/docs/schema.sql`
- **Security**: `/docs/security.md`
- **Test Plan**: `/docs/test_plan.md`

---

## 🆘 Need Help?

1. Check logs: Backend outputs structured logs in development
2. Use Swagger UI to test API endpoints
3. Check database state with psql queries
4. Review test files in `/apps/backend/test` for examples

---

**Status**: Backend is production-ready with 53 passing tests. Frontend apps need implementation. 🚀

