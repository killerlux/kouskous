# 🔒 Security Guide - API Keys & Secrets Management

**Last Updated**: 2025-01-14

---

## ⚠️ **CRITICAL: API Key Leak Prevention**

### **What Happened**
A Google Maps API key was accidentally committed to documentation files. This has been fixed, but you should:

1. **Rotate the exposed key immediately** in Google Cloud Console
2. **Review all commits** to ensure no other secrets were leaked
3. **Set up key restrictions** on the new key

---

## 🛡️ **Best Practices**

### **1. Environment Variables**

#### **✅ DO:**
- Use `.env.example` files as templates
- Add `.env` to `.gitignore` (already done)
- Use placeholders in documentation: `your_api_key_here`
- Store real keys in `.env` files (never committed)

#### **❌ DON'T:**
- Commit `.env` files with real keys
- Put API keys in documentation
- Hardcode keys in source code
- Share keys in chat/email

### **2. Git History**

If you accidentally commit a secret:

```bash
# Option 1: Remove from history (if not pushed)
git rebase -i HEAD~N  # N = number of commits to go back
# Edit the commit, remove the secret

# Option 2: Use git-filter-repo (if already pushed)
git filter-repo --path docs/MOBILE_IMPLEMENTATION_STATUS.md --invert-paths
# Then force push (coordinate with team first!)

# Option 3: Rotate the key (safest)
# Just rotate the exposed key in the service provider
```

---

## 📝 **Environment File Setup**

### **Mobile Apps**

1. **Copy the example file:**
   ```bash
   cd apps/mobile_client
   cp .env.example .env
   ```

2. **Edit `.env` with your real values:**
   ```env
   API_BASE_URL=http://10.0.2.2:4000
   SOCKET_URL=http://10.0.2.2:5000
   GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_KEY_HERE
   ```

3. **Verify `.env` is in `.gitignore`:**
   ```bash
   git check-ignore .env
   # Should output: .env
   ```

### **Backend**

Backend uses environment variables directly (no `.env` files in repo):
- Set in CI/CD secrets
- Set in production environment
- Use `.env.example` for local development reference

---

## 🔑 **API Key Restrictions**

### **Google Maps API Key**

1. **Go to**: https://console.cloud.google.com/google/maps-apis/credentials

2. **Restrict by:**
   - **Application restrictions**: 
     - Android apps: Package name + SHA-1 fingerprint
     - iOS apps: Bundle identifier
   - **API restrictions**: 
     - Maps SDK for Android
     - Maps SDK for iOS
     - Geocoding API
     - Directions API
     - Distance Matrix API

3. **Monitor usage** in Google Cloud Console

---

## 🔍 **Pre-commit Checks**

### **Git Hooks (Recommended)**

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
# Check for potential secrets in staged files

# Check for Google Maps API keys
if git diff --cached | grep -q "AIza[0-9A-Za-z_-]\{35\}"; then
    echo "❌ ERROR: Potential Google Maps API key detected!"
    echo "Remove the key from the file before committing."
    exit 1
fi

# Check for other common patterns
if git diff --cached | grep -qE "(sk_live_|pk_live_|AIza|AKIA[0-9A-Z]{16})"; then
    echo "❌ ERROR: Potential secret detected!"
    exit 1
fi

exit 0
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

---

## 🚨 **If You Leak a Secret**

### **Immediate Actions:**

1. **Rotate the key** in the service provider console
2. **Remove from git history** (if possible)
3. **Notify team** if shared repository
4. **Review access logs** in service provider
5. **Update documentation** to remove references

### **For Google Maps API:**

1. Go to: https://console.cloud.google.com/google/maps-apis/credentials
2. Delete or restrict the exposed key
3. Create a new key with proper restrictions
4. Update all apps with the new key

---

## 📋 **Checklist**

Before committing:

- [ ] No `.env` files staged
- [ ] No API keys in code
- [ ] No API keys in documentation
- [ ] `.env.example` uses placeholders
- [ ] All secrets in `.gitignore`
- [ ] Pre-commit hooks installed (optional but recommended)

---

## 🔐 **CI/CD Secrets**

For production, use GitHub Secrets:

1. Go to: Repository → Settings → Secrets and variables → Actions
2. Add secrets:
   - `GOOGLE_MAPS_API_KEY`
   - `FIREBASE_SERVICE_ACCOUNT`
   - `JWT_SECRET`
   - etc.

3. Use in workflows:
   ```yaml
   env:
     GOOGLE_MAPS_API_KEY: ${{ secrets.GOOGLE_MAPS_API_KEY }}
   ```

---

## 📚 **Resources**

- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Google Cloud: API Key Security](https://cloud.google.com/docs/authentication/api-keys)
- [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

**Remember**: When in doubt, rotate the key! 🔄

