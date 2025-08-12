#
# SkyScout AI - Terraform Variables
# Multi-Environment Configuration
#

#
# ═══════════════════════════════════════════════════════════════
# 🌍 ENVIRONMENT CONFIGURATION
# ═══════════════════════════════════════════════════════════════
#

variable "environment" {
  description = "Environment name (development, staging, production)"
  type        = string
  validation {
    condition = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment must be one of: development, staging, production."
  }
}

variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "skyscout-ai"
}

#
# ═══════════════════════════════════════════════════════════════
# 🌐 NETWORKING VARIABLES
# ═══════════════════════════════════════════════════════════════
#

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

#
# ═══════════════════════════════════════════════════════════════
# ☸️ KUBERNETES VARIABLES
# ═══════════════════════════════════════════════════════════════
#

variable "kubernetes_version" {
  description = "Kubernetes version for EKS cluster"
  type        = string
  default     = "1.28"
}

variable "node_group_instance_types" {
  description = "Instance types for EKS node group"
  type        = list(string)
  default     = ["t3.medium", "t3.large"]
}

variable "node_group_scaling_config" {
  description = "Scaling configuration for EKS node group"
  type = object({
    desired_size = number
    max_size     = number
    min_size     = number
  })
  default = {
    desired_size = 2
    max_size     = 10
    min_size     = 1
  }
}

#
# ═══════════════════════════════════════════════════════════════
# 🗄️ DATABASE VARIABLES
# ═══════════════════════════════════════════════════════════════
#

variable "rds_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "rds_allocated_storage" {
  description = "RDS allocated storage in GB"
  type        = number
  default     = 20
}

variable "rds_max_allocated_storage" {
  description = "RDS maximum allocated storage in GB"
  type        = number
  default     = 100
}

variable "rds_engine_version" {
  description = "PostgreSQL engine version"
  type        = string
  default     = "15.4"
}

variable "rds_backup_retention_period" {
  description = "RDS backup retention period in days"
  type        = number
  default     = 7
}

variable "rds_backup_window" {
  description = "RDS backup window"
  type        = string
  default     = "03:00-04:00"
}

variable "rds_maintenance_window" {
  description = "RDS maintenance window"
  type        = string
  default     = "sun:04:00-sun:05:00"
}

#
# ═══════════════════════════════════════════════════════════════
# 🗄️ CACHE VARIABLES
# ═══════════════════════════════════════════════════════════════
#

variable "redis_node_type" {
  description = "ElastiCache Redis node type"
  type        = string
  default     = "cache.t3.micro"
}

variable "redis_engine_version" {
  description = "Redis engine version"
  type        = string
  default     = "7.0"
}

variable "redis_parameter_group_name" {
  description = "Redis parameter group name"
  type        = string
  default     = "default.redis7"
}

variable "redis_port" {
  description = "Redis port"
  type        = number
  default     = 6379
}

#
# ═══════════════════════════════════════════════════════════════
# 🔒 SECURITY VARIABLES
# ═══════════════════════════════════════════════════════════════
#

variable "enable_encryption" {
  description = "Enable encryption for all supported resources"
  type        = bool
  default     = true
}

variable "kms_deletion_window" {
  description = "KMS key deletion window in days"
  type        = number
  default     = 7
}

#
# ═══════════════════════════════════════════════════════════════
# 📊 MONITORING VARIABLES
# ═══════════════════════════════════════════════════════════════
#

variable "enable_container_insights" {
  description = "Enable CloudWatch Container Insights"
  type        = bool
  default     = true
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 14
}

#
# ═══════════════════════════════════════════════════════════════
# 🌐 DOMAIN & SSL VARIABLES
# ═══════════════════════════════════════════════════════════════
#

variable "domain_name" {
  description = "Primary domain name"
  type        = string
  default     = "skyscout.ai"
}

variable "certificate_arn" {
  description = "ACM certificate ARN for HTTPS"
  type        = string
  default     = ""
}

#
# ═══════════════════════════════════════════════════════════════
# 🏷️ TAGGING VARIABLES
# ═══════════════════════════════════════════════════════════════
#

variable "additional_tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}

#
# ═══════════════════════════════════════════════════════════════
# 🔧 FEATURE FLAGS
# ═══════════════════════════════════════════════════════════════
#

variable "enable_nat_gateway" {
  description = "Enable NAT Gateway for private subnets"
  type        = bool
  default     = true
}

variable "single_nat_gateway" {
  description = "Use single NAT Gateway for cost optimization"
  type        = bool
  default     = false
}

variable "enable_vpn_gateway" {
  description = "Enable VPN Gateway"
  type        = bool
  default     = false
}

variable "enable_flow_logs" {
  description = "Enable VPC Flow Logs"
  type        = bool
  default     = true
}

variable "enable_dns_hostnames" {
  description = "Enable DNS hostnames in VPC"
  type        = bool
  default     = true
}

variable "enable_dns_support" {
  description = "Enable DNS support in VPC"
  type        = bool
  default     = true
}

#
# ═══════════════════════════════════════════════════════════════
# 🚀 APPLICATION VARIABLES
# ═══════════════════════════════════════════════════════════════
#

variable "ecr_repositories" {
  description = "List of ECR repositories to create"
  type        = list(string)
  default = [
    "skyscout-web",
    "skyscout-api",
    "skyscout-auth-service",
    "skyscout-flight-aggregation-service",
    "skyscout-search-engine",
    "skyscout-ml-service"
  ]
}

variable "enable_image_scanning" {
  description = "Enable ECR image scanning"
  type        = bool
  default     = true
}

variable "ecr_lifecycle_policy" {
  description = "ECR lifecycle policy"
  type        = string
  default     = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 10 production images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["v", "release"]
          countType     = "imageCountMoreThan"
          countNumber   = 10
        }
        action = {
          type = "expire"
        }
      },
      {
        rulePriority = 2
        description  = "Keep last 5 development images"
        selection = {
          tagStatus   = "untagged"
          countType   = "imageCountMoreThan"
          countNumber = 5
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

#
# ═══════════════════════════════════════════════════════════════
# ⚡ PERFORMANCE VARIABLES
# ═══════════════════════════════════════════════════════════════
#

variable "enable_enhanced_monitoring" {
  description = "Enable enhanced monitoring for RDS"
  type        = bool
  default     = true
}

variable "monitoring_interval" {
  description = "RDS monitoring interval in seconds"
  type        = number
  default     = 60
}

variable "performance_insights_enabled" {
  description = "Enable RDS Performance Insights"
  type        = bool
  default     = true
}

variable "performance_insights_retention_period" {
  description = "Performance Insights retention period in days"
  type        = number
  default     = 7
}

#
# ═══════════════════════════════════════════════════════════════
# 💰 COST OPTIMIZATION VARIABLES
# ═══════════════════════════════════════════════════════════════
#

variable "enable_cost_allocation_tags" {
  description = "Enable cost allocation tags"
  type        = bool
  default     = true
}

variable "budget_limit" {
  description = "Monthly budget limit in USD"
  type        = number
  default     = 500
}

variable "budget_threshold" {
  description = "Budget threshold percentage for alerts"
  type        = number
  default     = 80
}
