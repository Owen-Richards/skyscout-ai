#!/bin/bash

# SkyScout AI Production Deployment Script

set -e

echo "🚀 Deploying SkyScout AI to production..."

# Check environment
if [ "$ENVIRONMENT" != "production" ]; then
    echo "⚠️  This script is for production deployment only."
    echo "Set ENVIRONMENT=production to continue."
    exit 1
fi

# Build production images
echo "🐳 Building production Docker images..."
docker-compose -f docker-compose.prod.yml build

# Database migrations
echo "🗄️ Running database migrations..."
docker-compose -f docker-compose.prod.yml run --rm api npx prisma migrate deploy

# Start services
echo "▶️ Starting production services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services
echo "⏳ Waiting for services to be ready..."
sleep 60

# Health checks
echo "🏥 Running health checks..."
services=("web:3000" "api:3001" "ml-service:8000")

for service in "${services[@]}"; do
    host=$(echo $service | cut -d: -f1)
    port=$(echo $service | cut -d: -f2)
    
    for i in {1..5}; do
        if curl -f http://localhost:$port/health > /dev/null 2>&1; then
            echo "✅ $host is healthy"
            break
        else
            echo "⏳ Waiting for $host (attempt $i/5)..."
            sleep 10
        fi
    done
done

echo ""
echo "🎉 SkyScout AI production deployment complete!"
echo ""
echo "🌐 Production URLs:"
echo "   • Frontend: https://skyscout.ai"
echo "   • API: https://api.skyscout.ai"
echo "   • ML Service: https://ml.skyscout.ai"
echo "   • Monitoring: https://monitoring.skyscout.ai"
echo ""
