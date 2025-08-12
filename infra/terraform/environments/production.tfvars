#
# SkyScout AI - Environment-Specific Terraform Configuration
# Production Environment
#

environment = "production"
aws_region  = "us-east-1"

# Networking
vpc_cidr = "10.0.0.0/16"

# EKS Configuration
kubernetes_version = "1.28"
node_group_instance_types = ["m5.large", "m5.xlarge", "c5.large"]

node_group_scaling_config = {
  desired_size = 5
  max_size     = 50
  min_size     = 3
}

# Database Configuration
rds_instance_class               = "db.r5.large"
rds_allocated_storage           = 100
rds_max_allocated_storage       = 1000
rds_engine_version              = "15.4"
rds_backup_retention_period     = 30
rds_backup_window              = "03:00-04:00"
rds_maintenance_window         = "sun:04:00-sun:06:00"

# Cache Configuration
redis_node_type        = "cache.r5.large"
redis_engine_version   = "7.0"

# Security
enable_encryption = true
kms_deletion_window = 30

# Monitoring
enable_container_insights = true
log_retention_days       = 30
enable_enhanced_monitoring = true
monitoring_interval = 60
performance_insights_enabled = true
performance_insights_retention_period = 14

# Domain & SSL
domain_name = "skyscout.ai"
# certificate_arn = "arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/CERTIFICATE_ID"

# ECR Configuration
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
budget_limit     = 2000
budget_threshold = 80

# Additional Tags
additional_tags = {
  CostCenter      = "Engineering"
  Owner          = "SkyScout Team"
  BusinessUnit   = "Flight Discovery"
  DataClassification = "Internal"
  Compliance     = "SOC2"
}
