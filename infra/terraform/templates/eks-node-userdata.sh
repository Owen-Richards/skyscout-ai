#!/bin/bash
# 
# SkyScout AI - EKS Node Initialization Script
# Optimized for Performance and Security
#

set -o xtrace

# Configure kubelet and docker/containerd for EKS
/etc/eks/bootstrap.sh ${cluster_name} ${bootstrap_arguments}

# Install additional monitoring and security tools
yum update -y
yum install -y amazon-cloudwatch-agent
yum install -y amazon-ssm-agent

# Configure CloudWatch Agent
cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json << 'EOF'
{
  "agent": {
    "metrics_collection_interval": 60,
    "run_as_user": "cwagent"
  },
  "metrics": {
    "namespace": "CWAgent",
    "metrics_collected": {
      "cpu": {
        "measurement": [
          "cpu_usage_idle",
          "cpu_usage_iowait",
          "cpu_usage_user",
          "cpu_usage_system"
        ],
        "metrics_collection_interval": 60,
        "resources": [
          "*"
        ],
        "totalcpu": false
      },
      "disk": {
        "measurement": [
          "used_percent"
        ],
        "metrics_collection_interval": 60,
        "resources": [
          "*"
        ]
      },
      "diskio": {
        "measurement": [
          "io_time",
          "read_bytes",
          "write_bytes",
          "reads",
          "writes"
        ],
        "metrics_collection_interval": 60,
        "resources": [
          "*"
        ]
      },
      "mem": {
        "measurement": [
          "mem_used_percent"
        ],
        "metrics_collection_interval": 60
      },
      "netstat": {
        "measurement": [
          "tcp_established",
          "tcp_time_wait"
        ],
        "metrics_collection_interval": 60
      },
      "swap": {
        "measurement": [
          "swap_used_percent"
        ],
        "metrics_collection_interval": 60
      }
    }
  }
}
EOF

# Start CloudWatch Agent
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json \
  -s

# Start SSM Agent
systemctl enable amazon-ssm-agent
systemctl start amazon-ssm-agent

# Configure log rotation for container logs
cat > /etc/logrotate.d/docker-containers << 'EOF'
/var/lib/docker/containers/*/*.log {
  rotate 5
  daily
  compress
  size=10M
  missingok
  delaycompress
  copytruncate
}
EOF

# Performance tuning
echo 'vm.max_map_count=262144' >> /etc/sysctl.conf
echo 'net.core.somaxconn=32768' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_max_syn_backlog=16384' >> /etc/sysctl.conf
echo 'net.core.netdev_max_backlog=16384' >> /etc/sysctl.conf

sysctl -p

# Security hardening
# Disable unnecessary services
systemctl disable postfix 2>/dev/null || true
systemctl disable avahi-daemon 2>/dev/null || true

# Set stricter file permissions
chmod 640 /etc/ssh/sshd_config
chmod 600 /etc/ssh/ssh_host_*_key

# Configure fail2ban for SSH protection (if available)
if command -v fail2ban-client >/dev/null 2>&1; then
    systemctl enable fail2ban
    systemctl start fail2ban
fi

echo "EKS node initialization completed successfully"
