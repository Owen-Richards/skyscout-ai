#
# SkyScout AI - AWS Infrastructure as Code
# Production-Ready Multi-Environment Setup
#

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  backend "s3" {
    bucket         = "skyscout-terraform-state"
    key            = "infrastructure/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "skyscout-terraform-locks"
    
    # Workspace-specific state
    workspace_key_prefix = "environments"
  }
}

# Provider Configuration
provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "SkyScout AI"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Owner       = "SkyScout Team"
      CostCenter  = "Engineering"
    }
  }
}

# Local Variables
locals {
  # Naming convention: skyscout-{environment}-{resource}
  name_prefix = "skyscout-${var.environment}"
  
  # Common tags for all resources
  common_tags = {
    Project     = "SkyScout AI"
    Environment = var.environment
    ManagedBy   = "Terraform"
    Repository  = "skyscout-ai"
  }

  # Environment-specific configurations
  env_config = {
    development = {
      instance_types = ["t3.medium", "t3.large"]
      min_capacity   = 1
      max_capacity   = 3
      desired_capacity = 2
      database_instance = "db.t3.micro"
      redis_node_type   = "cache.t3.micro"
    }
    staging = {
      instance_types = ["t3.large", "t3.xlarge"]
      min_capacity   = 2
      max_capacity   = 8
      desired_capacity = 3
      database_instance = "db.t3.small"
      redis_node_type   = "cache.t3.small"
    }
    production = {
      instance_types = ["m5.large", "m5.xlarge", "c5.large"]
      min_capacity   = 3
      max_capacity   = 50
      desired_capacity = 5
      database_instance = "db.r5.large"
      redis_node_type   = "cache.r5.large"
    }
  }

  # Availability Zones
  azs = slice(data.aws_availability_zones.available.names, 0, 3)
}

# Data Sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

#
# ═══════════════════════════════════════════════════════════════
# 🌐 NETWORKING INFRASTRUCTURE
# ═══════════════════════════════════════════════════════════════
#

# VPC
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-vpc"
    Type = "networking"
  })
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  
  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-igw"
  })
}

# Public Subnets (for Load Balancers)
resource "aws_subnet" "public" {
  count = length(local.azs)
  
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone       = local.azs[count.index]
  map_public_ip_on_launch = true
  
  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-public-${local.azs[count.index]}"
    Type = "public"
    "kubernetes.io/role/elb" = "1"
  })
}

# Private Subnets (for Applications)
resource "aws_subnet" "private" {
  count = length(local.azs)
  
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 10)
  availability_zone = local.azs[count.index]
  
  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-private-${local.azs[count.index]}"
    Type = "private"
    "kubernetes.io/role/internal-elb" = "1"
  })
}

# Database Subnets
resource "aws_subnet" "database" {
  count = length(local.azs)
  
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 20)
  availability_zone = local.azs[count.index]
  
  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-database-${local.azs[count.index]}"
    Type = "database"
  })
}

# NAT Gateways
resource "aws_eip" "nat" {
  count = length(aws_subnet.public)
  
  domain = "vpc"
  depends_on = [aws_internet_gateway.main]
  
  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-nat-${count.index + 1}"
  })
}

resource "aws_nat_gateway" "main" {
  count = length(aws_subnet.public)
  
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id
  
  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-nat-${count.index + 1}"
  })
  
  depends_on = [aws_internet_gateway.main]
}

# Route Tables
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
  
  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-public-rt"
  })
}

resource "aws_route_table" "private" {
  count = length(aws_nat_gateway.main)
  
  vpc_id = aws_vpc.main.id
  
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main[count.index].id
  }
  
  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-private-rt-${count.index + 1}"
  })
}

# Route Table Associations
resource "aws_route_table_association" "public" {
  count = length(aws_subnet.public)
  
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "private" {
  count = length(aws_subnet.private)
  
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}

#
# ═══════════════════════════════════════════════════════════════
# 🔒 SECURITY GROUPS
# ═══════════════════════════════════════════════════════════════
#

# ALB Security Group
resource "aws_security_group" "alb" {
  name_prefix = "${local.name_prefix}-alb-"
  vpc_id      = aws_vpc.main.id
  description = "Security group for Application Load Balancer"
  
  # HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP"
  }
  
  # HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS"
  }
  
  # All outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }
  
  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-alb-sg"
  })
  
  lifecycle {
    create_before_destroy = true
  }
}

# EKS Security Group
resource "aws_security_group" "eks_cluster" {
  name_prefix = "${local.name_prefix}-eks-cluster-"
  vpc_id      = aws_vpc.main.id
  description = "Security group for EKS cluster"
  
  # Allow all inbound traffic from VPC
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.vpc_cidr]
    description = "All traffic from VPC"
  }
  
  # All outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }
  
  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-eks-cluster-sg"
  })
}

# RDS Security Group
resource "aws_security_group" "rds" {
  name_prefix = "${local.name_prefix}-rds-"
  vpc_id      = aws_vpc.main.id
  description = "Security group for RDS database"
  
  # PostgreSQL
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_cluster.id]
    description     = "PostgreSQL from EKS"
  }
  
  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-rds-sg"
  })
}

# ElastiCache Security Group
resource "aws_security_group" "redis" {
  name_prefix = "${local.name_prefix}-redis-"
  vpc_id      = aws_vpc.main.id
  description = "Security group for ElastiCache Redis"
  
  # Redis
  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_cluster.id]
    description     = "Redis from EKS"
  }
  
  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-redis-sg"
  })
}

#
# ═══════════════════════════════════════════════════════════════
# ☸️ EKS CLUSTER
# ═══════════════════════════════════════════════════════════════
#

# EKS Cluster
resource "aws_eks_cluster" "main" {
  name     = "${local.name_prefix}-cluster"
  role_arn = aws_iam_role.eks_cluster.arn
  version  = var.kubernetes_version
  
  vpc_config {
    subnet_ids              = concat(aws_subnet.private[*].id, aws_subnet.public[*].id)
    security_group_ids      = [aws_security_group.eks_cluster.id]
    endpoint_private_access = true
    endpoint_public_access  = var.environment == "production" ? false : true
    public_access_cidrs     = var.environment == "production" ? [] : ["0.0.0.0/0"]
  }
  
  # Enable logging
  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]
  
  # Encryption
  encryption_config {
    provider {
      key_arn = aws_kms_key.eks.arn
    }
    resources = ["secrets"]
  }
  
  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_AmazonEKSClusterPolicy,
    aws_cloudwatch_log_group.eks_cluster,
  ]
  
  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-eks-cluster"
  })
}

# EKS Node Group
resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "${local.name_prefix}-nodes"
  node_role_arn   = aws_iam_role.eks_node_group.arn
  subnet_ids      = aws_subnet.private[*].id
  
  # Instance configuration
  instance_types = local.env_config[var.environment].instance_types
  ami_type       = "AL2_x86_64"
  capacity_type  = var.environment == "production" ? "ON_DEMAND" : "SPOT"
  disk_size      = var.environment == "production" ? 50 : 20
  
  # Scaling configuration
  scaling_config {
    desired_size = local.env_config[var.environment].desired_capacity
    max_size     = local.env_config[var.environment].max_capacity
    min_size     = local.env_config[var.environment].min_capacity
  }
  
  # Update configuration
  update_config {
    max_unavailable_percentage = 25
  }
  
  # Launch template for advanced configuration
  launch_template {
    id      = aws_launch_template.eks_nodes.id
    version = aws_launch_template.eks_nodes.latest_version
  }
  
  # Ensure that IAM Role permissions are created before and deleted after EKS Node Group
  depends_on = [
    aws_iam_role_policy_attachment.eks_node_group_AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.eks_node_group_AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.eks_node_group_AmazonEC2ContainerRegistryReadOnly,
  ]
  
  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-node-group"
  })
}

# Launch Template for EKS Nodes
resource "aws_launch_template" "eks_nodes" {
  name_prefix = "${local.name_prefix}-eks-nodes-"
  
  vpc_security_group_ids = [aws_security_group.eks_cluster.id]
  
  # User data for node initialization
  user_data = base64encode(templatefile("${path.module}/templates/eks-node-userdata.sh", {
    cluster_name        = aws_eks_cluster.main.name
    cluster_endpoint    = aws_eks_cluster.main.endpoint
    cluster_ca          = aws_eks_cluster.main.certificate_authority[0].data
    bootstrap_arguments = "--container-runtime containerd"
  }))
  
  # Instance monitoring
  monitoring {
    enabled = true
  }
  
  # EBS optimization
  ebs_optimized = true
  
  block_device_mappings {
    device_name = "/dev/xvda"
    ebs {
      volume_size           = var.environment == "production" ? 50 : 20
      volume_type           = "gp3"
      delete_on_termination = true
      encrypted             = true
      kms_key_id           = aws_kms_key.ebs.arn
    }
  }
  
  tag_specifications {
    resource_type = "instance"
    tags = merge(local.common_tags, {
      Name = "${local.name_prefix}-eks-node"
    })
  }
  
  lifecycle {
    create_before_destroy = true
  }
}
