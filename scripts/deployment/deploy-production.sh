#!/bin/bash
# 🚀 SkyScout AI Production Deployment Script

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REGION=${AWS_REGION:-us-east-1}
ENVIRONMENT=${ENVIRONMENT:-production}
CLUSTER_NAME="skyscout-${ENVIRONMENT}"
DOMAIN=${DOMAIN:-skyscout.ai}

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    local missing_tools=()
    
    command -v aws >/dev/null 2>&1 || missing_tools+=("aws-cli")
    command -v kubectl >/dev/null 2>&1 || missing_tools+=("kubectl")
    command -v helm >/dev/null 2>&1 || missing_tools+=("helm")
    command -v terraform >/dev/null 2>&1 || missing_tools+=("terraform")
    command -v docker >/dev/null 2>&1 || missing_tools+=("docker")
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        print_error "Missing required tools: ${missing_tools[*]}"
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity >/dev/null 2>&1; then
        print_error "AWS credentials not configured"
        exit 1
    fi
    
    print_success "All prerequisites satisfied"
}

# Deploy infrastructure
deploy_infrastructure() {
    print_status "Deploying infrastructure with Terraform..."
    
    cd infra/terraform
    
    # Initialize Terraform
    terraform init
    
    # Select or create workspace
    terraform workspace select ${ENVIRONMENT} 2>/dev/null || terraform workspace new ${ENVIRONMENT}
    
    # Plan deployment
    print_status "Creating Terraform plan..."
    terraform plan -var="environment=${ENVIRONMENT}" -var="aws_region=${REGION}" -out=tfplan
    
    # Apply infrastructure
    print_status "Applying infrastructure changes..."
    terraform apply tfplan
    
    # Get outputs
    CLUSTER_ENDPOINT=$(terraform output -raw cluster_endpoint)
    print_success "Infrastructure deployed successfully"
    print_status "EKS Cluster Endpoint: ${CLUSTER_ENDPOINT}"
    
    cd ../..
}

# Configure kubectl
configure_kubectl() {
    print_status "Configuring kubectl for EKS cluster..."
    
    aws eks update-kubeconfig \
        --region ${REGION} \
        --name ${CLUSTER_NAME} \
        --alias skyscout-${ENVIRONMENT}
    
    # Test connection
    if kubectl cluster-info >/dev/null 2>&1; then
        print_success "kubectl configured successfully"
    else
        print_error "Failed to configure kubectl"
        exit 1
    fi
}

# Install essential Kubernetes tools
install_k8s_tools() {
    print_status "Installing essential Kubernetes tools..."
    
    # Add Helm repositories
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm repo add jetstack https://charts.jetstack.io
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo add grafana https://grafana.github.io/helm-charts
    helm repo add elastic https://helm.elastic.co
    helm repo update
    
    # Install NGINX Ingress Controller
    print_status "Installing NGINX Ingress Controller..."
    helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
        --namespace ingress-nginx \
        --create-namespace \
        --set controller.service.type=LoadBalancer \
        --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-type"="nlb" \
        --wait
    
    # Install cert-manager for SSL certificates
    print_status "Installing cert-manager..."
    helm upgrade --install cert-manager jetstack/cert-manager \
        --namespace cert-manager \
        --create-namespace \
        --set installCRDs=true \
        --wait
    
    # Install Prometheus & Grafana for monitoring
    print_status "Installing Prometheus and Grafana..."
    helm upgrade --install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
        --namespace monitoring \
        --create-namespace \
        --set grafana.adminPassword="$(openssl rand -base64 32)" \
        --set prometheus.prometheusSpec.retention=30d \
        --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.resources.requests.storage=50Gi \
        --wait
    
    print_success "Essential Kubernetes tools installed"
}

# Build and push Docker images
build_and_push_images() {
    print_status "Building and pushing Docker images..."
    
    # Get ECR login token
    aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin "$(aws sts get-caller-identity --query Account --output text).dkr.ecr.${REGION}.amazonaws.com"
    
    local account_id=$(aws sts get-caller-identity --query Account --output text)
    local ecr_base="${account_id}.dkr.ecr.${REGION}.amazonaws.com"
    
    # Build and push each service
    local services=("web" "api" "auth-service" "flight-aggregation-service" "search-engine" "ml-service" "ai-prediction-engine")
    
    for service in "${services[@]}"; do
        print_status "Building ${service}..."
        
        if [ -f "apps/${service}/Dockerfile" ]; then
            docker build -t "${ecr_base}/skyscout-${service}:latest" -f "apps/${service}/Dockerfile" .
            docker push "${ecr_base}/skyscout-${service}:latest"
            print_success "${service} image pushed successfully"
        else
            print_warning "Dockerfile not found for ${service}, skipping..."
        fi
    done
}

# Deploy applications to Kubernetes
deploy_applications() {
    print_status "Deploying applications to Kubernetes..."
    
    # Apply Kubernetes manifests
    if [ -d "infra/kubernetes" ]; then
        kubectl apply -f infra/kubernetes/
        print_success "Kubernetes manifests applied"
    fi
    
    # Deploy with Helm if charts exist
    if [ -d "infra/helm" ]; then
        for chart in infra/helm/*/; do
            chart_name=$(basename "${chart}")
            print_status "Deploying ${chart_name} with Helm..."
            
            helm upgrade --install "${chart_name}" "${chart}" \
                --namespace skyscout \
                --create-namespace \
                --set image.tag=latest \
                --set environment=${ENVIRONMENT} \
                --wait
        done
        print_success "Helm charts deployed"
    fi
}

# Setup monitoring and alerting
setup_monitoring() {
    print_status "Setting up monitoring and alerting..."
    
    # Apply custom monitoring configurations
    if [ -f "infra/monitoring/prometheus-rules.yaml" ]; then
        kubectl apply -f infra/monitoring/prometheus-rules.yaml
    fi
    
    if [ -f "infra/monitoring/grafana-dashboards.yaml" ]; then
        kubectl apply -f infra/monitoring/grafana-dashboards.yaml
    fi
    
    # Get Grafana admin password
    local grafana_password=$(kubectl get secret kube-prometheus-stack-grafana -n monitoring -o jsonpath="{.data.admin-password}" | base64 --decode)
    print_success "Grafana admin password: ${grafana_password}"
    
    # Get service URLs
    local grafana_url=$(kubectl get svc kube-prometheus-stack-grafana -n monitoring -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
    print_status "Grafana URL: http://${grafana_url}"
}

# Run database migrations
run_database_migrations() {
    print_status "Running database migrations..."
    
    # Get database connection details from Terraform outputs
    local db_endpoint=$(cd infra/terraform && terraform output -raw database_endpoint)
    local db_password=$(cd infra/terraform && terraform output -raw database_password)
    
    # Run Prisma migrations
    export DATABASE_URL="postgresql://skyscout_admin:${db_password}@${db_endpoint}:5432/skyscout_main"
    
    # Run migrations in a Kubernetes job
    kubectl create job prisma-migrate-${ENVIRONMENT}-$(date +%s) \
        --image="$(aws sts get-caller-identity --query Account --output text).dkr.ecr.${REGION}.amazonaws.com/skyscout-api:latest" \
        --restart=Never \
        -- npx prisma migrate deploy
    
    print_success "Database migrations completed"
}

# Validate deployment
validate_deployment() {
    print_status "Validating deployment..."
    
    # Check pod status
    local failed_pods=$(kubectl get pods --all-namespaces --field-selector=status.phase!=Running,status.phase!=Succeeded -o name 2>/dev/null | wc -l)
    
    if [ "${failed_pods}" -eq 0 ]; then
        print_success "All pods are running successfully"
    else
        print_warning "${failed_pods} pods are not in Running state"
        kubectl get pods --all-namespaces --field-selector=status.phase!=Running,status.phase!=Succeeded
    fi
    
    # Check service endpoints
    local web_url="https://${DOMAIN}"
    if curl -s --head "${web_url}" | head -n 1 | grep -q "200 OK"; then
        print_success "Web application is accessible at ${web_url}"
    else
        print_warning "Web application might not be ready yet"
    fi
    
    # Performance validation
    print_status "Running performance validation..."
    local lighthouse_score=$(npx lighthouse "${web_url}" --only-categories=performance --output=json --quiet | jq '.categories.performance.score * 100')
    print_status "Performance score: ${lighthouse_score}/100"
    
    if [ "${lighthouse_score}" -ge 90 ]; then
        print_success "Performance validation passed"
    else
        print_warning "Performance score below target (90+)"
    fi
}

# Cleanup function
cleanup() {
    print_status "Cleaning up temporary files..."
    rm -f infra/terraform/tfplan
}

# Main deployment flow
main() {
    print_status "🚀 Starting SkyScout AI production deployment..."
    print_status "Environment: ${ENVIRONMENT}"
    print_status "Region: ${REGION}"
    print_status "Domain: ${DOMAIN}"
    
    # Trap cleanup on exit
    trap cleanup EXIT
    
    check_prerequisites
    deploy_infrastructure
    configure_kubectl
    install_k8s_tools
    build_and_push_images
    deploy_applications
    setup_monitoring
    run_database_migrations
    validate_deployment
    
    print_success "🎉 SkyScout AI deployment completed successfully!"
    print_status "Next steps:"
    print_status "1. Configure DNS to point ${DOMAIN} to the load balancer"
    print_status "2. Monitor application health in Grafana"
    print_status "3. Set up backup and disaster recovery procedures"
    print_status "4. Configure alerting rules for production monitoring"
}

# Script execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
