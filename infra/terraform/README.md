# Terraform Deployment (DigitalOcean)

## Prerequisites

- Terraform ≥ 1.6
- DigitalOcean API token with write permissions
- SSH key uploaded to DigitalOcean (capture the ID or fingerprint)

## Setup

1. Export the token:
   ```bash
   export DIGITALOCEAN_TOKEN=xxxxxxxx
   ```

2. Create a `secrets.tfvars` file:
   ```hcl
   do_token     = "xxxxxxxx"
   project_name = "taxi-platform"
   region       = "fra1"
   ssh_key_ids  = ["123456", "789012"]
   ```

3. Initialize and review:
   ```bash
   terraform init
   terraform plan -var-file=secrets.tfvars
   ```

4. Apply to provision:
   ```bash
   terraform apply -var-file=secrets.tfvars
   ```

## Resources

- VPC and tagging for environment isolation
- Droplets for API and realtime services (Ubuntu 24.04 base, ready for Docker installs)
- Managed Postgres + Redis clusters with firewalls limited to the droplets
- Project association for DigitalOcean UI organization

> Customize droplet sizes, regions, and user data scripts before running in production.

