#!/bin/bash

# SkyScout AI Development Environment Setup Script

set -e

echo "🚀 Setting up SkyScout AI development environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p apps/auth-service
mkdir -p apps/search-engine/src
mkdir -p infra/grafana/dashboards
mkdir -p nginx/ssl
mkdir -p logs

# Generate SSL certificates for local development
echo "🔐 Generating SSL certificates for local development..."
if [ ! -f nginx/ssl/cert.pem ]; then
    openssl req -x509 -newkey rsa:4096 -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/OU=OrgUnit/CN=localhost"
fi

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Install Python dependencies for ML service
echo "🐍 Installing Python dependencies..."
if [ -f apps/ml-service/requirements.txt ]; then
    pip install -r apps/ml-service/requirements.txt
fi

# Initialize database schema
echo "🗄️ Setting up database schema..."
npx prisma generate
npx prisma db push

# Build Docker images
echo "🐳 Building Docker images..."
docker-compose build

# Start services
echo "▶️ Starting all services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🏥 Checking service health..."
services=("web:3000" "api:3001" "ml-service:8000" "postgres:5432" "redis:6379" "opensearch:9200")

for service in "${services[@]}"; do
    host=$(echo $service | cut -d: -f1)
    port=$(echo $service | cut -d: -f2)
    
    if nc -z localhost $port; then
        echo "✅ $host is running on port $port"
    else
        echo "❌ $host is not responding on port $port"
    fi
done

echo ""
echo "🎉 SkyScout AI development environment is ready!"
echo ""
echo "🌐 Access the application:"
echo "   • Frontend: http://localhost:3000"
echo "   • API: http://localhost:3001"
echo "   • ML Service: http://localhost:8000"
echo "   • Grafana: http://localhost:3002 (admin/admin)"
echo "   • Prometheus: http://localhost:9090"
echo "   • OpenSearch: http://localhost:9200"
echo ""
echo "📊 Monitoring:"
echo "   • Logs: docker-compose logs -f [service_name]"
echo "   • Stop: docker-compose down"
echo "   • Restart: docker-compose restart [service_name]"
echo ""
