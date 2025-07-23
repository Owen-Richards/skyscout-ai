# Bundle Size Analysis Guide

## 🎯 Quick Bundle Analysis Commands

Based on your current setup, here are multiple ways to analyze your bundle size:

### 1. **Next.js Bundle Analyzer** (Recommended)

```bash
# In apps/web directory
cd apps/web
npm run analyze
```

This will:

- Build your app with analysis enabled
- Generate an interactive HTML report
- Open the report in your browser automatically
- Show you exactly what's in each bundle

### 2. **Production Build Analysis**

```bash
# Build and check sizes
npm run build
```

After building, you can find bundle information in:

- `apps/web/.next/analyze/` (if analyzer ran)
- Console output showing bundle sizes

### 3. **Using Built-in Scripts**

```bash
# From root directory
npm run perf:analyze

# From web app directory
cd apps/web
npm run analyze:browser  # Browser bundles only
npm run analyze:server   # Server bundles only
```

### 4. **Manual Webpack Bundle Analyzer**

```bash
cd apps/web
npx webpack-bundle-analyzer .next/analyze/client.html
```

## 🔧 Troubleshooting Dependency Issues

The error you're seeing is related to `@fastify/bcrypt` dependency. Here's how to fix it:

### Solution 1: Clean Install

```bash
# Remove node_modules and package-lock
rm -rf node_modules package-lock.json
rm -rf apps/web/node_modules apps/web/package-lock.json

# Clean npm cache
npm cache clean --force

# Reinstall dependencies
npm install
```

### Solution 2: Force Resolution (package.json)

Add this to your root `package.json`:

```json
{
  "overrides": {
    "@fastify/bcrypt": "1.0.0"
  }
}
```

### Solution 3: Skip Dependencies

```bash
npm install --save-dev lighthouse size-limit @size-limit/file --legacy-peer-deps
```

## 📊 Understanding Bundle Output

When you run `npm run analyze`, look for:

### Key Metrics:

- **Main Bundle Size**: Should be < 250KB
- **Vendor Bundle**: Libraries and dependencies
- **Chunk Sizes**: Individual route/component bundles
- **Gzipped Sizes**: Real network transfer sizes

### Red Flags:

- ❌ Bundles > 250KB
- ❌ Duplicate dependencies
- ❌ Unused code (dead code)
- ❌ Large images/assets

## 🎨 Visual Bundle Analysis

### Interactive Treemap

The bundle analyzer shows a treemap where:

- **Larger rectangles** = larger bundle size
- **Colors** = different file types
- **Hover** = exact file sizes

### What to Look For:

1. **Large Dependencies**: Are you using the full library?
2. **Duplicate Code**: Same modules in multiple bundles
3. **Heavy Components**: Individual components that are too large

## 📈 Bundle Size Commands Reference

```bash
# Quick analysis
npm run analyze                    # Full bundle analysis
npm run build                      # See build output sizes

# Performance monitoring
npm run perf:bundle               # Bundle size check only
npm run perf:monitor              # Full performance audit

# Size limits (when configured)
npx size-limit                    # Check against size budgets

# Manual analysis
npx webpack-bundle-analyzer .next/analyze/client.html
```

## 🎯 Optimization Tips

### 1. Code Splitting

```javascript
// Use dynamic imports
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

### 2. Tree Shaking

```javascript
// ✅ Good - import only what you need
import { debounce } from 'lodash/debounce';

// ❌ Bad - imports entire library
import _ from 'lodash';
```

### 3. Bundle Analysis in CI/CD

```bash
# Check bundle size in CI
npm run perf:ci
```

## 🚀 Next Steps

1. **Run Initial Analysis**:

   ```bash
   cd apps/web && npm run analyze
   ```

2. **Set Bundle Size Limits**:
   Create/update `.size-limit.json`

3. **Monitor Regularly**:
   Use the performance monitoring scripts

4. **Optimize Based on Results**:
   - Remove unused dependencies
   - Implement code splitting
   - Optimize large components

## 📋 Bundle Size Checklist

- [ ] Main bundle < 250KB
- [ ] No duplicate dependencies
- [ ] Large libraries are code-split
- [ ] Images are optimized
- [ ] Unused code is eliminated
- [ ] Bundle analyzer runs in CI/CD

Run `npm run analyze` now to see your current bundle composition!
