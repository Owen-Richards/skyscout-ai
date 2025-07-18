# SkyScout AI ✈️

> A smart, AI-powered flight & trip discovery engine—your eyes on every sky.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-13+-000000?style=flat&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Rust](https://img.shields.io/badge/Rust-000000?style=flat&logo=rust&logoColor=white)](https://www.rust-lang.org/)

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (recommended)
- **Node.js 18+** and **npm**
- **Python 3.11+** (for ML service)
- **Rust 1.75+** (for search engine)

### 🐳 Docker Development (Recommended)

Start the complete development environment with all services:

```bash
# Windows
npm run setup:dev:win

# macOS/Linux
npm run setup:dev

# Or manually
npm run dev:full
```

This will start all services:

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:3001
- **ML Service**: http://localhost:8000
- **Search Engine**: http://localhost:8080
- **Monitoring**: http://localhost:3002 (Grafana)

### 🛠️ Local Development

For individual service development:

```bash
# Install dependencies
npm install

# Start shared libraries
npm run dev:libs

# Start frontend only
npm run dev:web

# Start API only
npm run dev:api

# Start ML service
npm run dev:ml

# Start search engine
npm run dev:search
```

## 🏗️ Architecture

### Frontend Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **tRPC** for type-safe API calls
- **Framer Motion** for animations

### Backend Services

#### API Gateway (`apps/api`)

- **Node.js** with **Fastify**
- **tRPC** for type-safe APIs
- **Prisma** ORM with PostgreSQL
- **Redis** for caching
- **JWT** authentication

#### ML Service (`apps/ml-service`)

- **Python** with **FastAPI**
- **scikit-learn** for machine learning
- **Pandas & NumPy** for data processing
- Price prediction & demand forecasting

#### Search Engine (`apps/search-engine`)

- **Rust** with **Axum** web framework
- High-performance flight search
- **Elasticsearch** integration
- Geospatial queries

#### Authentication Service (`apps/auth-service`)

- **Node.js** microservice
- **JWT** & **bcrypt** for security
- **Redis** session management
- Rate limiting & security headers

### Infrastructure

- **PostgreSQL** with **TimescaleDB** for time-series data
- **Redis** for caching and sessions
- **OpenSearch** for full-text search
- **Prometheus** & **Grafana** for monitoring
- **Docker** containerization
- **Nginx** reverse proxy
- **Alert Service** - Node.js (NestJS + BullMQ)
- **ML Service** - Python (FastAPI + PyTorch/TensorFlow)

### Data & Storage

- **PostgreSQL + TimescaleDB** - Time-series data
- **DynamoDB** - Global metadata storage
- **Redis Enterprise** - Caching and queues
- **OpenSearch** - Full-text and geospatial search
- **S3 + Lake Formation** - Data lake

### Infrastructure

- **Terraform CDK** - Infrastructure as Code
- **Kubernetes (EKS)** - Container orchestration
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipelines
- **ArgoCD** - GitOps deployment

### Observability

- **OpenTelemetry** - Distributed tracing
- **Prometheus + Grafana** - Metrics and monitoring
- **Datadog/Sentry** - Error tracking and APM

## 🏗️ Project Structure

```
skyscout-ai/
├── apps/
│   ├── web/                    # Next.js frontend
│   ├── auth-service/           # Authentication microservice (NestJS)
│   ├── search-engine/          # Flight search service (Rust)
│   ├── search-fallback/        # Search fallback service (Go)
│   ├── alert-service/          # Alert & wishlist service (Node.js)
│   └── ml-service/             # ML forecasting service (Python)
├── libs/
│   ├── shared/                 # Shared TypeScript utilities
│   ├── ui/                     # Shared UI components
│   ├── trpc/                   # tRPC API definitions
│   └── types/                  # Shared type definitions
├── tools/
│   ├── eslint-config/          # ESLint configuration
│   └── webpack-config/         # Webpack configurations
├── infra/
│   ├── terraform/              # Terraform CDK infrastructure
│   ├── k8s/                    # Kubernetes manifests
│   └── docker/                 # Docker configurations
└── docs/                       # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Rust (for search engine)
- Go (for search fallback)
- Python 3.9+ (for ML service)

### Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/skyscout-ai.git
   cd skyscout-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development environment**

   ```bash
   # Start all services
   npm run dev

   # Or start specific services
   nx dev web                    # Frontend only
   nx dev auth-service          # Auth service only
   ```

4. **Run tests**

   ```bash
   npm test
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📚 Documentation

- [Architecture Overview](./docs/architecture.md)
- [API Documentation](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## 🔒 Security

We take security seriously. Please see our [Security Policy](./SECURITY.md) for reporting vulnerabilities.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

---

Built with ❤️ by the SkyScout AI Team
