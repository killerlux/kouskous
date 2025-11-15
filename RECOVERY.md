# 🚨 Recovery Instructions - Terminal Session Corrupted

**Status:** Terminal session corrupted after disk space exhaustion. Manual intervention required.

## ✅ What's Already Done

1. **Database Setup**: ✅ Complete
   - PostgreSQL 16 + PostGIS on port `15432`
   - Redis 7 on port `16379`
   - Migrations generated and run successfully
   - `driver_balances_mv` materialized view created
   - `refresh_driver_balances()` function created

2. **Docker Fixes**: ⚠️ Modified but not committed
   - Fixed `apps/backend/Dockerfile` - correct dist path
   - Fixed `apps/realtime/Dockerfile` - correct dist path
   - Changed compose ports to avoid conflicts (15432, 16379)

3. **Files Modified (unsaved)**:
   - `apps/backend/Dockerfile` (line 26)
   - `apps/realtime/Dockerfile` (line 25)
   - `infra/docker-compose.dev.yml` (ports updated)
   - `apps/backend/src/data-source.ts` (created)
   - Migration: `apps/backend/src/migrations/1763230348357-InitialSchema.ts`

## 🔧 Manual Steps to Complete

### Step 1: Save Modified Files
In Cursor, save or accept all pending changes to:
- `apps/backend/Dockerfile`
- `apps/realtime/Dockerfile`

### Step 2: Open a NEW Terminal
Close the current terminal tab in Cursor and open a fresh one, or use your system terminal.

### Step 3: Run the Auto-Fix Script
```bash
cd /home/aymen/Téléchargements/uber
chmod +x scripts/fix-and-start.sh
./scripts/fix-and-start.sh
```

**OR** run manually:

```bash
cd /home/aymen/Téléchargements/uber

# 1. Commit changes
git add -A
git commit -m "fix(docker): correct dist paths and complete dev environment setup"
git push origin main

# 2. Stop old containers
docker compose -f infra/docker-compose.dev.yml down

# 3. Build services
docker compose -f infra/docker-compose.dev.yml build

# 4. Start everything
docker compose -f infra/docker-compose.dev.yml up -d

# 5. Wait and check
sleep 15
docker compose -f infra/docker-compose.dev.yml ps

# 6. Test health
curl http://localhost:3000/health
curl http://localhost:3001/health

# 7. Check logs if needed
docker compose -f infra/docker-compose.dev.yml logs backend
docker compose -f infra/docker-compose.dev.yml logs realtime
```

### Step 4: Start Admin Web UI
```bash
cd /home/aymen/Téléchargements/uber/apps/admin
pnpm dev
```

Open: http://localhost:3002

## 🎯 Expected Results

After running the above:
- ✅ PostgreSQL running on `localhost:15432`
- ✅ Redis running on `localhost:16379`
- ✅ Backend API on `http://localhost:3000` (health endpoint: `/health`)
- ✅ Realtime Socket.IO on `http://localhost:3001`
- ✅ Admin Web UI on `http://localhost:3002`

## 🐛 If Services Fail to Start

Check logs:
```bash
docker compose -f infra/docker-compose.dev.yml logs --tail=50 backend
docker compose -f infra/docker-compose.dev.yml logs --tail=50 realtime
```

Common issues:
1. **Port conflicts**: Another service using 3000, 3001, 15432, or 16379
2. **Build errors**: Check Dockerfile paths are correct
3. **Database connection**: Ensure DATABASE_URL uses `localhost:15432`

## 📝 Next Steps After Recovery

1. Test backend endpoints:
   ```bash
   curl http://localhost:3000/health
   curl http://localhost:3000/api/auth/health
   ```

2. Test Admin UI login flow

3. Proceed to DigitalOcean deployment when local testing passes

---

**Created:** 2025-11-15
**Last Updated:** Terminal corruption after disk space exhaustion

