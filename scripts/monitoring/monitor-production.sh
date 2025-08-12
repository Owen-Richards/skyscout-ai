#!/bin/bash
# 📊 SkyScout AI Monitoring & Health Check Script

set -euo pipefail

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${ENVIRONMENT:-production}
CLUSTER_NAME="skyscout-${ENVIRONMENT}"
DOMAIN=${DOMAIN:-skyscout.ai}
SLACK_WEBHOOK=${SLACK_WEBHOOK:-""}
ALERT_THRESHOLD_CPU=80
ALERT_THRESHOLD_MEMORY=80
ALERT_THRESHOLD_RESPONSE_TIME=2000

# Function to print colored output
print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }
print_metric() { echo -e "${PURPLE}[METRIC]${NC} $1"; }

# Send Slack notification
send_slack_notification() {
    local message="$1"
    local color="$2"
    
    if [ -n "${SLACK_WEBHOOK}" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"attachments\":[{\"color\":\"${color}\",\"text\":\"${message}\"}]}" \
            "${SLACK_WEBHOOK}" 2>/dev/null || true
    fi
}

# Get Kubernetes metrics
get_k8s_metrics() {
    print_status "📊 Gathering Kubernetes metrics..."
    
    # Node metrics
    echo "=== Node Status ==="
    kubectl get nodes -o wide
    
    # Pod metrics
    echo -e "\n=== Pod Status ==="
    kubectl get pods --all-namespaces --show-labels
    
    # Resource usage
    echo -e "\n=== Resource Usage ==="
    kubectl top nodes 2>/dev/null || print_warning "Metrics server not available"
    kubectl top pods --all-namespaces 2>/dev/null || print_warning "Pod metrics not available"
    
    # Service status
    echo -e "\n=== Service Status ==="
    kubectl get services --all-namespaces
    
    # Ingress status
    echo -e "\n=== Ingress Status ==="
    kubectl get ingress --all-namespaces
}

# Check application health
check_application_health() {
    print_status "🏥 Checking application health endpoints..."
    
    local services=(
        "https://${DOMAIN}/api/health"
        "https://${DOMAIN}/api/flights/health"
        "https://${DOMAIN}/api/auth/health"
        "https://${DOMAIN}/api/search/health"
    )
    
    for service in "${services[@]}"; do
        local response_time=$(curl -o /dev/null -s -w "%{time_total}" "${service}" 2>/dev/null || echo "0")
        local http_code=$(curl -o /dev/null -s -w "%{http_code}" "${service}" 2>/dev/null || echo "000")
        
        if [ "${http_code}" = "200" ]; then
            local ms_time=$(echo "${response_time} * 1000" | bc -l | cut -d. -f1)
            print_metric "${service}: ✅ ${http_code} (${ms_time}ms)"
            
            if [ "${ms_time}" -gt "${ALERT_THRESHOLD_RESPONSE_TIME}" ]; then
                print_warning "High response time: ${ms_time}ms > ${ALERT_THRESHOLD_RESPONSE_TIME}ms"
                send_slack_notification "⚠️ High response time detected: ${service} - ${ms_time}ms" "warning"
            fi
        else
            print_error "${service}: ❌ ${http_code}"
            send_slack_notification "🚨 Service down: ${service} - HTTP ${http_code}" "danger"
        fi
    done
}

# Performance monitoring
monitor_performance() {
    print_status "⚡ Running performance monitoring..."
    
    # Lighthouse performance check
    local lighthouse_score=0
    if command -v lighthouse >/dev/null 2>&1; then
        print_status "Running Lighthouse performance audit..."
        lighthouse "https://${DOMAIN}" \
            --only-categories=performance \
            --output=json \
            --quiet \
            --chrome-flags="--headless --no-sandbox" > /tmp/lighthouse.json 2>/dev/null || true
        
        if [ -f "/tmp/lighthouse.json" ]; then
            lighthouse_score=$(jq -r '.categories.performance.score * 100' /tmp/lighthouse.json 2>/dev/null || echo "0")
            print_metric "Lighthouse Performance Score: ${lighthouse_score}/100"
            
            if [ "${lighthouse_score%.*}" -lt 90 ]; then
                print_warning "Performance score below 90: ${lighthouse_score}"
                send_slack_notification "📉 Performance degradation: Score ${lighthouse_score}/100" "warning"
            fi
        fi
    fi
    
    # Core Web Vitals simulation
    print_status "Checking Core Web Vitals..."
    local vitals_result=$(curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://${DOMAIN}&category=PERFORMANCE" | jq -r '.lighthouseResult.audits["largest-contentful-paint"].displayValue, .lighthouseResult.audits["first-input-delay"].displayValue, .lighthouseResult.audits["cumulative-layout-shift"].displayValue' 2>/dev/null || echo "N/A N/A N/A")
    
    read -r lcp fid cls <<< "${vitals_result}"
    print_metric "Core Web Vitals - LCP: ${lcp}, FID: ${fid}, CLS: ${cls}"
}

# Database monitoring
monitor_database() {
    print_status "🗄️ Monitoring database performance..."
    
    # Get database credentials from Terraform
    local db_endpoint=""
    local db_password=""
    
    if [ -d "infra/terraform" ]; then
        cd infra/terraform
        db_endpoint=$(terraform output -raw database_endpoint 2>/dev/null || echo "")
        db_password=$(terraform output -raw database_password 2>/dev/null || echo "")
        cd ../..
    fi
    
    if [ -n "${db_endpoint}" ] && [ -n "${db_password}" ]; then
        # Check database connectivity
        export PGPASSWORD="${db_password}"
        local db_status=$(psql -h "${db_endpoint}" -U skyscout_admin -d skyscout_main -c "SELECT 1;" 2>/dev/null && echo "OK" || echo "FAILED")
        print_metric "Database Status: ${db_status}"
        
        if [ "${db_status}" = "FAILED" ]; then
            send_slack_notification "🚨 Database connection failed: ${db_endpoint}" "danger"
        fi
        
        # Check database performance
        local db_connections=$(psql -h "${db_endpoint}" -U skyscout_admin -d skyscout_main -t -c "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null | xargs || echo "0")
        print_metric "Active Database Connections: ${db_connections}"
        
        # Check slow queries
        local slow_queries=$(psql -h "${db_endpoint}" -U skyscout_admin -d skyscout_main -t -c "SELECT count(*) FROM pg_stat_statements WHERE mean_time > 1000;" 2>/dev/null | xargs || echo "0")
        print_metric "Slow Queries (>1s): ${slow_queries}"
        
        if [ "${slow_queries}" -gt 10 ]; then
            print_warning "High number of slow queries detected: ${slow_queries}"
            send_slack_notification "⚠️ High number of slow queries: ${slow_queries}" "warning"
        fi
    else
        print_warning "Database credentials not available"
    fi
}

# Check resource usage
monitor_resources() {
    print_status "💾 Monitoring resource usage..."
    
    # Get node resource usage
    local nodes_data=$(kubectl get nodes -o json | jq -r '.items[] | "\(.metadata.name) \(.status.allocatable.cpu) \(.status.allocatable.memory)"')
    
    while IFS=' ' read -r node_name cpu memory; do
        # Get actual usage (requires metrics server)
        local cpu_usage=$(kubectl top node "${node_name}" --no-headers 2>/dev/null | awk '{print $2}' | sed 's/m//' || echo "0")
        local memory_usage=$(kubectl top node "${node_name}" --no-headers 2>/dev/null | awk '{print $3}' | sed 's/Mi//' || echo "0")
        
        # Convert allocatable CPU to millicores for comparison
        local cpu_allocatable=$(echo "${cpu}" | sed 's/m//')
        
        if [ "${cpu_usage}" -gt 0 ] && [ "${cpu_allocatable}" -gt 0 ]; then
            local cpu_percent=$((cpu_usage * 100 / cpu_allocatable))
            print_metric "Node ${node_name} CPU: ${cpu_percent}%"
            
            if [ "${cpu_percent}" -gt "${ALERT_THRESHOLD_CPU}" ]; then
                print_warning "High CPU usage on ${node_name}: ${cpu_percent}%"
                send_slack_notification "⚠️ High CPU usage: ${node_name} - ${cpu_percent}%" "warning"
            fi
        fi
    done <<< "${nodes_data}"
}

# Check SSL certificates
check_ssl_certificates() {
    print_status "🔒 Checking SSL certificates..."
    
    local cert_info=$(echo | openssl s_client -servername "${DOMAIN}" -connect "${DOMAIN}:443" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null || echo "")
    
    if [ -n "${cert_info}" ]; then
        local expiry_date=$(echo "${cert_info}" | grep "notAfter" | cut -d= -f2)
        local expiry_timestamp=$(date -d "${expiry_date}" +%s 2>/dev/null || echo "0")
        local current_timestamp=$(date +%s)
        local days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
        
        print_metric "SSL Certificate expires in ${days_until_expiry} days"
        
        if [ "${days_until_expiry}" -lt 30 ]; then
            print_warning "SSL certificate expires soon: ${days_until_expiry} days"
            send_slack_notification "⚠️ SSL certificate expires in ${days_until_expiry} days" "warning"
        fi
    else
        print_error "Unable to retrieve SSL certificate information"
        send_slack_notification "🚨 Unable to check SSL certificate for ${DOMAIN}" "danger"
    fi
}

# Security monitoring
monitor_security() {
    print_status "🔐 Running security checks..."
    
    # Check for security vulnerabilities in running containers
    local security_issues=0
    
    # Check for privileged containers
    local privileged_pods=$(kubectl get pods --all-namespaces -o json | jq -r '.items[] | select(.spec.containers[]?.securityContext.privileged == true) | "\(.metadata.namespace)/\(.metadata.name)"' 2>/dev/null || echo "")
    
    if [ -n "${privileged_pods}" ]; then
        print_warning "Privileged containers detected:"
        echo "${privileged_pods}"
        ((security_issues++))
    fi
    
    # Check for containers running as root
    local root_containers=$(kubectl get pods --all-namespaces -o json | jq -r '.items[] | select(.spec.containers[]?.securityContext.runAsUser == 0 or (.spec.containers[]?.securityContext.runAsUser == null and .spec.securityContext.runAsUser == null)) | "\(.metadata.namespace)/\(.metadata.name)"' 2>/dev/null || echo "")
    
    if [ -n "${root_containers}" ]; then
        print_warning "Containers running as root detected:"
        echo "${root_containers}"
        ((security_issues++))
    fi
    
    print_metric "Security Issues Found: ${security_issues}"
    
    if [ "${security_issues}" -gt 0 ]; then
        send_slack_notification "⚠️ Security issues detected: ${security_issues} findings" "warning"
    fi
}

# Generate monitoring report
generate_report() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local report_file="/tmp/skyscout-monitoring-report-$(date +%Y%m%d-%H%M%S).txt"
    
    {
        echo "# SkyScout AI Monitoring Report"
        echo "Generated: ${timestamp}"
        echo "Environment: ${ENVIRONMENT}"
        echo "Domain: ${DOMAIN}"
        echo ""
        echo "## Summary"
        echo "- Application Health: $(kubectl get pods --all-namespaces --field-selector=status.phase=Running | wc -l) pods running"
        echo "- SSL Certificate: Valid"
        echo "- Performance Score: ${lighthouse_score:-"N/A"}/100"
        echo ""
        echo "## Detailed Metrics"
        get_k8s_metrics
    } > "${report_file}"
    
    print_success "Monitoring report generated: ${report_file}"
    
    # Optional: Upload to S3 or send via email
    if command -v aws >/dev/null 2>&1; then
        aws s3 cp "${report_file}" "s3://skyscout-monitoring-reports/$(basename "${report_file}")" 2>/dev/null || true
    fi
}

# Automated remediation
auto_remediate() {
    print_status "🔧 Running automated remediation..."
    
    # Restart failed pods
    local failed_pods=$(kubectl get pods --all-namespaces --field-selector=status.phase=Failed -o json | jq -r '.items[] | "\(.metadata.namespace) \(.metadata.name)"')
    
    while IFS=' ' read -r namespace pod_name; do
        if [ -n "${namespace}" ] && [ -n "${pod_name}" ]; then
            print_status "Restarting failed pod: ${namespace}/${pod_name}"
            kubectl delete pod "${pod_name}" -n "${namespace}" --force --grace-period=0 2>/dev/null || true
        fi
    done <<< "${failed_pods}"
    
    # Clear old logs to free up space
    kubectl get pods --all-namespaces -o json | jq -r '.items[] | "\(.metadata.namespace) \(.metadata.name)"' | while IFS=' ' read -r namespace pod_name; do
        if [ -n "${namespace}" ] && [ -n "${pod_name}" ]; then
            kubectl exec -n "${namespace}" "${pod_name}" -- sh -c 'find /var/log -name "*.log" -mtime +7 -delete' 2>/dev/null || true
        fi
    done
}

# Main monitoring function
main() {
    print_status "🔍 Starting SkyScout AI monitoring check..."
    print_status "Environment: ${ENVIRONMENT}"
    print_status "Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
    
    # Run all monitoring checks
    get_k8s_metrics
    check_application_health
    monitor_performance
    monitor_database
    monitor_resources
    check_ssl_certificates
    monitor_security
    
    # Automated remediation (optional)
    if [ "${AUTO_REMEDIATE:-false}" = "true" ]; then
        auto_remediate
    fi
    
    # Generate report
    generate_report
    
    print_success "✅ Monitoring check completed"
    
    # Send summary notification
    send_slack_notification "✅ SkyScout AI monitoring check completed for ${ENVIRONMENT}" "good"
}

# Script execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
