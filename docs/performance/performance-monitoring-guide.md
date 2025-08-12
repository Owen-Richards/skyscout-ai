# Performance Monitoring & Bundle Analysis Guide

> Complete guide to maintaining optimal performance in SkyScout AI

## 🎯 Overview

This guide covers the comprehensive performance monitoring system implemented for SkyScout AI, including:

- **Lighthouse audits** for Core Web Vitals and performance metrics
- **Bundle analysis** for monitoring JavaScript bundle sizes
- **Automated CI/CD integration** for performance regression detection
- **Real-time monitoring** during development
- **Performance budgets** and optimization strategies

## 🛠️ Setup & Installation

### 1. Dependencies

The performance monitoring system requires the following packages:

```bash
# Install at workspace root
npm install --save-dev lighthouse size-limit @size-limit/file

# Or manually install Lighthouse globally
npm install -g lighthouse
```

### 2. Configuration Files

The system includes several configuration files:

- `scripts/performance-monitor.js` - Core monitoring script
- `scripts/performance-cicd.js` - CI/CD integration
- `apps/web/.size-limit.json` - Bundle size limits
- `.github/workflows/performance.yml` - GitHub Actions workflow

## 🚀 Quick Start

### Basic Performance Monitoring

```bash
# Run full performance analysis (Lighthouse + Bundle)
npm run perf:monitor

# Run only Lighthouse audit
npm run perf:lighthouse

# Run only bundle analysis
npm run perf:bundle

# Analyze bundle with visual breakdown
npm run perf:analyze
```

### CI/CD Integration

```bash
# Set performance baseline (first time)
npm run perf:baseline

# Check for performance regressions
npm run perf:ci
```

## 📊 Available Tools

### 1. Lighthouse Performance Audits

**What it does:**

- Measures Core Web Vitals (LCP, FID, CLS)
- Audits performance, accessibility, SEO, and PWA compliance
- Generates detailed HTML and JSON reports

**Usage:**

```bash
# Run Lighthouse audit
cd apps/web
npm run perf:lighthouse

# Start server and run audit automatically
npm run speed-test
```

**Thresholds:**

- Performance: ≥90%
- Accessibility: ≥95%
- Best Practices: ≥90%
- SEO: ≥95%
- PWA: ≥80%

**Core Web Vitals:**

- LCP (Largest Contentful Paint): ≤2.5s
- FID (First Input Delay): ≤100ms
- CLS (Cumulative Layout Shift): ≤0.1

### 2. Bundle Size Analysis

**What it does:**

- Analyzes JavaScript bundle sizes
- Identifies large dependencies
- Tracks bundle size over time
- Provides visual bundle breakdown

**Usage:**

```bash
# Analyze bundle with visual report
npm run analyze

# Check bundle sizes against limits
cd apps/web && npx size-limit

# Generate bundle stats
npm run bundle:stats
```

**Size Limits:**

- Main bundle: ≤250 KB
- Individual chunks: ≤100 KB
- Total bundle: ≤500 KB

### 3. Performance Dashboard (Development)

**What it does:**

- Real-time performance metrics display
- Shows Core Web Vitals, memory usage, and network info
- Only visible in development mode

**Usage:**
Add to your layout or component:

```tsx
import { PerformanceDashboard } from '../components/dev/performance-dashboard';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <PerformanceDashboard position="bottom-right" />
    </div>
  );
}
```

### 4. Automated CI/CD Monitoring

**What it does:**

- Runs performance checks on every PR
- Detects performance regressions
- Posts results as PR comments
- Fails CI if thresholds are exceeded

**Setup:**
The GitHub Actions workflow (`.github/workflows/performance.yml`) automatically:

1. Runs Lighthouse audits
2. Analyzes bundle sizes
3. Compares against baseline
4. Comments results on PRs

## 🛠️ Configuration

### Performance Thresholds

Edit `scripts/performance-monitor.js` to adjust thresholds:

```javascript
const CONFIG = {
  lighthouse: {
    thresholds: {
      performance: 90,
      accessibility: 95,
      bestPractices: 90,
      seo: 95,
      pwa: 80,
    },
    coreWebVitals: {
      lcp: 2.5, // seconds
      fid: 0.1, // seconds
      cls: 0.1, // score
    },
  },
  bundle: {
    maxMainBundleSize: 250, // KB
    maxChunkSize: 100, // KB
    maxTotalSize: 500, // KB
    alertThreshold: 0.1, // 10% increase
  },
};
```

### Bundle Size Limits

Edit `apps/web/.size-limit.json`:

```json
[
  {
    "name": "Main Bundle",
    "path": "apps/web/.next/static/chunks/pages/_app-*.js",
    "limit": "250 KB",
    "gzip": true
  }
]
```

### Next.js Bundle Optimization

The `apps/web/next.config.js` includes optimizations:

```javascript
const nextConfig = {
  experimental: {
    optimizeCss: true,
    turbo: {
      /* Turbo configuration */
    },
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Advanced code splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            /* vendor chunk config */
          },
          ui: {
            /* UI library chunk config */
          },
          shared: {
            /* shared library chunk config */
          },
        },
      };
    }
    return config;
  },
};
```

## 📈 Interpreting Results

### Lighthouse Scores

- **90-100**: Excellent (🟢)
- **70-89**: Good (🟡)
- **0-69**: Needs improvement (🔴)

### Core Web Vitals

- **LCP**: Time until largest element is rendered
  - Good: ≤2.5s
  - Needs improvement: 2.5-4.0s
  - Poor: >4.0s

- **FID**: Time from first interaction to browser response
  - Good: ≤100ms
  - Needs improvement: 100-300ms
  - Poor: >300ms

- **CLS**: Visual stability during loading
  - Good: ≤0.1
  - Needs improvement: 0.1-0.25
  - Poor: >0.25

### Bundle Analysis

- **Tree shaking**: Look for unused code in the bundle analyzer
- **Duplicate dependencies**: Check for multiple versions of libraries
- **Large chunks**: Consider code splitting for chunks >100KB
- **Vendor bundles**: Should contain only necessary third-party code

## 🔧 Optimization Strategies

### Performance Optimization

1. **Image Optimization**

   ```tsx
   import Image from 'next/image';

   <Image
     src="/hero-image.jpg"
     alt="Hero"
     width={1200}
     height={600}
     priority // for above-the-fold images
     placeholder="blur"
   />;
   ```

2. **Code Splitting**

   ```tsx
   import dynamic from 'next/dynamic';

   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <div>Loading...</div>,
     ssr: false, // if component doesn't need SSR
   });
   ```

3. **Resource Hints**
   ```tsx
   // In _document.tsx or layout
   <link rel="preconnect" href="https://api.example.com" />
   <link rel="dns-prefetch" href="https://analytics.example.com" />
   ```

### Bundle Size Optimization

1. **Tree Shaking**

   ```tsx
   // Import only what you need
   import { Button } from '@skyscout/ui'; // ✅ Good
   import * as UI from '@skyscout/ui'; // ❌ Imports everything
   ```

2. **Dynamic Imports**

   ```tsx
   // Lazy load heavy libraries
   const loadChartLibrary = () => import('recharts');

   // Use only when needed
   const handleShowChart = async () => {
     const { LineChart } = await loadChartLibrary();
     // Use LineChart
   };
   ```

3. **Bundle Analysis**

   ```bash
   # Identify large dependencies
   npm run analyze

   # Check what's in your bundles
   npm run bundle:stats
   ```

## 🚨 Troubleshooting

### Common Issues

**Lighthouse fails with connection error:**

```bash
# Make sure the server is running
npm run dev
# Then run Lighthouse
npm run perf:lighthouse
```

**Bundle analyzer shows large vendor bundle:**

```javascript
// In next.config.js, adjust splitChunks configuration
config.optimization.splitChunks.cacheGroups.vendor = {
  test: /[\\/]node_modules[\\/]/,
  name: 'vendors',
  chunks: 'all',
  maxSize: 200000, // Split large vendor bundles
};
```

**Performance regression in CI:**

```bash
# Update baseline after optimization
npm run perf:baseline
```

**Memory issues during analysis:**

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run perf:monitor
```

### Performance Debugging

1. **Use the Performance Dashboard**
   - Shows real-time metrics during development
   - Helps identify performance bottlenecks

2. **Check Network Tab**
   - Look for large resource downloads
   - Identify slow API calls

3. **Use React DevTools Profiler**
   - Identify slow rendering components
   - Find unnecessary re-renders

## 📚 Best Practices

### Development Workflow

1. **Run performance checks before committing**

   ```bash
   npm run perf:monitor
   ```

2. **Monitor bundle size during development**

   ```bash
   npm run analyze
   ```

3. **Use the performance dashboard**
   ```tsx
   <PerformanceDashboard position="bottom-right" />
   ```

### Production Deployment

1. **Set performance baseline**

   ```bash
   npm run perf:baseline
   ```

2. **Monitor performance in CI/CD**
   - GitHub Actions automatically run performance checks
   - Review PR comments for performance impact

3. **Regular performance audits**
   ```bash
   # Schedule weekly performance reviews
   npm run perf:monitor
   ```

### Performance Budget

Set and monitor performance budgets:

- **Time budget**: LCP ≤2.5s, FID ≤100ms
- **Size budget**: Total JS ≤500KB, Main bundle ≤250KB
- **Score budget**: Lighthouse Performance ≥90

## 🔗 Additional Resources

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Bundle Analysis Guide](https://nextjs.org/docs/advanced-features/analyzing-bundles)

## 📋 Checklist

**Before every release:**

- [ ] Run `npm run perf:monitor`
- [ ] Lighthouse scores ≥90% for performance
- [ ] Core Web Vitals meet thresholds
- [ ] Bundle sizes within limits
- [ ] No performance regressions detected

**Monthly performance review:**

- [ ] Analyze bundle composition
- [ ] Review performance trends
- [ ] Update performance baseline if needed
- [ ] Optimize identified bottlenecks
