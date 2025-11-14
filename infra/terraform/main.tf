locals {
  environment = "production"
  common_tags = [
    "taxi-platform",
    local.environment,
  ]
}

resource "digitalocean_project" "platform" {
  name        = "${var.project_name}-project"
  description = "Taxi platform infrastructure"
  purpose     = "Web Application"
  environment = local.environment
}

resource "digitalocean_vpc" "main" {
  name     = "${var.project_name}-vpc"
  region   = var.region
  ip_range = "10.20.0.0/20"
}

resource "digitalocean_tag" "api" {
  name = "${var.project_name}-api"
}

resource "digitalocean_tag" "realtime" {
  name = "${var.project_name}-realtime"
}

resource "digitalocean_droplet" "api" {
  name       = "${var.project_name}-api"
  region     = var.region
  size       = var.droplet_size
  image      = "ubuntu-24-04-x64"
  vpc_uuid   = digitalocean_vpc.main.id
  ssh_keys   = var.ssh_key_ids
  monitoring = true
  tags       = concat(local.common_tags, [digitalocean_tag.api.id])

  ipv6       = true
  backups    = false

  user_data = <<-EOT
              #cloud-config
              package_update: true
              runcmd:
                - echo "TODO: configure docker + deploy backend service"
              EOT
}

resource "digitalocean_droplet" "realtime" {
  name       = "${var.project_name}-realtime"
  region     = var.region
  size       = var.droplet_size
  image      = "ubuntu-24-04-x64"
  vpc_uuid   = digitalocean_vpc.main.id
  ssh_keys   = var.ssh_key_ids
  monitoring = true
  tags       = concat(local.common_tags, [digitalocean_tag.realtime.id])
  ipv6       = true
  backups    = false

  user_data = <<-EOT
              #cloud-config
              package_update: true
              runcmd:
                - echo "TODO: configure docker + deploy realtime service"
              EOT
}

resource "digitalocean_database_cluster" "postgres" {
  name       = "${var.project_name}-pg"
  engine     = "pg"
  version    = "16"
  size       = var.db_size
  region     = var.region
  node_count = 1
  tags       = local.common_tags
}

resource "digitalocean_database_cluster" "redis" {
  name       = "${var.project_name}-redis"
  engine     = "redis"
  version    = "7"
  size       = var.redis_size
  region     = var.region
  node_count = 1
  tags       = local.common_tags
}

resource "digitalocean_database_firewall" "postgres" {
  cluster_id = digitalocean_database_cluster.postgres.id

  droplet_ids = [
    digitalocean_droplet.api.id,
    digitalocean_droplet.realtime.id,
  ]
}

resource "digitalocean_database_firewall" "redis" {
  cluster_id = digitalocean_database_cluster.redis.id

  droplet_ids = [
    digitalocean_droplet.api.id,
    digitalocean_droplet.realtime.id,
  ]
}

resource "digitalocean_project_resources" "project_resources" {
  project = digitalocean_project.platform.id
  resources = [
    digitalocean_droplet.api.urn,
    digitalocean_droplet.realtime.urn,
    digitalocean_database_cluster.postgres.urn,
    digitalocean_database_cluster.redis.urn,
  ]
}

