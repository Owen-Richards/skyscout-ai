#
# SkyScout AI - CloudWatch Monitoring & Alerting
# Production-Ready Observability Stack
#

#
# ═══════════════════════════════════════════════════════════════
# 📊 CLOUDWATCH LOG GROUPS
# ═══════════════════════════════════════════════════════════════
#

# EKS Cluster Log Group
resource "aws_cloudwatch_log_group" "eks_cluster" {
  name              = "/aws/eks/${local.name_prefix}-cluster/cluster"
  retention_in_days = var.log_retention_days

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-eks-logs"
  })
}

# Application Log Groups
resource "aws_cloudwatch_log_group" "applications" {
  for_each = toset([
    "web",
    "api", 
    "auth-service",
    "flight-aggregation-service",
    "search-engine",
    "ml-service"
  ])

  name              = "/aws/eks/${local.name_prefix}/${each.value}"
  retention_in_days = var.log_retention_days

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-${each.value}-logs"
    Service = each.value
  })
}

#
# ═══════════════════════════════════════════════════════════════
# 🚨 CLOUDWATCH ALARMS
# ═══════════════════════════════════════════════════════════════
#

# EKS Cluster CPU Utilization
resource "aws_cloudwatch_metric_alarm" "eks_cpu_high" {
  alarm_name          = "${local.name_prefix}-eks-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EKS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors EKS cluster CPU utilization"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    ClusterName = aws_eks_cluster.main.name
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-eks-cpu-alarm"
  })
}

# EKS Cluster Memory Utilization
resource "aws_cloudwatch_metric_alarm" "eks_memory_high" {
  alarm_name          = "${local.name_prefix}-eks-memory-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/EKS"
  period              = "300"
  statistic           = "Average"
  threshold           = "85"
  alarm_description   = "This metric monitors EKS cluster memory utilization"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    ClusterName = aws_eks_cluster.main.name
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-eks-memory-alarm"
  })
}

# RDS CPU Utilization
resource "aws_cloudwatch_metric_alarm" "rds_cpu_high" {
  alarm_name          = "${local.name_prefix}-rds-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors RDS CPU utilization"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.main.id
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-rds-cpu-alarm"
  })
}

# RDS Database Connections
resource "aws_cloudwatch_metric_alarm" "rds_connections_high" {
  alarm_name          = "${local.name_prefix}-rds-connections-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "160" # 80% of max connections for production
  alarm_description   = "This metric monitors RDS database connections"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.main.id
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-rds-connections-alarm"
  })
}

# ALB Response Time
resource "aws_cloudwatch_metric_alarm" "alb_response_time_high" {
  alarm_name          = "${local.name_prefix}-alb-response-time-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  period              = "300"
  statistic           = "Average"
  threshold           = "2"
  alarm_description   = "This metric monitors ALB response time"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-alb-response-time-alarm"
  })
}

# ALB 5XX Errors
resource "aws_cloudwatch_metric_alarm" "alb_5xx_errors" {
  alarm_name          = "${local.name_prefix}-alb-5xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "HTTPCode_ELB_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = "300"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "This metric monitors ALB 5XX errors"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-alb-5xx-alarm"
  })
}

#
# ═══════════════════════════════════════════════════════════════
# 📬 SNS ALERTING
# ═══════════════════════════════════════════════════════════════
#

# SNS Topic for Alerts
resource "aws_sns_topic" "alerts" {
  name = "${local.name_prefix}-alerts"

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-alerts-topic"
  })
}

# SNS Topic Policy
resource "aws_sns_topic_policy" "alerts" {
  arn = aws_sns_topic.alerts.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "cloudwatch.amazonaws.com"
        }
        Action = "sns:Publish"
        Resource = aws_sns_topic.alerts.arn
        Condition = {
          StringEquals = {
            "aws:SourceAccount" = data.aws_caller_identity.current.account_id
          }
        }
      }
    ]
  })
}

# SNS Subscription for Email Alerts (Example - configure as needed)
resource "aws_sns_topic_subscription" "email_alerts" {
  count     = var.environment == "production" ? 1 : 0
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = "alerts@skyscout.ai" # Configure this email address
}

#
# ═══════════════════════════════════════════════════════════════
# 📊 CLOUDWATCH DASHBOARD
# ═══════════════════════════════════════════════════════════════
#

# CloudWatch Dashboard
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${local.name_prefix}-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/EKS", "cluster_failed_request_count", "ClusterName", aws_eks_cluster.main.name],
            ["AWS/EKS", "cluster_request_total", "ClusterName", aws_eks_cluster.main.name]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "EKS Cluster Requests"
          period  = 300
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/RDS", "CPUUtilization", "DBInstanceIdentifier", aws_db_instance.main.id],
            ["AWS/RDS", "DatabaseConnections", "DBInstanceIdentifier", aws_db_instance.main.id],
            ["AWS/RDS", "FreeStorageSpace", "DBInstanceIdentifier", aws_db_instance.main.id]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "RDS Performance"
          period  = 300
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 12
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/ApplicationELB", "RequestCount", "LoadBalancer", aws_lb.main.arn_suffix],
            ["AWS/ApplicationELB", "TargetResponseTime", "LoadBalancer", aws_lb.main.arn_suffix],
            ["AWS/ApplicationELB", "HTTPCode_Target_2XX_Count", "LoadBalancer", aws_lb.main.arn_suffix],
            ["AWS/ApplicationELB", "HTTPCode_Target_4XX_Count", "LoadBalancer", aws_lb.main.arn_suffix],
            ["AWS/ApplicationELB", "HTTPCode_Target_5XX_Count", "LoadBalancer", aws_lb.main.arn_suffix]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "Application Load Balancer"
          period  = 300
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 18
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/ElastiCache", "CPUUtilization", "CacheClusterId", aws_elasticache_cluster.redis.cluster_id],
            ["AWS/ElastiCache", "NetworkBytesIn", "CacheClusterId", aws_elasticache_cluster.redis.cluster_id],
            ["AWS/ElastiCache", "NetworkBytesOut", "CacheClusterId", aws_elasticache_cluster.redis.cluster_id],
            ["AWS/ElastiCache", "CurrConnections", "CacheClusterId", aws_elasticache_cluster.redis.cluster_id]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "ElastiCache Redis"
          period  = 300
        }
      }
    ]
  })

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-dashboard"
  })
}

#
# ═══════════════════════════════════════════════════════════════
# 💰 COST MONITORING
# ═══════════════════════════════════════════════════════════════
#

# Budget for Cost Control
resource "aws_budgets_budget" "monthly" {
  name         = "${local.name_prefix}-monthly-budget"
  budget_type  = "COST"
  limit_amount = tostring(var.budget_limit)
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  time_period_start = "2024-01-01_00:00"

  cost_filters = {
    Tag = ["Project:SkyScout AI", "Environment:${var.environment}"]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                 = var.budget_threshold
    threshold_type            = "PERCENTAGE"
    notification_type         = "ACTUAL"
    subscriber_email_addresses = ["budget-alerts@skyscout.ai"]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                 = 100
    threshold_type            = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = ["budget-alerts@skyscout.ai"]
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-budget"
  })
}

#
# ═══════════════════════════════════════════════════════════════
# 🔍 X-RAY TRACING
# ═══════════════════════════════════════════════════════════════
#

# X-Ray Service Map (Sampling Rule)
resource "aws_xray_sampling_rule" "main" {
  rule_name      = "${local.name_prefix}-sampling-rule"
  priority       = 9000
  version        = 1
  reservoir_size = 1
  fixed_rate     = 0.1
  url_path       = "*"
  host           = "*"
  http_method    = "*"
  service_type   = "*"
  service_name   = "*"
  resource_arn   = "*"

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-xray-sampling-rule"
  })
}
