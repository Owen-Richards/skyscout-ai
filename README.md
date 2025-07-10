# SkyScout AI 🚀

_A smart, AI-powered flight & trip discovery engine—your eyes on every sky._

## 🤖 AI-Powered Development

This repository is configured with AI-powered development workflows to accelerate feature development and maintain code quality. Our AI bots can:

- **Develop Features**: Create full features from issue descriptions
- **Code Reviews**: Automated code quality and architecture compliance
- **Maintenance**: Keep dependencies updated and code optimized
- **Documentation**: Generate and maintain comprehensive docs

### 🎯 Quick AI Commands

- **Request Feature Development**: Comment `/ai-develop <feature description>` on any issue
- **Trigger Maintenance**: Run automated code maintenance workflows
- **Get Code Review**: AI reviews all PRs automatically

---

## 🌟 Overview

SkyScout AI is a cutting-edge flight discovery platform that leverages artificial intelligence and machine learning to provide users with intelligent flight recommendations, price predictions, and personalized travel insights. Built with a modern microservices architecture and enterprise-grade technologies.

## 🔧 Tech Stack

### Monorepo & Developer Experience

- **Nx** - Monorepo orchestration with build optimization
- **TypeScript** - End-to-end type safety
- **ESLint + Prettier** - Code quality and formatting
- **Husky** - Git hooks for quality gates
- **AI Workflows** - Automated development and maintenance

### Frontend

- **Next.js 14** - App router with server components
- **React 18** - Modern React with concurrent features
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **tRPC** - Type-safe RPC between client and server
- **TanStack Query** - Data fetching and caching
- **Recharts** - Interactive price charts
- **Mapbox GL JS** - Interactive maps and heatmaps

### Backend Microservices

- **Auth Service** - NestJS + Passport.js + Auth0
- **Search Engine** - Rust (Actix-web) + Go (gRPC)
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
