# Contributing to SkyScout AI

We welcome contributions to SkyScout AI! This document provides guidelines for contributing to the project.

## Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Rust (for search engine)
- Go (for search fallback)
- Python 3.9+ (for ML service)

### Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Start development environment: `npm run dev`
4. Make your changes
5. Test your changes: `npm test`
6. Submit a pull request

## Project Structure

```
skyscout-ai/
├── apps/                   # Applications
│   ├── web/               # Next.js frontend
│   ├── auth-service/      # Authentication service
│   ├── search-engine/     # Flight search (Rust)
│   ├── search-fallback/   # Search fallback (Go)
│   ├── alert-service/     # Alert service (Node.js)
│   └── ml-service/        # ML service (Python)
├── libs/                  # Shared libraries
│   ├── shared/           # Shared utilities
│   ├── ui/               # UI components
│   ├── trpc/             # API definitions
│   └── types/            # Type definitions
├── infra/                # Infrastructure
└── docs/                 # Documentation
```

## Coding Standards

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write comprehensive tests
- Use functional programming patterns
- Add JSDoc comments for public APIs

### React/Next.js
- Use App Router with server components by default
- Implement client components only when needed
- Use Tailwind CSS for styling
- Follow accessibility best practices

### Backend Services
- Use dependency injection
- Implement proper error handling
- Follow RESTful API design
- Use tRPC for type-safe communication

## Testing

- Write unit tests for all business logic
- Write integration tests for API endpoints
- Write E2E tests for critical user flows
- Maintain test coverage above 80%

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## Pull Request Process

1. Create a feature branch from `develop`
2. Make your changes
3. Write/update tests
4. Update documentation if needed
5. Ensure CI passes
6. Request review from maintainers
7. Address feedback
8. Merge when approved

## Architecture Guidelines

### Microservices
- Each service has a single responsibility
- Use event-driven architecture
- Implement circuit breakers
- Follow 12-factor app principles

### Security
- Never commit secrets
- Use environment variables
- Validate all inputs
- Follow security best practices

### Performance
- Optimize for Core Web Vitals
- Implement proper caching
- Use lazy loading
- Monitor performance metrics

## Questions?

If you have questions, please:
1. Check existing issues
2. Create a new issue for bugs
3. Start a discussion for questions
4. Join our Discord community

Thank you for contributing to SkyScout AI!
