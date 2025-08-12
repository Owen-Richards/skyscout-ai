#
# SkyScout AI - Environment-Specific Terraform Configuration
# Development Environment
#

environment = "development"
aws_region  = "us-east-1"

# Networking
vpc_cidr = "10.2.0.0/16"

# EKS Configuration
kubernetes_version = "1.28"
node_group_instance_types = ["t3.medium", "t3.large"]

node_group_scaling_config = {
  desired_size = 2
  max_size     = 5
  min_size     = 1
}

# Database Configuration
rds_instance_class               = "db.t3.micro"
rds_allocated_storage           = 20
rds_max_allocated_storage       = 50
rds_engine_version              = "15.4"
rds_backup_retention_period     = 3
rds_backup_window              = "03:00-04:00"
rds_maintenance_window         = "sun:04:00-sun:05:00"

# Cache Configuration
redis_node_type        = "cache.t3.micro"
redis_engine_version   = "7.0"

# Security
enable_encryption = false  # Cost optimization for dev
kms_deletion_window = 7

# Monitoring
enable_container_insights = false  # Cost optimization for dev
log_retention_days       = 7
enable_enhanced_monitoring = false
monitoring_interval = 0
performance_insights_enabled = false
performance_insights_retention_period = 7

# Domain & SSL
domain_name = "skyscout.ai"
# Will create development.skyscout.ai automatically

# ECR Configuration (shares production ECR)
ecr_repositories = [
  "skyscout-web",
  "skyscout-api",
  "skyscout-auth-service",
  "skyscout-flight-aggregation-service",
  "skyscout-search-engine",
  "skyscout-ml-service"
]

enable_image_scanning = false  # Cost optimization for dev

# Feature Flags
enable_nat_gateway = true
single_nat_gateway = true   # Cost optimization - single NAT Gateway
enable_flow_logs   = false  # Cost optimization for dev

# Cost Management
enable_cost_allocation_tags = true
budget_limit     = 300
budget_threshold = 70

# Additional Tags
additional_tags = {
  CostCenter      = "Engineering"
  Owner          = "SkyScout Team"
  BusinessUnit   = "Flight Discovery"
  DataClassification = "Internal"
  TestEnvironment = "true"
  AutoShutdown   = "true"
}
