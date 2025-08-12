# 🏗️ SkyScout AI - Clean Architecture Guide

## 📁 Optimized Folder Structure

```
apps/web/app/
├── components/              # All UI components
│   ├── flights/            # Flight-specific components
│   ├── hero/               # Hero section components
│   ├── layout/             # Layout components
│   ├── navigation/         # Navigation components
│   ├── search/             # Search components
│   ├── deals/              # Deal components
│   ├── ui/                 # App-specific UI components
│   ├── providers/          # Context providers
│   └── index.ts            # Barrel exports
├── constants/              # Application constants
│   └── index.ts
├── contexts/              # React contexts
├── hooks/                 # Custom hooks
│   └── index.ts
├── lib/                   # Utility libraries
├── services/              # Business logic services
│   └── index.ts
├── types/                 # TypeScript type definitions
│   └── index.ts
├── flights/               # Flight pages
└── globals.css           # Global styles

libs/
├── shared/                # Shared utilities and types
├── ui/                    # Reusable UI components
└── trpc/                  # API layer
```

## 🚀 Development Best Practices

### Import Organization

- Always use barrel exports from index.ts files
- Prefer named imports over default imports
- Group imports: libraries, internal modules, relative imports

```typescript
// ✅ Good - Clean imports
import { Navigation, FlightSearchHero, FlightResults } from '../components';
import type { FlightSearch } from '@skyscout/shared';

// ❌ Bad - Verbose imports
import { Navigation } from '../components/layout/navigation';
import { FlightSearchHero } from '../components/flights/flight-search-hero';
```

### Component Organization

- One component per file
- Colocate related components in folders
- Use index.ts for barrel exports
- Follow naming conventions: PascalCase for components

### File Naming Conventions

- Components: `component-name.tsx`
- Hooks: `use-hook-name.ts`
- Types: `feature-name.ts`
- Services: `service-name.service.ts`
- Constants: `feature-constants.ts`

## 🧹 Removed Files (Dead Code)

### Eliminated Duplicates

- ❌ `enhanced-hero.tsx` → Replaced by organized hero components
- ❌ `quick-search.tsx` → Consolidated into flight-quick-search.tsx
- ❌ `map-view.tsx` → Replaced by flight-map.tsx
- ❌ `advanced-navigation.tsx` → Replaced by layout/navigation.tsx
- ❌ `architecture-demo.tsx` → Demo code removed
- ❌ `search-form.tsx` → Replaced by organized search components

### Build Artifacts Cleaned

- ❌ `.next/` directories
- ❌ `tsconfig.tsbuildinfo` files
- ❌ `dist/` directories

## 📝 Index File Strategy

Each major directory has an `index.ts` file that:

1. Exports all public components/functions
2. Provides a single import source
3. Simplifies dependency management
4. Enables better tree-shaking

## 🔄 Migration Benefits

### For Developers

- **Faster Navigation**: Clear folder structure
- **Easier Imports**: Barrel exports reduce import complexity
- **Better IntelliSense**: Centralized exports improve autocomplete
- **Reduced Cognitive Load**: Logical organization

### For AI Agents

- **Predictable Structure**: Consistent patterns for code generation
- **Clear Boundaries**: Well-defined component responsibilities
- **Easy Refactoring**: Centralized exports simplify updates
- **Better Context**: Organized structure improves understanding

## 🚀 Quick Start Commands

```bash
# Development
npm run dev

# Clean build
npm run clean && npm run build

# Type checking
npm run type-check

# Linting with auto-fix
npm run lint:fix

# Format code
npm run format
```

## 🔍 Code Quality Tools

- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **TypeScript**: Type safety
- **Husky**: Git hooks for quality gates
- **Lint-staged**: Pre-commit checks

This optimized structure provides a solid foundation for rapid development while maintaining code quality and organization.
