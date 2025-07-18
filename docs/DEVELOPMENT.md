# SkyScout AI - Development Environment

## Quick Start

To start the complete development environment:

```bash
# Windows
./scripts/setup-dev.bat

# macOS/Linux
./scripts/setup-dev.sh
```

## Services Overview

| Service           | Port | Description                       |
| ----------------- | ---- | --------------------------------- |
| **Frontend**      | 3000 | Next.js web application           |
| **API Gateway**   | 3001 | Node.js/Fastify with tRPC         |
| **ML Service**    | 8000 | Python FastAPI for predictions    |
| **Search Engine** | 8080 | Rust-based search service         |
| **PostgreSQL**    | 5432 | Primary database with TimescaleDB |
| **Redis**         | 6379 | Caching and session storage       |
| **OpenSearch**    | 9200 | Full-text search and analytics    |
| **Prometheus**    | 9090 | Metrics collection                |
| **Grafana**       | 3002 | Monitoring dashboards             |

## Individual Service Commands

### Start all services

```bash
docker-compose up -d
```

### View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f ml-service
docker-compose logs -f web
```

### Restart services

```bash
# All services
docker-compose restart

# Specific service
docker-compose restart api
```

### Stop services

```bash
docker-compose down
```

### Rebuild services

```bash
# Rebuild all
docker-compose build

# Rebuild specific service
docker-compose build api
```

## Database Operations

### Run migrations

```bash
npx prisma migrate dev
```

### Reset database

```bash
npx prisma migrate reset
```

### View database

```bash
npx prisma studio
```

## Environment Variables

Create `.env` files in each service directory:

### API Service (.env)

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/skyscout
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret-here
ML_SERVICE_URL=http://localhost:8000
SEARCH_SERVICE_URL=http://localhost:8080
```

### ML Service (.env)

```env
REDIS_URL=redis://localhost:6379
MODEL_CACHE_TTL=3600
```

## Health Checks

- Frontend: http://localhost:3000
- API: http://localhost:3001/health
- ML Service: http://localhost:8000/health
- Search Engine: http://localhost:8080/health

## Monitoring

- **Grafana**: http://localhost:3002 (admin/admin)
- **Prometheus**: http://localhost:9090
- **OpenSearch**: http://localhost:9200

## Troubleshooting

### Port conflicts

If ports are in use, stop conflicting services or modify ports in `docker-compose.yml`

### Database connection issues

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart database
docker-compose restart postgres
```

### Memory issues

Increase Docker memory allocation to at least 4GB for optimal performance.

### SSL certificates

For local HTTPS, SSL certificates are auto-generated in `nginx/ssl/`
