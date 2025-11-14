# Deploy Runbook — Taxi Platform
_Last updated: 2025-11-14_

## Environments
- **Production**: DigitalOcean droplets (`api`, `realtime`), managed Postgres/Redis, Cloudflare proxy.
- **Staging**: Same topology, smaller size.

## Prerequisites
1. GitHub secrets configured:
   - `PROD_HOST`
   - `PROD_SSH_USER`
   - `PROD_SSH_KEY` (private key with ssh access)
   - `GHCR_PAT` (token with `read:packages`)
2. Remote server prepared:
   ```bash
   sudo mkdir -p /opt/taxi && sudo chown $USER:$USER /opt/taxi
   cd /opt/taxi
   cp prod.env.example prod.env   # fill actual secrets
   ```
3. Docker + docker-compose plugin installed on droplet.
4. DNS (Cloudflare) pointing to reverse proxy pointing at droplet(s).

## Deployment Pipeline
1. Merge to `main` → `Docker Build` workflow builds/pushes `ghcr.io/<repo>/{backend,realtime,admin}:main`.
2. Trigger **Deploy** workflow (manual `workflow_dispatch` with environment=production).
3. Workflow steps:
   - Copies `infra/docker-compose.prod.yml` into `/opt/taxi`.
   - SSH into host, `docker login ghcr`, `docker compose pull`, `docker compose up -d --remove-orphans`.
   - Prunes dangling images.
4. Verify health:
   - `docker compose ps`
   - `curl https://api.example.com/health`
   - Check Grafana dashboard & Alertmanager.

## Rollback
1. On server:
   ```bash
   cd /opt/taxi
   git pull  # if storing compose in git
   docker compose -f docker-compose.prod.yml --env-file prod.env pull backend:previous_tag
   docker compose -f docker-compose.prod.yml --env-file prod.env up -d backend=previous_tag
   ```
2. If DB migration failed:
   ```bash
   pnpm migration:revert  # run once
   ```

## Smoke Checklist post-deploy
- [ ] API `/health` returns `ok`.
- [ ] Realtime namespace accepts connections.
- [ ] Admin dashboard loads + login works.
- [ ] Sample ride request flows from staging mobile build.
- [ ] Observability dashboards green (CPU, memory, latency).
- [ ] No alerts in Alertmanager.

## Incident Contacts
- Backend on-call: @backend-lead
- Realtime on-call: @realtime-lead
- DevOps: @devops-lead
- Security: @security-lead

