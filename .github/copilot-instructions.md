# SkyScout AI GitHub Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

SkyScout AI is a comprehensive "Everyone Travel" platform with standout group planning and multi-modal transport support. Built with modern microservices architecture:

- **Monorepo**: Nx workspace with TypeScript
- **Frontend**: Next.js 14 (App Router) + React 18, Tailwind CSS, Radix UI, tRPC
- **Backend**: NestJS (APIs/queues), Go (user/booking), FastAPI (Python ML), Rust (search/ranking)
- **Data**: PostgreSQL, OpenSearch/Elasticsearch, Valkey/Redis, Stripe
- **Infrastructure**: CI/CD, feature flags, .env per app

## Mission & Guardrails

**Objective**: Implement revenue-focused features that make SkyScout a great tool for everyone, with standout group planning and multi-modal support (flights, trains, buses, car rental, RV, camping, hotels, activities). Prioritize clarity, speed, transparency, and safety.

**Guardrails**:

- ✅ **Do**: Use inclusive language and neutral examples (friends, clubs, teams, classmates, coworkers)
- ❌ **Don't**: Mention fraternities/sororities or endorse alcohol/unsafe behavior
- 🔒 **Always**: Disclose fees; never dark-pattern; follow accessibility (WCAG 2.1 AA)

## Feature Roadmap (Implementation Priority)

### A) Consumer Core (clarity + trust + speed)

1. **Flight Matchmaking (Top-3)**: Rank by price, time, stops, comfort - show 3 best with trade-offs
2. **True Total Cost**: Line-items for base fare, bags, seats, card perks, resort/camp/parking/toll estimates
3. **Price-Confidence Booking Advisor**: "Book now or wait" with confidence and expected range
4. **Price Tracking & Alerts**: Route/date watchlist with threshold logic and digests
5. **Persistent Personalization**: Cabin prefs, max layover, carrier preferences, auto-applied
6. **Unified Itinerary**: Transport + stay + activities with timeline and export (ICS/PDF)
7. **Performance**: Sub-2s page loads, <500ms filter interactions, URL-persisted filters

### B) Group Planning (shared ownership, async)

1. **Trip Workspace**: Invite links with role-scoped tabs (Overview, Proposals, Polls, Availability, Itinerary, Lodging/Rooms, Expenses, Payments, Governance, Messages)
2. **Trip Charter (Governance)**: Voting methods, consensus thresholds, quorum, veto windows, multisig approvals
3. **Proposals & Constraint-Aware Polls**: Dates, destinations, flights, lodging, activities, budgets, transport
4. **Commit & Split Pay**: "I'm in" deposits, equal/by-room/custom splits, BNPL adapter, dropout rebalance
5. **Digests & Change Tracking**: Nightly summaries, "since last visit" banners, version history

### C) Attach & Monetization

1. **Bundles Engine**: Post-selection suggestions for hotels, activities, car rental, RV, camping, insurance
2. **Premium Subscription**: Advanced alerts, historical charts, advisor+, offline itinerary pack
3. **Transparent Service Fee**: 2–6% per trip with cap, shown in ledger
4. **Org Workspaces/Licenses**: For clubs/teams/companies (branding, policies, SSO)
5. **Concierge**: Safe/neutral itinerary curation, name changes, seating assistance (multisig-gated)

### D) Multi-Modal Expansion

1. **Transport Types**: Flights, trains, buses, car rental, RV, camping
2. **Partner Adapters**: Rail/bus providers, car/rental aggregators, RV marketplaces, campground sources
3. **Routing UI**: Compare time/cost/comfort across modes

### E) Post-Booking Experience

1. **Smart Reminders**: Check-in, gate/platform changes, seat maps, room assignments, local transit
2. **Trip Pack**: Downloadable/printable trip pack, calendar export

### F) Observability, Security, Ethics

1. **OpenTelemetry**: Across all services with PII redaction
2. **Security**: Rate-limit writes, idempotency keys, per-trip row-level security
3. **Ethics**: Accessibility tests, safe language, no risky behavior endorsements

## Architecture Patterns & Key Types

### Core DTOs/Types (TypeScript)

```typescript
// Travel Preferences
export type TravelPrefs = {
  cabin?: 'economy' | 'premium_economy' | 'business' | 'first';
  maxLayoverMins?: number;
  avoidOvernight?: boolean;
  preferredCarriers?: string[];
  includeLCC?: boolean;
  loyalty?: { program: string; memberId?: string }[];
};

// Price Advisor
export interface PriceAdviceReq {
  origin: string;
  dest: string;
  depart: string;
  return?: string;
  carrierHints?: string[];
  observedFare: number;
}
export interface PriceAdviceRes {
  action: 'book' | 'wait';
  confidence: number;
  expectedRange: { min: number; max: number };
  reasons: string[];
}

// Group Planning & Governance
export type VotingMethod = 'approval' | 'ranked' | 'score';
export interface Charter {
  votingMethod: VotingMethod;
  consensusThreshold: number;
  quorum: number;
  vetoWindowHours: number;
  multisigPolicy: Record<string, number>;
}
export type ProposalType =
  | 'dates'
  | 'destination'
  | 'flight'
  | 'lodging'
  | 'activity'
  | 'budget'
  | 'transport'
  | 'charter';
export interface Proposal<T = any> {
  id: string;
  tripId: string;
  type: ProposalType;
  title: string;
  data: T;
  status: 'open' | 'soft_locked' | 'hard_locked' | 'archived';
  deadline?: string;
  version: number;
}
export interface Vote {
  proposalId: string;
  userId: string;
  method: VotingMethod;
  choice?: string;
  rank?: number;
  constraints?: Record<string, any>;
}
export interface Consensus {
  proposalId: string;
  score: number;
  rationale: string[];
  tallies: Record<string, number>;
  quorumMet: boolean;
}
export interface Commitment {
  id: string;
  tripId: string;
  userId: string;
  status: 'committed' | 'pending_payment' | 'paid' | 'refunded' | 'dropped';
  shareAmountCents: number;
}
```

### API Contracts (Extended)

```bash
# Search & Advisory
POST /v1/search            -> results with top-3 summary (supports mode: flight|train|bus|car|rv|camp)
POST /v1/fees/estimate     -> { lineItems[], total }
POST /v1/price/advice      -> { action, confidence, expectedRange, reasons }
POST /v1/alerts/subscribe  -> route/date watch
GET  /v1/user/prefs        ; PUT /v1/user/prefs

# Group Planning
POST /v1/groups/trips      -> { tripId, inviteLink }
POST /v1/groups/proposals  -> create proposal
POST /v1/groups/votes      -> cast vote
GET  /v1/groups/consensus/:proposalId
POST /v1/groups/lock/:id   -> soft/hard lock (idempotent; respects veto + multisig)

# Payments & Bundles
POST /v1/payments/intents  -> stripe client secret
POST /v1/partners/bundles  -> suggested hotel/activity/car/rv/camp bundles
```

### Multi-Modal Transport Support

**Transport Types**: flights, trains, buses, car rental, RV, camping
**Partner Adapters**: Rail/bus providers, car/rental aggregators, RV marketplaces, campground sources
**Routing Engine**: Compare time/cost/comfort across all modes

### Performance Requirements

- **Page Loads**: Sub-2s initial load
- **Filter Interactions**: <500ms response time
- **API Response**: <200ms internal response where cached
- **Search Results**: p95 < 500ms for filter changes

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

### Implementation Plan Structure

**Branch Pattern**: `feat/everyone-travel-m1`

**File Structure for New Features**:

```
apps/web/src/app/(search)/page.tsx        # Search shell with matchmaking & filters
apps/web/src/components/search/TopThree.tsx       # Trade-offs widget
apps/web/src/components/cost/TotalTripCost.tsx    # Line-items + grand total
apps/web/src/components/advisor/PriceAdvisor.tsx  # Booking advisor
apps/web/src/components/alerts/TrackPriceButton.tsx    # Price tracking
apps/web/src/app/settings/preferences/page.tsx    # TravelPrefs form (Zod)
apps/web/src/app/itinerary/[tripId]/page.tsx     # Unified itinerary + exports
apps/web/src/app/groups/[tripId]/**              # Workspace tabs, governance, payments

# Backend Services
apps/search-rs/src/ranker.rs             # Scoring with prefs & comfort signals
apps/fees/src/main.ts                    # Multi-modal fee estimation
apps/api-ml/app/price_advisor.py         # Price advice ML model
apps/notifications/src/price_watch.processor.ts  # Price alerts
apps/group-svc/**                        # Trip management, proposals, votes
apps/payments/src/**                     # Stripe intents, refunds, ledger
apps/partners/src/adapters/              # Multi-modal transport adapters
```

### Acceptance Criteria Standards

**Clarity**: True total cost shows itemized fees; changes reflect instantly
**Advisor**: Returns consistent action + confidence; flips appropriately as fares change
**Price Tracking**: Create/delete watch; simulated alert delivered in dev
**Preferences**: Saved and auto-applied to new searches
**Group Flow**: Proposal → quorum → soft-lock → veto window → multisig → hard-lock
**Bundles**: Post-selection suggestions appear with working deep links
**Performance**: p95 < 500ms for filter changes; < 200ms internal API response where cached
**Accessibility**: Keyboard navigation, ARIA roles, color contrast
**Security**: Inputs validated; secrets not logged; rate limits on writes; idempotency keys

### Testing Strategy

**Unit Tests**: Ranker, total-cost calc, advisor baseline, governance engine
**Contract Tests**: tRPC/REST schemas validation
**E2E Tests**: Complete user journeys with Playwright
**Integration Tests**: Multi-service workflows

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
