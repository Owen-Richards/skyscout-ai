# SkyScout AI ✈️

> A comprehensive AI-powered travel platform—flight discovery, trip planning, and budget management all in one place.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=flat&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Rust](https://img.shields.io/badge/Rust-000000?style=flat&logo=rust&logoColor=white)](https://www.rust-lang.org/)

## ✨ New Features

🎯 **Trip Management System** - Complete itinerary planning with collaborative features  
💰 **Budget Tracking** - Real-time expense monitoring and budget management  
📊 **Performance Monitoring** - Bundle analysis and Lighthouse integration  
🏨 **Hotel Integration** - Enhanced accommodation search and deals  
🔐 **Enhanced Authentication** - Redis-powered session management

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

- **Frontend**: http://localhost:3000 (Trip planning & flight search)
- **API Gateway**: http://localhost:3001 (tRPC endpoints)
- **ML Service**: http://localhost:8000 (Price prediction)
- **Search Engine**: http://localhost:8080 (High-performance search)
- **Monitoring**: http://localhost:3002 (Grafana dashboard)
- **Performance Dashboard**: Built-in performance monitoring

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

- **Next.js 14** with App Router & React 18
- **TypeScript** with strict mode for type safety
- **Tailwind CSS** with custom design system
- **tRPC** for end-to-end type safety
- **Framer Motion** for smooth animations
- **Comprehensive UI Library** (@skyscout/ui)
- **Performance Monitoring** with Lighthouse integration
- **Bundle Analysis** with size optimization

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

- **Node.js** microservice with Express
- **JWT** & **bcrypt** for security
- **Redis** session management & caching
- Rate limiting & security headers
- Real-time authentication state

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
│   ├── web/                    # Next.js frontend with trip planning
│   ├── api/                    # tRPC API gateway
│   ├── auth-service/           # Authentication microservice (Node.js)
│   ├── search-engine/          # Flight search service (Rust)
│   ├── flight-aggregation-service/ # Flight data aggregation (NestJS)
│   ├── ml-service/             # ML forecasting service (Python)
│   └── ai-prediction-engine/   # AI price prediction (Python)
├── libs/
│   ├── shared/                 # Shared TypeScript utilities & validators
│   ├── ui/                     # Comprehensive UI component library
│   ├── trpc/                   # tRPC API definitions & routers
│   └── types/                  # Shared type definitions
├── scripts/
│   ├── performance-monitor.js  # Performance monitoring & analysis
│   ├── autonomous-dev.js       # AI development automation
│   └── setup-dev.sh           # Development environment setup
├── docs/
│   ├── performance-monitoring-guide.md
│   ├── bundle-size-analysis-guide.md
│   ├── clean-architecture-guide.md
│   └── i18n-guide.md          # Internationalization guide
├── infra/
│   ├── grafana/               # Monitoring dashboards
│   ├── prometheus/            # Metrics collection
│   └── sql/                   # Database initialization
└── .github/
    ├── copilot-instructions.md # AI development guidelines
    ├── workflows/             # CI/CD pipelines
    └── ISSUE_TEMPLATE/        # Issue templates
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
   # Start all services with performance monitoring
   npm run dev

   # Or start specific services
   npm run dev:web              # Frontend with trip planning
   npm run dev:api              # API gateway
   npm run dev:auth             # Authentication service

   # Performance monitoring
   npm run perf:monitor         # Performance analysis
   npm run perf:lighthouse      # Lighthouse audit
   npm run perf:analyze         # Bundle size analysis
   ```

4. **Run tests**

   ```bash
   npm test
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🎯 Key Features

### 🧳 Trip Management

- **Comprehensive Itinerary Planner** - Detailed day-by-day planning with activity optimization
- **Collaborative Planning** - Real-time collaboration with travel companions
- **Budget Tracking** - Advanced expense management with category-based analysis
- **Trip Dashboard** - Centralized view of all your travel plans

### ✈️ Flight Discovery

- **Smart Search Engine** - AI-powered flight search with price prediction
- **Price Alerts** - Intelligent monitoring for fare changes
- **Flexible Date Search** - Find the best deals across date ranges
- **Multi-city Planning** - Complex itinerary support

### 🏨 Accommodation & More

- **Hotel Integration** - Comprehensive accommodation search
- **Provider Comparison** - Compare prices across multiple platforms
- **Deal Discovery** - Curated travel deals and packages

### 🔧 Developer Experience

- **Performance Monitoring** - Built-in Lighthouse integration and bundle analysis
- **Type Safety** - End-to-end TypeScript with tRPC
- **Modern Architecture** - Microservices with Docker support
- **AI Development Tools** - GitHub Copilot integration and autonomous development scripts

## 📚 Documentation

- [Performance Monitoring Guide](./docs/performance-monitoring-guide.md) - Comprehensive performance analysis
- [Bundle Size Analysis Guide](./docs/bundle-size-analysis-guide.md) - Optimize application bundles
- [Clean Architecture Guide](./docs/clean-architecture-guide.md) - SOLID principles & patterns
- [Internationalization Guide](./docs/i18n-guide.md) - Multi-language support
- [Development Guide](./DEVELOPMENT.md) - Development setup and workflows
- [Contributing Guidelines](./CONTRIBUTING.md) - How to contribute

## 🔒 Security

We take security seriously. Please see our [Security Policy](./SECURITY.md) for reporting vulnerabilities.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

---

Built with ❤️ by the SkyScout AI Team
