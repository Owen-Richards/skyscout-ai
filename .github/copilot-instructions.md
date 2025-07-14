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

## AI Development Guidelines

### Autonomous Development

When building features, always:

1. Reference `.github/PROJECT_VISION.md` for project goals and priorities
2. Follow the established architecture patterns
3. Maintain type safety across all layers
4. Write comprehensive tests for new functionality
5. Update documentation alongside code changes
6. Consider performance and accessibility implications

### Code Quality Standards

#### TypeScript

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use Zod for runtime validation
- Follow functional programming patterns where possible
- Implement proper error handling with Result types

#### React/Next.js

- Use App Router with server components by default
- Implement client components only when interactivity is needed
- Use Tailwind CSS for styling with design system tokens
- Follow accessibility best practices with Radix UI
- Optimize for Core Web Vitals

#### Backend Services

- Use dependency injection patterns
- Implement proper error handling and logging
- Follow RESTful API design for external APIs
- Use tRPC for internal service communication
- Design for horizontal scalability

### Architecture Patterns

#### Microservices

- Each service should have a single responsibility
- Use event-driven architecture for service communication
- Implement circuit breakers and retry logic
- Follow the 12-factor app methodology
- Design for fault tolerance

#### Data Management

- Use appropriate databases for each use case
- Implement caching strategies at multiple layers
- Design for eventual consistency in distributed systems
- Follow CQRS patterns for read/write separation

#### Security

- Implement OAuth2/JWT authentication
- Use environment variables for secrets
- Follow principle of least privilege
- Validate all inputs and sanitize outputs

### Feature Development Process

1. **Planning**: Reference PROJECT_VISION.md for feature prioritization
2. **Design**: Create technical design documents for complex features
3. **Implementation**: Follow TDD approach with comprehensive testing
4. **Review**: Ensure code follows established patterns
5. **Documentation**: Update relevant docs and API specifications

### Performance Considerations

- Optimize for Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- Implement lazy loading and code splitting
- Use CDN for static assets
- Monitor and optimize database queries
- Design with caching in mind

### AI & ML Integration

- Use TypeScript for ML model interfaces
- Implement proper error handling for AI services
- Design for graceful degradation when AI features fail
- Monitor AI model performance and accuracy
- Ensure explainable AI decisions where required

### Testing Strategy

- Unit tests for all business logic
- Integration tests for API endpoints
- E2E tests for critical user journeys
- Performance tests for high-load scenarios
- Accessibility tests for UI components

### Deployment & DevOps

- Follow GitOps principles
- Use feature flags for gradual rollouts
- Implement proper monitoring and alerting
- Design for zero-downtime deployments
- Maintain environment parity

## Current Development Priorities

Based on PROJECT_VISION.md, focus on:

1. **High Priority**: UI components, authentication, flight search API
2. **Medium Priority**: Advanced search, user preferences, notifications
3. **Low Priority**: Social features, advanced AI, mobile apps

## Code Examples

### Component Structure

```tsx
// Follow this pattern for React components
'use client';

import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

interface ComponentNameProps extends ComponentProps<'div'> {
  variant?: 'default' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function ComponentName({
  variant = 'default',
  size = 'md',
  className,
  ...props
}: ComponentNameProps) {
  return (
    <div
      className={cn(
        'base-styles',
        {
          'variant-styles': variant === 'secondary',
          'size-styles': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
}
```

### API Route Pattern

```tsx
// Use this pattern for tRPC procedures
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const featureRouter = router({
  getData: publicProcedure
    .input(
      z.object({
        id: z.string(),
        filters: z.object({}).optional(),
      })
    )
    .query(async ({ input }) => {
      // Implementation
      return { data: [] };
    }),
});
```

When suggesting code changes, always consider the overall architecture and ensure consistency with these patterns. Always prioritize code quality, maintainability, and user experience when making suggestions.
