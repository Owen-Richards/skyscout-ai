#
# SkyScout AI - AWS Load Balancer & Ingress Configuration
# Production-Ready Application Gateway
#

#
# ═══════════════════════════════════════════════════════════════
# 🏷️ APPLICATION LOAD BALANCER
# ═══════════════════════════════════════════════════════════════
#

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "${local.name_prefix}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection       = var.environment == "production" ? true : false
  enable_cross_zone_load_balancing = true
  enable_http2                     = true
  enable_waf_fail_open            = false

  # Access logs
  access_logs {
    bucket  = aws_s3_bucket.alb_logs.bucket
    prefix  = "${local.name_prefix}-alb"
    enabled = true
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-alb"
    Type = "application-load-balancer"
  })

  depends_on = [aws_s3_bucket_policy.alb_logs]
}

# S3 Bucket for ALB Access Logs
resource "aws_s3_bucket" "alb_logs" {
  bucket = "${local.name_prefix}-alb-logs"

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-alb-logs"
    Type = "access-logs"
  })
}

resource "aws_s3_bucket_lifecycle_configuration" "alb_logs" {
  bucket = aws_s3_bucket.alb_logs.id

  rule {
    id     = "alb_logs_lifecycle"
    status = "Enabled"

    expiration {
      days = var.environment == "production" ? 90 : 30
    }

    noncurrent_version_expiration {
      noncurrent_days = 7
    }
  }
}

# S3 Bucket Policy for ALB Access Logs
data "aws_elb_service_account" "main" {}

resource "aws_s3_bucket_policy" "alb_logs" {
  bucket = aws_s3_bucket.alb_logs.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = data.aws_elb_service_account.main.arn
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.alb_logs.arn}/${local.name_prefix}-alb/AWSLogs/${data.aws_caller_identity.current.account_id}/*"
      },
      {
        Effect = "Allow"
        Principal = {
          Service = "delivery.logs.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.alb_logs.arn}/${local.name_prefix}-alb/AWSLogs/${data.aws_caller_identity.current.account_id}/*"
        Condition = {
          StringEquals = {
            "s3:x-amz-acl" = "bucket-owner-full-control"
          }
        }
      },
      {
        Effect = "Allow"
        Principal = {
          Service = "delivery.logs.amazonaws.com"
        }
        Action   = "s3:GetBucketAcl"
        Resource = aws_s3_bucket.alb_logs.arn
      }
    ]
  })
}

#
# ═══════════════════════════════════════════════════════════════
# 🔗 ALB TARGET GROUPS
# ═══════════════════════════════════════════════════════════════
#

# Target Group for Web Application
resource "aws_lb_target_group" "web" {
  name        = "${local.name_prefix}-web-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 10
    interval            = 30
    path                = "/api/health"
    matcher             = "200"
    port                = "traffic-port"
    protocol            = "HTTP"
  }

  # Connection draining
  deregistration_delay = 30

  # Stickiness for session handling
  stickiness {
    type            = "lb_cookie"
    cookie_duration = 86400
    enabled         = true
  }

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-web-target-group"
    Service = "web"
  })
}

# Target Group for API Services
resource "aws_lb_target_group" "api" {
  name        = "${local.name_prefix}-api-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 10
    interval            = 30
    path                = "/health"
    matcher             = "200"
    port                = "traffic-port"
    protocol            = "HTTP"
  }

  deregistration_delay = 30

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-api-target-group"
    Service = "api"
  })
}

#
# ═══════════════════════════════════════════════════════════════
# 🎯 ALB LISTENERS & RULES
# ═══════════════════════════════════════════════════════════════
#

# HTTP Listener (Redirects to HTTPS)
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-http-listener"
  })
}

# HTTPS Listener
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS-1-2-2017-01"
  certificate_arn   = var.certificate_arn != "" ? var.certificate_arn : aws_acm_certificate.main[0].arn

  # Default action for unmatched requests
  default_action {
    type = "fixed-response"

    fixed_response {
      content_type = "text/html"
      message_body = <<-EOF
        <!DOCTYPE html>
        <html>
        <head><title>SkyScout AI</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
          <h1>🛫 SkyScout AI</h1>
          <p>Flight discovery platform is loading...</p>
          <p>If you continue to see this page, please check your request URL.</p>
        </body>
        </html>
      EOF
      status_code  = "404"
    }
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-https-listener"
  })
}

# Listener Rule for Web Application
resource "aws_lb_listener_rule" "web" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web.arn
  }

  condition {
    host_header {
      values = [
        var.environment == "production" ? var.domain_name : "${var.environment}.${var.domain_name}"
      ]
    }
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-web-rule"
  })
}

# Listener Rule for API Services
resource "aws_lb_listener_rule" "api" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 200

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }

  condition {
    host_header {
      values = [
        var.environment == "production" ? "api.${var.domain_name}" : "api-${var.environment}.${var.domain_name}"
      ]
    }
  }

  condition {
    path_pattern {
      values = ["/api/*", "/trpc/*", "/graphql/*"]
    }
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-api-rule"
  })
}

#
# ═══════════════════════════════════════════════════════════════
# 🔒 ACM SSL CERTIFICATE
# ═══════════════════════════════════════════════════════════════
#

# ACM Certificate (only if not provided)
resource "aws_acm_certificate" "main" {
  count = var.certificate_arn == "" ? 1 : 0

  domain_name = var.environment == "production" ? var.domain_name : "${var.environment}.${var.domain_name}"
  subject_alternative_names = var.environment == "production" ? [
    "*.${var.domain_name}",
    "api.${var.domain_name}",
    "admin.${var.domain_name}"
  ] : [
    "*.${var.environment}.${var.domain_name}",
    "api-${var.environment}.${var.domain_name}"
  ]

  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-certificate"
  })
}

#
# ═══════════════════════════════════════════════════════════════
# 🌐 ROUTE 53 RECORDS
# ═══════════════════════════════════════════════════════════════
#

# Route 53 Hosted Zone (reference existing or create new)
data "aws_route53_zone" "main" {
  count = var.environment == "production" ? 1 : 0
  name  = var.domain_name
}

# A Record for ALB
resource "aws_route53_record" "main" {
  count = var.environment == "production" ? 1 : 0

  zone_id = data.aws_route53_zone.main[0].zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}

# API Subdomain Record
resource "aws_route53_record" "api" {
  count = var.environment == "production" ? 1 : 0

  zone_id = data.aws_route53_zone.main[0].zone_id
  name    = "api.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}

#
# ═══════════════════════════════════════════════════════════════
# 🛡️ WAF WEB ACL
# ═══════════════════════════════════════════════════════════════
#

# WAF Web ACL for Application Protection
resource "aws_wafv2_web_acl" "main" {
  count = var.environment == "production" ? 1 : 0

  name  = "${local.name_prefix}-web-acl"
  scope = "REGIONAL"

  default_action {
    allow {}
  }

  # Rate limiting rule
  rule {
    name     = "RateLimitRule"
    priority = 1

    override_action {
      none {}
    }

    statement {
      rate_based_statement {
        limit              = 2000
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.name_prefix}RateLimitRule"
      sampled_requests_enabled   = true
    }
  }

  # AWS Managed Core Rule Set
  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 10

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.name_prefix}CommonRuleSetMetric"
      sampled_requests_enabled   = true
    }
  }

  # AWS Managed Known Bad Inputs Rule Set
  rule {
    name     = "AWSManagedRulesKnownBadInputsRuleSet"
    priority = 20

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.name_prefix}KnownBadInputsRuleSetMetric"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${local.name_prefix}WebAcl"
    sampled_requests_enabled   = true
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-web-acl"
  })
}

# Associate WAF with ALB
resource "aws_wafv2_web_acl_association" "main" {
  count = var.environment == "production" ? 1 : 0

  resource_arn = aws_lb.main.arn
  web_acl_arn  = aws_wafv2_web_acl.main[0].arn
}
