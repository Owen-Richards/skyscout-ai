# 🤖 AI Agent Context Guide for SkyScout AI

## 🎯 Quick Reference for AI Agents

### Current Project State

- **Frontend**: Next.js 14 + React 18 + TypeScript + Tailwind CSS
- **Components**: Comprehensive UI library in `libs/ui/src/components/`
- **Architecture**: Clean Architecture with SOLID principles
- **Testing**: Jest + React Testing Library + Storybook
- **Performance**: Lighthouse monitoring + Bundle analysis

### 🎨 Established Component Patterns

```typescript
// Standard Component Pattern
interface ComponentProps extends ComponentProps<'div'> {
  variant?: 'default' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export function Component({
  variant = 'default',
  className,
  ...props
}: ComponentProps) {
  return (
    <div className={cn('base-styles', variantClasses[variant], className)} {...props} />
  );
}
```

### 📁 Key Directories for Development

```
libs/ui/src/components/     # Shared UI components (ESTABLISHED)
├── button.tsx             # ✅ Production ready
├── card.tsx               # ✅ Production ready
├── form.tsx               # ✅ Production ready
├── avatar.tsx             # ✅ Production ready
└── badge.tsx              # ✅ Production ready

apps/web/app/components/    # App-specific components
├── hero/                  # ✅ Hero sections implemented
├── navigation/            # ✅ Navigation implemented
└── trip-planning/         # 🔄 In development

apps/api/src/              # Backend API (NestJS + tRPC)
docs/                      # Comprehensive documentation
```

### 🎯 Component Development Checklist

When creating new components:

1. **Location**: Use `libs/ui/src/components/` for shared, `apps/web/app/components/` for app-specific
2. **Pattern**: Follow `ComponentProps<'element'>` pattern
3. **Styling**: Use `cn()` utility with Tailwind CSS
4. **Variants**: Implement with `class-variance-authority`
5. **Tests**: Add Jest + RTL tests (90%+ coverage)
6. **Stories**: Create Storybook stories
7. **Export**: Add to `index.ts` barrel export
8. **TypeScript**: Use strict mode, proper interfaces

### 🚀 Performance Standards

- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Lighthouse Scores**: Performance 90+, Accessibility 95+
- **Bundle Size**: Main bundle < 250KB, chunks < 200KB
- **Test Coverage**: 90%+ required

### 🧪 Testing Patterns

```typescript
// Component Test Pattern
import { render, screen } from '@testing-library/react';
import { ComponentName } from './component-name';

describe('ComponentName', () => {
  it('renders with default props', () => {
    render(<ComponentName />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ComponentName className="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
```

### 🎨 Storybook Pattern

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './component-name';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
export const Secondary: Story = { args: { variant: 'secondary' } };
```

### 🔧 Available NPM Scripts

```bash
# Development
npm run dev                 # Start all services
npm run dev:web            # Web app only
npm run dev:api            # API only

# Building
npm run build              # Build all
npm run mcp:build          # Build MCP server

# Testing
npm run test               # Run tests
npm run test:performance   # Performance tests

# Performance
npm run perf:monitor       # Run performance analysis
npm run perf:lighthouse    # Lighthouse audit
npm run perf:bundle        # Bundle analysis

# MCP Server
npm run mcp:start          # Start AI development server
```

### 🤖 AI Agent Instructions

#### For Component Development:

1. Check existing patterns in `libs/ui/src/components/button.tsx`
2. Use the established ComponentProps pattern
3. Follow Tailwind + cn() styling approach
4. Include comprehensive tests and stories
5. Export from index.ts

#### For Feature Development:

1. Reference `docs/clean-architecture-guide.md`
2. Use tRPC for type-safe APIs
3. Follow SOLID principles
4. Maintain performance standards
5. Include accessibility considerations

#### For Bug Fixes:

1. Run `npm test` first to check existing tests
2. Add regression tests
3. Check performance impact
4. Update documentation if needed

### 📊 Current Development Priorities

1. **Card Component** (NEXT) - Flight results display
2. **Search Components** - Flight search forms
3. **Trip Planning** - Itinerary management
4. **Performance Optimization** - Core Web Vitals
5. **Authentication** - User login/signup

### 🎯 Quick Commands for AI Agents

```bash
# Analyze project structure
cd apps/mcp-server && node dist/index.js

# Generate component
# Use MCP server tools: analyze_project_structure, generate_component

# Performance check
npm run perf:monitor

# Test specific component
npm test -- ComponentName
```

---

## 🚀 Getting Started for New AI Agents

1. **Read this guide** for context
2. **Check current state** in component directories
3. **Follow established patterns** from existing components
4. **Run tests** before and after changes
5. **Use MCP server** for development assistance

**Remember**: Quality over speed. Follow the established patterns and maintain the high standards already set in the codebase.
