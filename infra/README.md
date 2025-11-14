# Infrastructure

## Local development

1. Copy the example env file and adjust secrets as needed:
   ```bash
   cp infra/env.example infra/.env
   ```
2. Launch the stack:
   ```bash
   docker compose -f infra/docker-compose.dev.yml --env-file infra/.env up --build
   ```
3. Services:
   - API → http://localhost:4000
   - Realtime → http://localhost:4001
   - Admin → http://localhost:3000
   - Postgres/PostGIS → localhost:5432
   - Redis → localhost:6379

## Production / staging compose

Use `infra/docker-compose.prod.yml` together with `infra/prod.env` (create it from `prod.env.example`). Example:

```bash
scp infra/docker-compose.prod.yml user@host:/opt/taxi/
scp infra/prod.env user@host:/opt/taxi/
ssh user@host "
  cd /opt/taxi &&
  docker login ghcr.io -u <user> -p <token> &&
  docker compose -f docker-compose.prod.yml --env-file prod.env pull &&
  docker compose -f docker-compose.prod.yml --env-file prod.env up -d
"
```

Default images expect the Docker build workflow to push to `ghcr.io/<owner>/<repo>/<service>:main`.

## Terraform deployment (DigitalOcean)

1. Create a `.tfvars` file (see `terraform/README.md`) and export `DIGITALOCEAN_TOKEN`.
2. Initialize and plan:
   ```bash
   cd infra/terraform
   terraform init
   terraform plan -var-file=secrets.tfvars
   ```
3. Apply when ready:
   ```bash
   terraform apply -var-file=secrets.tfvars
   ```

> The Terraform configuration creates: managed Postgres + Redis clusters, tagged droplets for the API and realtime services, and networking resources following the architecture doc. Customize sizes/regions before applying to production.

## Deployment workflow

- `.github/workflows/docker-build.yml` builds/pushes images to GHCR.
- `.github/workflows/deploy.yml` (manual trigger) copies `docker-compose.prod.yml` to the server and runs `docker compose pull && up -d`. Requires secrets:
  - `PROD_HOST`
  - `PROD_SSH_USER`
  - `PROD_SSH_KEY`
  - `GHCR_PAT` (token with `read:packages`)

Refer to `/docs/runbooks/deploy.md` for detailed rollout/rollback steps.

