# SkyScout AI GitHub Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
SkyScout AI is a cutting-edge flight discovery platform built with modern microservices architecture. The project uses:

- **Monorepo**: Nx workspace with TypeScript
- **Frontend**: Next.js 14 with App Router, React 18, Tailwind CSS, Radix UI
- **Backend**: Multiple microservices (NestJS, Rust, Go, Python)
- **APIs**: tRPC for type-safe communication
- **Data**: PostgreSQL, Redis, DynamoDB, OpenSearch
- **Infrastructure**: Kubernetes on AWS, Terraform CDK

## Coding Standards

### TypeScript
- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use Zod for runtime validation
- Follow functional programming patterns where possible

### React/Next.js
- Use App Router with server components by default
- Implement client components only when interactivity is needed
- Use Tailwind CSS for styling with design system tokens
- Follow accessibility best practices with Radix UI

### Backend Services
- Use dependency injection patterns
- Implement proper error handling and logging
- Follow RESTful API design for external APIs
- Use tRPC for internal service communication

### Code Quality
- Write comprehensive tests for all business logic
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Follow existing code patterns and conventions

## Architecture Patterns

### Microservices
- Each service should have a single responsibility
- Use event-driven architecture for service communication
- Implement circuit breakers and retry logic
- Follow the 12-factor app methodology

### Data Management
- Use appropriate databases for each use case
- Implement caching strategies at multiple layers
- Design for eventual consistency in distributed systems
- Follow CQRS patterns for read/write separation

### Security
- Implement OAuth2/JWT authentication
- Use environment variables for secrets
- Follow principle of least privilege
- Validate all inputs and sanitize outputs

## Performance Considerations
- Optimize for Core Web Vitals
- Implement lazy loading and code splitting
- Use CDN for static assets
- Monitor and optimize database queries

When suggesting code changes, consider the overall architecture and ensure consistency with these patterns.
