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

