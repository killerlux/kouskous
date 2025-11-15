# Admin Account Credentials

**Created:** 2025-11-15  
**Status:** ✅ Active

---

## 🔐 Your Admin Account

### Login Credentials

**Phone Number:** `+33612345678`  
**Password:** `admin123`

### Access URL

**Admin Web App:** http://localhost:3000

---

## 🚀 How to Login

1. Open http://localhost:3000 in your browser
2. Enter your phone: `+33612345678`
3. Enter your password: `admin123`
4. Click "Se connecter"
5. You'll be redirected to the dashboard ✅

---

## 📝 Notes

- **Phone Format:** French format (+33) since you're based in France
- **App Location:** The app will be deployed in Tunisia
- **Phone Flexibility:** The system accepts both French (+33) and Tunisian (+216) formats
- **No OTP Required:** Direct password login for admin (no SMS needed)

---

## 🔒 Security

### Change Password (Production)

Set the `ADMIN_PASSWORD` environment variable:

```bash
# In docker-compose or .env
ADMIN_PASSWORD=your_secure_password_here
```

### Current Setup

- **Development:** Password is `admin123` (default)
- **Production:** Set `ADMIN_PASSWORD` env var for security

---

## 🧪 Test Login

You can test the login via API:

```bash
curl -X POST http://localhost:4000/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone_e164": "+33612345678",
    "password": "admin123"
  }'
```

---

## ✅ Account Status

- ✅ Admin user created in database
- ✅ Role: `admin`
- ✅ Phone: `+33612345678`
- ✅ Login endpoint working
- ✅ Admin Web App updated

---

**Ready to use!** 🎉

