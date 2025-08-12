# Micro-Frontend Architecture for Team Scalability

## Current Challenge

As your team grows, having one large Next.js app can become a bottleneck:

- Merge conflicts increase
- Build times get longer
- Teams can't deploy independently
- Technology choices are locked

## Micro-Frontend Solution

Split your frontend into independently deployable micro-apps:

```
Shell App (Next.js)
├── Flight Search MFE (React/Vite)
├── Trip Planning MFE (Next.js)
├── User Profile MFE (Svelte/SvelteKit)
├── Booking MFE (React/Vite)
└── Admin Dashboard MFE (Vue/Nuxt)
```

## Implementation with Module Federation

```typescript
// apps/shell/next.config.js
const ModuleFederationPlugin = require('@module-federation/nextjs-mf');

module.exports = {
  webpack: (config, options) => {
    config.plugins.push(
      new ModuleFederationPlugin({
        name: 'shell',
        remotes: {
          flightSearch: 'flightSearch@http://localhost:3001/remoteEntry.js',
          tripPlanning: 'tripPlanning@http://localhost:3002/remoteEntry.js',
          userProfile: 'userProfile@http://localhost:3003/remoteEntry.js',
        },
        shared: {
          react: { singleton: true },
          'react-dom': { singleton: true },
          '@skyscout/ui': { singleton: true },
        },
      })
    );
    return config;
  },
};

// apps/shell/src/app/search/page.tsx
import dynamic from 'next/dynamic';

const FlightSearchApp = dynamic(() => import('flightSearch/App'), {
  ssr: false,
  loading: () => <div>Loading Flight Search...</div>,
});

export default function SearchPage() {
  return (
    <div className="min-h-screen">
      <FlightSearchApp />
    </div>
  );
}

// apps/flight-search-mfe/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'flightSearch',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        '@skyscout/ui': { singleton: true },
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});
```

## Benefits

1. **Team Independence**: Each team owns their micro-frontend
2. **Technology Flexibility**: Different MFEs can use different frameworks
3. **Deployment Independence**: Deploy features without affecting others
4. **Performance**: Lazy load only needed functionality
5. **Scaling**: Teams can scale independently

## Shared Design System

Keep UI consistency with your shared library:

```typescript
// libs/ui remains the single source of truth
// All micro-frontends import from @skyscout/ui

// Shared theme and tokens
export const theme = {
  colors: {
    primary: 'hsl(210, 100%, 50%)',
    // ... your existing theme
  },
  // ... rest of design system
};

// Each MFE wraps its root with ThemeProvider
function App() {
  return (
    <ThemeProvider theme={theme}>
      <FlightSearchFeature />
    </ThemeProvider>
  );
}
```

## Communication Between MFEs

```typescript
// Shared event bus for MFE communication
export class MFEEventBus {
  private events = new Map<string, Array<(data: any) => void>>();

  emit(event: string, data: any) {
    const handlers = this.events.get(event) || [];
    handlers.forEach(handler => handler(data));
  }

  on(event: string, handler: (data: any) => void) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(handler);
  }

  off(event: string, handler: (data: any) => void) {
    const handlers = this.events.get(event) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) handlers.splice(index, 1);
  }
}

// Usage in MFEs
const eventBus = new MFEEventBus();

// Flight Search MFE
eventBus.emit('flight-selected', { flight: selectedFlight });

// Trip Planning MFE
eventBus.on('flight-selected', data => {
  addFlightToTrip(data.flight);
});
```

## Migration Strategy

1. **Phase 1**: Extract one feature to MFE (start with flight search)
2. **Phase 2**: Move trip planning to separate MFE
3. **Phase 3**: Extract user profile and settings
4. **Phase 4**: Split remaining features as needed

This approach allows gradual migration without disrupting current development.
