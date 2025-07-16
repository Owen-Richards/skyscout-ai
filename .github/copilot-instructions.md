# SkyScout AI GitHub Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

SkyScout AI is a cutting-edge flight discovery platform built with modern microservices architecture. The project uses:

- **Monorepo**: Nx workspace with TypeScript
- **Frontend**: Next.js 14 with App Router, React 18, Tailwind CSS, custom UI library (@skyscout/ui)
- **Backend**: Multiple microservices (NestJS, Rust, Go, Python) - planned
- **APIs**: tRPC for type-safe communication between frontend and backend
- **Data**: PostgreSQL, Redis, DynamoDB, OpenSearch - planned
- **Infrastructure**: Kubernetes on AWS, Terraform CDK - planned
- **Current State**: Frontend-focused with UI component library, hero sections, navigation, and basic tRPC setup

## AI Development Guidelines

### Autonomous Development

When building features, always:

1. Reference `.github/PROJECT_VISION.md` for project goals and priorities
2. Follow the established SOLID principles architecture patterns (see `docs/clean-code-refactoring.md`)
3. Maintain type safety across all layers using TypeScript strict mode
4. Write comprehensive tests for new functionality (minimum 90% coverage)
5. Update documentation alongside code changes
6. Consider performance, accessibility, and i18n implications
7. Use the existing component patterns found in `libs/ui/src/components/`
8. Follow the established folder structure patterns for component organization

### Codebase Architecture Patterns

#### Component Structure (Current Implementation)

Follow these established patterns from the codebase:

```typescript
// Component file header with purpose documentation
/**
 * Component Name
 * Following SOLID principles and Clean Code practices
 *
 * - Single Responsibility: Only handles [specific purpose]
 * - Open/Closed: Easy to extend with [extensibility plan]
 * - Dependencies: [list key dependencies and abstractions]
 */

'use client'; // When client-side interactivity is needed

import { cn } from '@skyscout/ui'; // Use the shared utility
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

#### Folder Organization (Established Pattern)

```
apps/web/app/components/
├── hero/                    # Hero section components
│   ├── hero-section.tsx
│   ├── hero-content.tsx
│   ├── hero-background.tsx
│   └── index.ts             # Barrel exports
├── layout/                  # Layout components
│   ├── navigation.tsx       # Main navigation
│   ├── navigation-logo.tsx
│   └── navigation-items.tsx
├── search/                  # Search-related components
│   ├── fields/             # Individual form fields
│   ├── forms/              # Complete form compositions
│   └── index.ts
├── deals/                   # Deal display components
└── ui/                      # App-specific UI components

libs/ui/src/components/      # Shared UI library
├── button.tsx              # Production-ready components
├── card.tsx               # with comprehensive variants
├── form.tsx               # react-hook-form integration
└── theme-provider.tsx     # Dark/light theme support
```

### Code Quality Standards

#### TypeScript (Strictly Enforced)

- Use strict TypeScript configuration (already configured)
- Prefer `interface` over `type` for object shapes
- Use Zod for runtime validation (see `libs/shared/src/validators.ts`)
- Follow functional programming patterns where possible
- Implement proper error handling with Result types
- Use `readonly` for immutable props and data structures
- Import types with `import type` when importing only for types

Example from codebase:

```typescript
// From libs/shared/src/validators.ts
export const FlightSearchSchema = z.object({
  origin: z.string().min(3).max(3),
  destination: z.string().min(3).max(3),
  departureDate: z.string().datetime(),
  returnDate: z.string().datetime().optional(),
  passengers: z.number().min(1).max(9),
  class: z
    .enum(['economy', 'premium_economy', 'business', 'first'])
    .default('economy'),
});

export type FlightSearch = z.infer<typeof FlightSearchSchema>;
```

#### React/Next.js (Current Patterns)

- Use App Router with server components by default
- Implement client components only when interactivity is needed (mark with `'use client'`)
- Use Tailwind CSS for styling with design system tokens from `libs/ui/tailwind.config.js`
- Follow accessibility best practices with semantic HTML and ARIA attributes
- Optimize for Core Web Vitals
- Use the established i18n system with `useAppTranslation()` hook
- Import from `@skyscout/ui` for shared components

Example component pattern:

```tsx
// From apps/web/app/components/layout/navigation.tsx
'use client';

import { cn, ThemeToggle } from '@skyscout/ui';
import { useNavigationState } from '../../hooks/use-navigation';

interface NavigationProps {
  readonly className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const { isMobileMenuOpen, isScrolled, toggleMobileMenu } =
    useNavigationState();

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-lg shadow-lg'
          : 'bg-background/80 backdrop-blur-sm',
        className
      )}
    >
      {/* Implementation */}
    </nav>
  );
}
```

#### Styling Conventions (Established)

- Use Tailwind CSS with the custom design system
- Leverage CSS custom properties for theming: `hsl(var(--primary))`
- Use glass morphism utilities: `.glass-card`, `.glass-morphism`
- Animation classes: `.animate-float`, `.hover-lift`, `.shimmer`
- Follow the color system from `libs/ui/tailwind.config.js`
- Brand colors: Sky gradients for SkyScout branding

#### Backend Services (Planned Implementation)

- Use dependency injection patterns
- Implement proper error handling and logging
- Follow RESTful API design for external APIs
- Use tRPC for internal service communication (see `libs/trpc/src/`)
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
