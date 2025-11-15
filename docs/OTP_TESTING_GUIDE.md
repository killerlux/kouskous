# OTP Testing Guide

**Date:** 2025-11-15  
**Status:** ✅ OTP Working (Dev Mode)

---

## 🎯 Quick Answer

**Yes, OTP is working!** But it's using **dev mode bypass** since Firebase is not configured.

---

## ✅ What's Working

### Backend Endpoints
- ✅ `POST /auth/verify-phone` - Returns 204 (No Content)
- ✅ `POST /auth/exchange-token` - Returns JWT tokens

### Dev Mode Bypass
- ✅ Test OTP: `000000` (always works in dev mode)
- ✅ User creation/authentication works
- ✅ JWT tokens generated successfully

---

## ⚠️ Current Status

### Firebase Configuration
- ❌ **Firebase NOT configured** (using dev mode)
- ⚠️ Warning: `Firebase credentials not configured; OTP verification will be mocked`

### Admin User Setup
- ✅ Admin user created: `+21612345678` with role `admin`
- ✅ Can login to Admin Web App

---

## 🧪 How to Test

### 1. Test via Admin Web App (http://localhost:3000)

**Steps:**
1. Open http://localhost:3000
2. Enter phone: `+21612345678`
3. Click "Envoyer le code"
4. Enter OTP: `000000` (dev bypass)
5. Click "Vérifier le code"
6. Should redirect to dashboard ✅

### 2. Test via API (curl)

```bash
# Step 1: Verify Phone
curl -X POST http://localhost:4000/auth/verify-phone \
  -H "Content-Type: application/json" \
  -d '{"phone_e164": "+21612345678"}'
# Returns: 204 No Content

# Step 2: Exchange Token (use OTP: 000000)
curl -X POST http://localhost:4000/auth/exchange-token \
  -H "Content-Type: application/json" \
  -d '{"phone_e164": "+21612345678", "otp_code": "000000"}'
# Returns: {"access_token": "...", "refresh_token": "...", "expires_in": 900}

# Step 3: Use Token
TOKEN="your_access_token_here"
curl http://localhost:4000/users/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔧 Configuration

### Dev Mode (Current)
- **OTP Bypass:** `000000` always works
- **No Firebase required**
- **User auto-created** with role from request (default: `client`)

### Production Mode (Firebase Required)
To enable real Firebase OTP:

1. **Get Firebase Credentials:**
   - Go to Firebase Console
   - Project Settings → Service Accounts
   - Generate new private key
   - Download JSON file

2. **Set Environment Variables:**
   ```bash
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

3. **Restart Backend:**
   ```bash
   docker-compose -f infra/docker-compose.dev.yml restart backend
   ```

4. **Test with Real OTP:**
   - Use Firebase client SDK to send OTP
   - Verify with Firebase ID token
   - Exchange token on backend

---

## 📝 Admin User Setup

### Create Admin User Manually

```sql
-- Update existing user to admin
UPDATE users SET role = 'admin' WHERE phone_e164 = '+21612345678';

-- Or create new admin user
INSERT INTO users (phone_e164, role) 
VALUES ('+21612345678', 'admin')
ON CONFLICT (phone_e164) DO UPDATE SET role = 'admin';
```

### Via Docker

```bash
docker exec -i infra-postgres-1 psql -U postgres -d taxi_dev << 'EOF'
UPDATE users SET role = 'admin' WHERE phone_e164 = '+21612345678';
SELECT id, phone_e164, role FROM users WHERE phone_e164 = '+21612345678';
EOF
```

---

## 🐛 Known Issues

1. **Firebase Not Configured:**
   - Using dev mode bypass
   - Real OTP won't work until Firebase is configured

2. **User Role Default:**
   - New users created with role `client` by default
   - Must manually update to `admin` for admin access

3. **No OTP Expiration:**
   - Dev mode bypass doesn't expire
   - Production Firebase OTP has expiration

---

## ✅ Test Results

### Latest Test (2025-11-15)
- ✅ `verify-phone` endpoint: **Working** (204 response)
- ✅ `exchange-token` endpoint: **Working** (returns tokens)
- ✅ JWT token generation: **Working**
- ✅ User authentication: **Working**
- ✅ Admin user created: **Working**
- ✅ Admin login flow: **Ready to test**

---

## 🚀 Next Steps

1. **Test Admin Web Login:**
   - Open http://localhost:3000
   - Login with `+21612345678` / `000000`
   - Verify dashboard access

2. **Configure Firebase (Production):**
   - Set up Firebase project
   - Add credentials to environment
   - Test real OTP flow

3. **Add OTP Expiration:**
   - Implement OTP expiry in dev mode
   - Add rate limiting

---

## 📊 Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Backend Endpoints | ✅ Working | Both endpoints respond correctly |
| Dev Mode Bypass | ✅ Working | OTP `000000` works |
| Firebase | ❌ Not Configured | Using dev mode |
| JWT Tokens | ✅ Working | Generated successfully |
| Admin User | ✅ Created | `+21612345678` with `admin` role |
| Admin Login | ✅ Ready | Can test in browser |

**Conclusion:** OTP is working in dev mode. Ready for testing! 🎉

