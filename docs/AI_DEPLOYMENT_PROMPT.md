# AI Agent Deployment Prompt for DigitalOcean

**⚠️ SECURITY NOTICE**: Never include actual API tokens in this file or git commits!

---

## 🤖 Autonomous Deployment Prompt

Copy and use this prompt with an AI agent (Claude, GPT-4, or Cursor Agent Mode) to deploy the entire taxi platform to DigitalOcean without manual intervention.

---

### **PROMPT START** ⬇️

```
You are an expert DevOps engineer deploying a production-grade taxi platform monorepo to DigitalOcean.

PROJECT CONTEXT:
- Monorepo: Backend (NestJS), Realtime (Socket.IO), Admin Web (Next.js)
- Stack: Node 20, PostgreSQL 16 + PostGIS, Redis 7, Docker
- Location: /home/aymen/Téléchargements/uber
- Git: https://github.com/killerlux/kouskous
- Infrastructure: Terraform (DigitalOcean) at /infra/terraform/
- Documentation: /docs/DEPLOYMENT_READINESS.md (follow this exactly)

DEPLOYMENT REQUIREMENTS:
1. Deploy to DigitalOcean using Terraform
2. Region: Frankfurt (fra1) - closest to Tunisia
3. Resources: 2 droplets (API + Realtime), managed Postgres + Redis
4. Follow ALL cursor rules in .cursorrules
5. Use conventional commits (feat/fix/docs/chore)
6. NEVER commit secrets or API tokens to git
7. Test health endpoints after deployment
8. Document every step with git commits

SECRETS PROVIDED (DO NOT COMMIT):
- DIGITALOCEAN_TOKEN: [REPLACE_WITH_ACTUAL_TOKEN]
- JWT_SECRET: [GENERATE_WITH: openssl rand -base64 32]
- JWT_REFRESH_SECRET: [GENERATE_WITH: openssl rand -base64 32]
- FIREBASE_SERVICE_ACCOUNT: [GET_FROM_FIREBASE_CONSOLE]
- GOOGLE_MAPS_API_KEY: [GET_FROM_GOOGLE_CLOUD]

DEPLOYMENT PHASES (Execute Sequentially):

PHASE 1: PRE-DEPLOYMENT VALIDATION
- [ ] Verify all tests pass: pnpm test
- [ ] Verify all builds pass: pnpm --filter @taxi/backend build
- [ ] Verify Docker images build: docker build -f apps/backend/Dockerfile .
- [ ] Check for uncommitted changes: git status
- [ ] Verify .gitignore includes secrets files

PHASE 2: GENERATE SECRETS (LOCALLY, DO NOT COMMIT)
- [ ] Generate JWT_SECRET: openssl rand -base64 32
- [ ] Generate JWT_REFRESH_SECRET: openssl rand -base64 32
- [ ] Create /infra/.env.production (add to .gitignore if not already)
- [ ] Store secrets securely (DO NOT echo to terminal)

PHASE 3: TERRAFORM DEPLOYMENT
- [ ] cd infra/terraform
- [ ] Create secrets.tfvars (DO NOT COMMIT):
  ```hcl
  project_name = "taxi-platform"
  region       = "fra1"
  ssh_key_ids  = ["YOUR_SSH_KEY_ID"]  # Get from: doctl compute ssh-key list
  droplet_size = "s-2vcpu-4gb"
  db_size      = "db-s-1vcpu-1gb"
  redis_size   = "db-s-1vcpu-1gb"
  ```
- [ ] Export DIGITALOCEAN_TOKEN (use provided token)
- [ ] terraform init
- [ ] terraform plan -var-file=secrets.tfvars -out=tfplan
- [ ] Review plan output (must show 2 droplets + 2 DB clusters)
- [ ] terraform apply tfplan
- [ ] Save outputs: terraform output -json > ../terraform-outputs.json
- [ ] Commit terraform state (if using remote state): git add terraform.tfstate && git commit -m "chore(infra): terraform state after initial deployment"

PHASE 4: SERVER SETUP (API DROPLET)
- [ ] Extract API droplet IP from terraform-outputs.json
- [ ] SSH into droplet: ssh root@API_DROPLET_IP
- [ ] Install Docker: curl -fsSL https://get.docker.com | sh
- [ ] Install Docker Compose: apt-get install -y docker-compose-plugin
- [ ] Verify: docker --version && docker compose version
- [ ] Create directory: mkdir -p /opt/taxi && cd /opt/taxi
- [ ] Install pnpm: curl -fsSL https://get.pnpm.io/install.sh | sh
- [ ] Source profile: source ~/.bashrc
- [ ] Login to GHCR: docker login ghcr.io -u USERNAME -p GH_TOKEN
  (Get GitHub token with read:packages scope)

PHASE 5: SERVER SETUP (REALTIME DROPLET)
- [ ] Extract Realtime droplet IP from terraform-outputs.json
- [ ] SSH into droplet: ssh root@REALTIME_DROPLET_IP
- [ ] Install Docker: curl -fsSL https://get.docker.com | sh
- [ ] Install Docker Compose: apt-get install -y docker-compose-plugin
- [ ] Create directory: mkdir -p /opt/taxi && cd /opt/taxi
- [ ] Login to GHCR: docker login ghcr.io -u USERNAME -p GH_TOKEN

PHASE 6: DATABASE SETUP
- [ ] Extract Postgres connection string from terraform-outputs.json
- [ ] SSH into API droplet
- [ ] Install PostgreSQL client: apt-get update && apt-get install -y postgresql-client
- [ ] Test connection: psql $DATABASE_URL -c "SELECT version();"
- [ ] Enable PostGIS: psql $DATABASE_URL -c "CREATE EXTENSION IF NOT EXISTS postgis;"
- [ ] Clone repo temporarily: git clone https://github.com/killerlux/kouskous.git /tmp/taxi
- [ ] cd /tmp/taxi/apps/backend
- [ ] Install dependencies: pnpm install --frozen-lockfile
- [ ] Run migrations: pnpm migration:run
- [ ] Verify tables: psql $DATABASE_URL -c "\dt"
- [ ] Clean up: rm -rf /tmp/taxi

PHASE 7: DEPLOY APPLICATIONS
- [ ] Create /opt/taxi/prod.env on API droplet (DO NOT COMMIT):
  ```env
  NODE_ENV=production
  DATABASE_URL=[FROM_TERRAFORM_OUTPUT]
  REDIS_URL=[FROM_TERRAFORM_OUTPUT]
  JWT_SECRET=[GENERATED_EARLIER]
  JWT_REFRESH_SECRET=[GENERATED_EARLIER]
  JWT_EXPIRES_IN=15m
  JWT_REFRESH_EXPIRES_IN=7d
  FIREBASE_SERVICE_ACCOUNT=[JSON_MINIFIED]
  GOOGLE_MAPS_API_KEY=[YOUR_KEY]
  BACKEND_PORT=3000
  REALTIME_PORT=3001
  ADMIN_PORT=3002
  NEXT_PUBLIC_API_URL=http://API_DROPLET_IP:3000
  ```
- [ ] Secure file: chmod 600 /opt/taxi/prod.env
- [ ] Copy docker-compose.prod.yml to droplet:
  scp infra/docker-compose.prod.yml root@API_DROPLET_IP:/opt/taxi/
- [ ] On droplet: cd /opt/taxi
- [ ] Pull images: docker compose -f docker-compose.prod.yml --env-file prod.env pull
- [ ] Start services: docker compose -f docker-compose.prod.yml --env-file prod.env up -d
- [ ] Check status: docker compose -f docker-compose.prod.yml ps
- [ ] Check logs: docker compose -f docker-compose.prod.yml logs -f --tail=50

PHASE 8: VERIFICATION
- [ ] Test backend health: curl http://API_DROPLET_IP:3000/health
  Expected: {"ok":true,"database":"up","redis":"up"}
- [ ] Test admin web: curl http://API_DROPLET_IP:3002
  Expected: HTTP 200 with HTML
- [ ] Test realtime: curl http://REALTIME_DROPLET_IP:3001/health
- [ ] Check database connection:
  psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
- [ ] Check Redis connection:
  redis-cli -u $REDIS_URL ping
- [ ] View Docker logs for errors:
  docker compose -f docker-compose.prod.yml logs --tail=100

PHASE 9: SECURITY HARDENING
- [ ] Setup UFW firewall on both droplets:
  ```bash
  ufw allow 22/tcp
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw allow 3000/tcp  # API
  ufw allow 3001/tcp  # Realtime
  ufw allow 3002/tcp  # Admin
  ufw enable
  ```
- [ ] Enable automatic security updates:
  ```bash
  apt-get install -y unattended-upgrades
  dpkg-reconfigure -plow unattended-upgrades
  ```
- [ ] Create non-root user (optional but recommended):
  ```bash
  adduser deploy
  usermod -aG docker deploy
  usermod -aG sudo deploy
  ```

PHASE 10: DOCUMENTATION & GIT
- [ ] Create deployment log in /docs/deployments/YYYY-MM-DD.md
- [ ] Document:
  - Droplet IPs (public)
  - Database cluster ID
  - Redis cluster ID
  - Deployment time
  - Version deployed (git commit SHA)
  - Any issues encountered
- [ ] Commit deployment log:
  git add docs/deployments/
  git commit -m "docs: deployment log for $(date +%Y-%m-%d)"
  git push origin main
- [ ] Tag release:
  git tag -a v1.0.0-prod -m "Production deployment v1.0.0"
  git push origin v1.0.0-prod

PHASE 11: POST-DEPLOYMENT MONITORING
- [ ] Setup DigitalOcean monitoring alerts:
  - CPU > 80% for 5 minutes
  - Memory > 90% for 5 minutes
  - Disk > 85%
- [ ] Test full user flow:
  1. Visit http://API_DROPLET_IP:3002/fr/login
  2. Try phone OTP login (will fail without Firebase, but should show UI)
  3. Check admin dashboard loads
- [ ] Create backup script (optional):
  ```bash
  #!/bin/bash
  # /opt/taxi/backup.sh
  DATE=$(date +%Y%m%d_%H%M%S)
  pg_dump $DATABASE_URL > /opt/taxi/backups/db_$DATE.sql
  gzip /opt/taxi/backups/db_$DATE.sql
  # Keep last 7 days
  find /opt/taxi/backups/ -name "db_*.sql.gz" -mtime +7 -delete
  ```
- [ ] Setup cron for daily backups: crontab -e
  ```
  0 2 * * * /opt/taxi/backup.sh
  ```

ERROR HANDLING:
- If Terraform apply fails: Check DIGITALOCEAN_TOKEN is valid
- If Docker pull fails: Verify GHCR authentication
- If migrations fail: Check DATABASE_URL is correct
- If health check fails: Check logs with `docker compose logs`
- If port not accessible: Check UFW rules and DigitalOcean firewall
- If out of memory: Upgrade droplet size in terraform vars

SUCCESS CRITERIA:
✅ All Terraform resources created
✅ All Docker containers running (docker compose ps shows "Up")
✅ Health endpoints return 200 OK
✅ Database has tables (migrations ran successfully)
✅ Admin UI loads in browser
✅ No errors in Docker logs
✅ All commits follow conventional commits
✅ No secrets committed to git
✅ Deployment documented

COMMIT GUIDELINES (FOLLOW STRICTLY):
- Use conventional commits: feat/fix/chore/docs
- Commit after each phase completion
- Example commits:
  ✅ "chore(infra): provision DigitalOcean resources via Terraform"
  ✅ "feat(deploy): deploy backend and admin to production"
  ✅ "docs: add deployment logs and production IPs"
  ❌ "deployed stuff"
  ❌ "fix" (too vague)

SECURITY RULES (CRITICAL):
🔴 NEVER commit these files/patterns:
- secrets.tfvars
- prod.env
- .env.production
- terraform-outputs.json (contains IPs/passwords)
- **/secret*
- **/*key*
- **/*token*

✅ Verify .gitignore includes:
*.tfvars
*.env
prod.env
.env.production
terraform-outputs.json
*-outputs.json

GIT STATUS CHECK (Before each commit):
git status --ignored | grep -E "(secret|key|token|\.env|tfvars)"
# If this returns anything, DO NOT COMMIT

FINAL OUTPUT:
When complete, provide:
1. Summary of all phases completed ✅
2. Droplet IPs (API and Realtime)
3. Health check results
4. List of git commits made
5. Cost estimate based on deployed resources
6. Next steps for domain/SSL setup

BEGIN DEPLOYMENT NOW.
```

### **PROMPT END** ⬆️

---

## 📝 **How to Use This Prompt**

### **Option 1: With Cursor Agent Mode** (Recommended)

1. **Setup DigitalOcean MCP** (from video):
   ```bash
   # In Cursor: Settings → MCP → Add Server
   # Paste this config:
   {
     "mcpServers": {
       "digitalocean": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-digitalocean"],
         "env": {
           "DIGITALOCEAN_API_TOKEN": "dop_v1_YOUR_NEW_TOKEN_HERE"
         }
       }
     }
   }
   ```

2. **Open Cursor Agent** (Cmd+L or Ctrl+L)

3. **Paste the full prompt above**

4. **Let it run autonomously** (monitor progress)

### **Option 2: With Claude/GPT-4** (Manual Steps)

1. Copy the prompt above
2. Paste in Claude/ChatGPT
3. Follow the agent's instructions step-by-step
4. Execute commands it provides

### **Option 3: Manual Execution** (Most Control)

1. Follow `/docs/DEPLOYMENT_READINESS.md` manually
2. Use the prompt as a checklist
3. Execute each phase yourself

---

## 🔒 **CRITICAL: Secret Management**

**DO THIS FIRST** before any deployment:

```bash
# Add to .gitignore if not already there
echo "secrets.tfvars" >> .gitignore
echo "prod.env" >> .gitignore
echo ".env.production" >> .gitignore
echo "terraform-outputs.json" >> .gitignore
echo "*-outputs.json" >> .gitignore

# Commit the updated .gitignore
git add .gitignore
git commit -m "chore: ensure secrets are never committed"
git push origin main
```

---

## ⚠️ **Before Running the Prompt**

### **Checklist:**

- [ ] ✅ Revoked the compromised API token
- [ ] ✅ Generated a new DigitalOcean token
- [ ] ✅ Updated .gitignore for secrets
- [ ] ✅ Committed .gitignore changes
- [ ] ✅ Have GitHub Personal Access Token ready (for GHCR)
- [ ] ✅ Have Firebase service account JSON ready
- [ ] ✅ Have Google Maps API key ready
- [ ] ✅ Backed up current code: `git push origin main`
- [ ] ✅ All tests passing: `pnpm test`
- [ ] ✅ Ready to spend ~$131/month on DigitalOcean

---

## 💡 **My Final Recommendation**

Based on my expert analysis, here's what you should do **RIGHT NOW**:

### **TODAY (1 hour):**
```bash
# 1. Test locally first
cd /home/aymen/Téléchargements/uber
cp infra/env.example infra/.env

# Edit .env with test values (I'll help)

# 2. Start the stack
docker compose -f infra/docker-compose.dev.yml up --build

# 3. Test everything works
# - Backend: http://localhost:3000/health
# - Admin: http://localhost:3001
# - Realtime: http://localhost:3002
```

### **TOMORROW (3-4 hours):**
```bash
# 1. Revoke old token, get new one
# 2. Use the AI deployment prompt above
# 3. Deploy to DigitalOcean
# 4. Verify everything works
```

**This approach is safer, faster, and cheaper than deploying directly to production without testing.**

---

**Want me to help you with local testing RIGHT NOW?** I can walk you through setting up `docker-compose.dev.yml` and testing the full stack locally before we touch DigitalOcean.

🎯 **What's your choice?**
1. **Test locally first** (my recommendation) 🟢
2. **Deploy directly with AI agent** (riskier) 🟡
3. **Do both in parallel** (test locally while I prepare deployment) 🔵

Let me know! 🚀

