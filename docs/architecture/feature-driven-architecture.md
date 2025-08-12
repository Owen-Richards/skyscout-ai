# Feature-Driven Architecture Pattern

## Current vs Recommended Structure

### Current Structure

```
apps/web/app/components/
├── hero/
├── search/
├── flights/
├── deals/
└── layout/
```

### Recommended Feature-Driven Structure

```
apps/web/app/features/
├── flight-search/
│   ├── components/
│   │   ├── search-form.tsx
│   │   ├── search-filters.tsx
│   │   └── search-results.tsx
│   ├── hooks/
│   │   ├── use-flight-search.ts
│   │   └── use-search-filters.ts
│   ├── services/
│   │   └── flight-search.service.ts
│   ├── types/
│   │   └── flight-search.types.ts
│   ├── utils/
│   │   └── search-helpers.ts
│   └── index.ts
├── trip-planning/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── stores/
├── user-profile/
└── shared/
    ├── components/
    ├── hooks/
    ├── utils/
    └── types/
```

## Benefits

1. **Easier Navigation**: Developers can find everything related to a feature in one place
2. **Better Encapsulation**: Feature-specific logic is contained within its boundary
3. **Team Scalability**: Multiple teams can work on different features without conflicts
4. **Easier Testing**: Test entire features as units
5. **Code Reuse**: Shared utilities are clearly separated

## Implementation Pattern

```typescript
// features/flight-search/index.ts
export { FlightSearchForm } from './components/search-form';
export { useFlightSearch } from './hooks/use-flight-search';
export { flightSearchService } from './services/flight-search.service';
export type { FlightSearchQuery } from './types/flight-search.types';

// features/flight-search/components/search-form.tsx
import { useFlightSearch } from '../hooks/use-flight-search';
import { flightSearchService } from '../services/flight-search.service';
import type { FlightSearchQuery } from '../types/flight-search.types';

export function FlightSearchForm() {
  const { search, isLoading } = useFlightSearch();
  // Component implementation
}
```

## Migration Strategy

1. **Phase 1**: Create feature directories alongside existing structure
2. **Phase 2**: Move related components to feature boundaries
3. **Phase 3**: Extract feature-specific hooks and services
4. **Phase 4**: Update imports and remove old structure
