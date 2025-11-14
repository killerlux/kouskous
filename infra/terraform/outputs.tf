output "api_ipv4" {
  description = "Public IPv4 for the API droplet"
  value       = digitalocean_droplet.api.ipv4_address
}

output "realtime_ipv4" {
  description = "Public IPv4 for the realtime droplet"
  value       = digitalocean_droplet.realtime.ipv4_address
}

output "postgres_connection_uri" {
  description = "Managed Postgres connection string"
  value       = digitalocean_database_cluster.postgres.uri
  sensitive   = true
}

output "redis_connection_uri" {
  description = "Managed Redis connection string"
  value       = digitalocean_database_cluster.redis.uri
  sensitive   = true
}

