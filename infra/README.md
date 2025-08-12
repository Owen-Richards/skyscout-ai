# SkyScout AI Infrastructure

## 📁 Infrastructure Organization

### 🐳 Docker

Container orchestration and local development environment.

- [`docker-compose.yml`](./docker/docker-compose.yml) - Local development services
- [`nginx/`](./docker/nginx/) - Reverse proxy configuration

### ☸️ Kubernetes

Production Kubernetes manifests and configurations.

_Note: Kubernetes manifests will be added for production deployment_

### 🏗️ Terraform

Infrastructure as Code using Terraform for AWS deployment.

_Note: Terraform configurations will be added for cloud infrastructure_

### 📊 Monitoring

Observability stack with Prometheus and Grafana.

- [`prometheus/`](./monitoring/prometheus/) - Metrics collection configuration
- [`grafana/`](./monitoring/grafana/) - Dashboard and visualization setup

### 🗄️ Database

Database initialization scripts and migrations.

- [`sql/`](./database/sql/) - PostgreSQL initialization and TimescaleDB setup

## 🚀 Quick Start

### Local Development

```bash
cd infra/docker
docker-compose up -d
```

### Production Deployment

```bash
# Coming soon - Terraform and Kubernetes deployment
```

## 📋 Service Overview

| Service       | Port | Purpose                     |
| ------------- | ---- | --------------------------- |
| Web Frontend  | 3000 | Next.js application         |
| API Gateway   | 3001 | Node.js/Fastify backend     |
| ML Service    | 8000 | Python FastAPI ML endpoints |
| Search Engine | 8080 | Rust-based search service   |
| PostgreSQL    | 5432 | Primary database            |
| Redis         | 6379 | Cache and sessions          |
| OpenSearch    | 9200 | Search and analytics        |
| Prometheus    | 9090 | Metrics collection          |
| Grafana       | 3002 | Monitoring dashboards       |

---

_Infrastructure follows cloud-native patterns with containerization, observability, and infrastructure as code._
