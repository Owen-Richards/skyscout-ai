#
# SkyScout AI - Environment-Specific Terraform Configuration
# Staging Environment
#

environment = "staging"
aws_region  = "us-east-1"

# Networking
vpc_cidr = "10.1.0.0/16"

# EKS Configuration
kubernetes_version = "1.28"
node_group_instance_types = ["t3.large", "t3.xlarge"]

node_group_scaling_config = {
  desired_size = 3
  max_size     = 8
  min_size     = 2
}

# Database Configuration
rds_instance_class               = "db.t3.small"
rds_allocated_storage           = 20
rds_max_allocated_storage       = 100
rds_engine_version              = "15.4"
rds_backup_retention_period     = 7
rds_backup_window              = "03:00-04:00"
rds_maintenance_window         = "sun:04:00-sun:05:00"

# Cache Configuration
redis_node_type        = "cache.t3.small"
redis_engine_version   = "7.0"

# Security
enable_encryption = true
kms_deletion_window = 7

# Monitoring
enable_container_insights = true
log_retention_days       = 14
enable_enhanced_monitoring = true
monitoring_interval = 60
performance_insights_enabled = true
performance_insights_retention_period = 7

# Domain & SSL
domain_name = "skyscout.ai"
# Will create staging.skyscout.ai automatically

# ECR Configuration (shares production ECR)
ecr_repositories = [
  "skyscout-web",
  "skyscout-api",
  "skyscout-auth-service",
  "skyscout-flight-aggregation-service",
  "skyscout-search-engine",
  "skyscout-ml-service"
]

enable_image_scanning = true

# Feature Flags
enable_nat_gateway = true
single_nat_gateway = false
enable_flow_logs   = true

# Cost Management
enable_cost_allocation_tags = true
budget_limit     = 800
budget_threshold = 75

# Additional Tags
additional_tags = {
  CostCenter      = "Engineering"
  Owner          = "SkyScout Team"
  BusinessUnit   = "Flight Discovery"
  DataClassification = "Internal"
  TestEnvironment = "true"
}
