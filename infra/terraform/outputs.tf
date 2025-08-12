#
# SkyScout AI - Terraform Outputs
# Infrastructure Resource Information
#

#
# ═══════════════════════════════════════════════════════════════
# 🌐 NETWORKING OUTPUTS
# ═══════════════════════════════════════════════════════════════
#

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = aws_vpc.main.cidr_block
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = aws_subnet.private[*].id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = aws_subnet.public[*].id
}

output "database_subnet_ids" {
  description = "IDs of the database subnets"
  value       = aws_subnet.database[*].id
}

output "internet_gateway_id" {
  description = "ID of the Internet Gateway"
  value       = aws_internet_gateway.main.id
}

output "nat_gateway_ids" {
  description = "IDs of the NAT Gateways"
  value       = aws_nat_gateway.main[*].id
}

#
# ═══════════════════════════════════════════════════════════════
# 🔒 SECURITY OUTPUTS
# ═══════════════════════════════════════════════════════════════
#

output "alb_security_group_id" {
  description = "ID of the ALB security group"
  value       = aws_security_group.alb.id
}

output "eks_security_group_id" {
  description = "ID of the EKS cluster security group"
  value       = aws_security_group.eks_cluster.id
}

output "rds_security_group_id" {
  description = "ID of the RDS security group"
  value       = aws_security_group.rds.id
}

output "redis_security_group_id" {
  description = "ID of the Redis security group"
  value       = aws_security_group.redis.id
}

#
# ═══════════════════════════════════════════════════════════════
# ☸️ EKS OUTPUTS
# ═══════════════════════════════════════════════════════════════
#

output "eks_cluster_id" {
  description = "EKS cluster ID"
  value       = aws_eks_cluster.main.id
}

output "eks_cluster_arn" {
  description = "EKS cluster ARN"
  value       = aws_eks_cluster.main.arn
}

output "eks_cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = aws_eks_cluster.main.endpoint
}

output "eks_cluster_version" {
  description = "EKS cluster Kubernetes version"
  value       = aws_eks_cluster.main.version
}

output "eks_cluster_security_group_id" {
  description = "EKS cluster security group ID"
  value       = aws_eks_cluster.main.vpc_config[0].cluster_security_group_id
}

output "eks_cluster_certificate_authority_data" {
  description = "EKS cluster certificate authority data"
  value       = aws_eks_cluster.main.certificate_authority[0].data
}

output "eks_node_group_arn" {
  description = "EKS node group ARN"
  value       = aws_eks_node_group.main.arn
}

output "eks_node_group_status" {
  description = "EKS node group status"
  value       = aws_eks_node_group.main.status
}

#
# ═══════════════════════════════════════════════════════════════
# 🗄️ DATABASE OUTPUTS
# ═══════════════════════════════════════════════════════════════
#

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.main.endpoint
  sensitive   = false
}

output "rds_port" {
  description = "RDS instance port"
  value       = aws_db_instance.main.port
}

output "rds_database_name" {
  description = "RDS database name"
  value       = aws_db_instance.main.db_name
}

output "rds_username" {
  description = "RDS master username"
  value       = aws_db_instance.main.username
  sensitive   = false
}

output "rds_subnet_group_name" {
  description = "RDS subnet group name"
  value       = aws_db_subnet_group.main.name
}

#
# ═══════════════════════════════════════════════════════════════
# 🗄️ CACHE OUTPUTS
# ═══════════════════════════════════════════════════════════════
#

output "redis_endpoint" {
  description = "Redis cluster endpoint"
  value       = aws_elasticache_cluster.redis.cache_nodes[0].address
}

output "redis_port" {
  description = "Redis cluster port"
  value       = aws_elasticache_cluster.redis.port
}

output "redis_parameter_group_name" {
  description = "Redis parameter group name"
  value       = aws_elasticache_cluster.redis.parameter_group_name
}

#
# ═══════════════════════════════════════════════════════════════
# 🚀 ECR OUTPUTS
# ═══════════════════════════════════════════════════════════════
#

output "ecr_repository_urls" {
  description = "ECR repository URLs"
  value = {
    for repo in aws_ecr_repository.repos : repo.name => repo.repository_url
  }
}

output "ecr_registry_id" {
  description = "ECR registry ID"
  value       = data.aws_caller_identity.current.account_id
}

#
# ═══════════════════════════════════════════════════════════════
# 🏷️ LOAD BALANCER OUTPUTS
# ═══════════════════════════════════════════════════════════════
#

output "alb_dns_name" {
  description = "ALB DNS name"
  value       = aws_lb.main.dns_name
}

output "alb_zone_id" {
  description = "ALB zone ID"
  value       = aws_lb.main.zone_id
}

output "alb_arn" {
  description = "ALB ARN"
  value       = aws_lb.main.arn
}

#
# ═══════════════════════════════════════════════════════════════
# 🔑 IAM OUTPUTS
# ═══════════════════════════════════════════════════════════════
#

output "eks_cluster_role_arn" {
  description = "EKS cluster IAM role ARN"
  value       = aws_iam_role.eks_cluster.arn
}

output "eks_node_group_role_arn" {
  description = "EKS node group IAM role ARN"
  value       = aws_iam_role.eks_node_group.arn
}

output "eks_alb_controller_role_arn" {
  description = "AWS Load Balancer Controller IAM role ARN"
  value       = aws_iam_role.aws_load_balancer_controller.arn
}

#
# ═══════════════════════════════════════════════════════════════
# 🔐 KMS OUTPUTS
# ═══════════════════════════════════════════════════════════════
#

output "kms_key_eks_arn" {
  description = "KMS key ARN for EKS"
  value       = aws_kms_key.eks.arn
}

output "kms_key_rds_arn" {
  description = "KMS key ARN for RDS"
  value       = aws_kms_key.rds.arn
}

output "kms_key_ebs_arn" {
  description = "KMS key ARN for EBS"
  value       = aws_kms_key.ebs.arn
}

#
# ═══════════════════════════════════════════════════════════════
# 📊 MONITORING OUTPUTS
# ═══════════════════════════════════════════════════════════════
#

output "cloudwatch_log_group_name" {
  description = "CloudWatch log group name for EKS"
  value       = aws_cloudwatch_log_group.eks_cluster.name
}

#
# ═══════════════════════════════════════════════════════════════
# 🌍 ENVIRONMENT OUTPUTS
# ═══════════════════════════════════════════════════════════════
#

output "environment" {
  description = "Environment name"
  value       = var.environment
}

output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}

output "availability_zones" {
  description = "Availability zones used"
  value       = local.azs
}

#
# ═══════════════════════════════════════════════════════════════
# 🔧 KUBECTL CONFIGURATION
# ═══════════════════════════════════════════════════════════════
#

output "kubectl_config" {
  description = "kubectl configuration command"
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${aws_eks_cluster.main.name}"
}

#
# ═══════════════════════════════════════════════════════════════
# 🚀 DEPLOYMENT INFORMATION
# ═══════════════════════════════════════════════════════════════
#

output "deployment_info" {
  description = "Deployment information for CI/CD"
  value = {
    cluster_name     = aws_eks_cluster.main.name
    cluster_endpoint = aws_eks_cluster.main.endpoint
    cluster_region   = var.aws_region
    ecr_registry     = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com"
    alb_dns_name     = aws_lb.main.dns_name
    environment      = var.environment
    
    # Database connection info
    database = {
      host     = aws_db_instance.main.endpoint
      port     = aws_db_instance.main.port
      name     = aws_db_instance.main.db_name
      username = aws_db_instance.main.username
    }
    
    # Redis connection info
    redis = {
      host = aws_elasticache_cluster.redis.cache_nodes[0].address
      port = aws_elasticache_cluster.redis.port
    }
  }
}

#
# ═══════════════════════════════════════════════════════════════
# 📝 TERRAFORM STATE INFORMATION
# ═══════════════════════════════════════════════════════════════
#

output "terraform_state_bucket" {
  description = "S3 bucket for Terraform state"
  value       = "skyscout-terraform-state"
}

output "terraform_lock_table" {
  description = "DynamoDB table for Terraform state locking"
  value       = "skyscout-terraform-locks"
}
