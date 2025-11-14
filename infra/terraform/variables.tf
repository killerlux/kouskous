variable "do_token" {
  description = "DigitalOcean API token"
  type        = string
  sensitive   = true
}

variable "project_name" {
  description = "Prefix for created resources"
  type        = string
  default     = "taxi-platform"
}

variable "region" {
  description = "DigitalOcean region slug"
  type        = string
  default     = "fra1"
}

variable "droplet_size" {
  description = "Droplet size slug for API/Realtime nodes"
  type        = string
  default     = "s-2vcpu-4gb"
}

variable "ssh_key_ids" {
  description = "List of SSH key IDs (or fingerprints) to inject into droplets"
  type        = list(string)
  default     = []
}

variable "db_size" {
  description = "Managed Postgres size slug"
  type        = string
  default     = "db-s-2vcpu-4gb"
}

variable "redis_size" {
  description = "Managed Redis size slug"
  type        = string
  default     = "redis-s-1vcpu-1gb"
}

