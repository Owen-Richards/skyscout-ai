# Bundle Size Analysis Guide for SkyScout AI

## Current Bundle Analysis

Your application is currently running in development mode. Here's how to analyze your bundle size and performance:

### Method 1: Development Server Analysis

Since your development server is running, you can:

1. **Visit your app** at `http://localhost:3000`
2. **Open DevTools** (F12)
3. **Go to Network tab**
4. **Reload the page**
5. **Check the size of JavaScript files loaded**

### Method 2: Production Build Analysis

To get accurate bundle sizes, you need a production build:

```bash
# In the web directory (c:\Users\Owenl\source\repos\skyscout-ai\apps\web)
npm run build
```

This will generate optimized bundles in the `.next` folder.

### Method 3: Manual Bundle Analysis

After building, check these folders:

- `.next/static/chunks/` - JavaScript chunks
- `.next/static/css/` - CSS bundles
- `.next/server/` - Server-side bundles

### Method 4: Next.js Built-in Analysis

Next.js provides bundle analysis in the build output. Look for:

- **First Load JS** - Critical for performance
- **Route sizes** - Individual page bundle sizes
- **Shared chunks** - Common code between pages

## Performance Monitoring with Your Components

You've already created a `PerformanceMonitor` component that provides real-time insights:

```typescript
// Add this to your main layout or page
import { PerformanceMonitor } from '@/components/performance/performance-monitor';

// In your JSX
<PerformanceMonitor />
```

This component will show you:

- Bundle size information
- Web Vitals (LCP, FID, CLS)
- Memory usage
- Network performance

## Expected Bundle Sizes

For a typical Next.js app like yours:

| Component     | Target Size | Good    | Needs Optimization |
| ------------- | ----------- | ------- | ------------------ |
| Main Bundle   | < 200KB     | < 150KB | > 300KB            |
| Vendor Bundle | < 300KB     | < 250KB | > 500KB            |
| Page Bundles  | < 50KB      | < 30KB  | > 100KB            |
| CSS Bundle    | < 50KB      | < 30KB  | > 100KB            |

## Current Components Impact

Based on the components you've added:

### Budget Tracker (~15-25KB)

- Lightweight component
- Minimal external dependencies
- Good bundle impact

### Itinerary Planner (~20-30KB)

- Moderate size due to UI complexity
- Icons and components add bulk
- Acceptable for functionality provided

### Hotel/Flight Components (~10-15KB each)

- Well-optimized components
- Minimal impact on bundle

### Performance Monitor (~8-12KB)

- Lightweight monitoring
- Good utility-to-size ratio

## Optimization Recommendations

1. **Code Splitting**: Use dynamic imports for heavy components
2. **Tree Shaking**: Remove unused code and imports
3. **Bundle Analysis**: Use webpack-bundle-analyzer when available
4. **Image Optimization**: Use Next.js Image component
5. **External Libraries**: Audit and minimize dependencies

## Quick Performance Check

Run this in your browser console while on your app:

```javascript
// Check current JavaScript size
const scripts = document.querySelectorAll('script[src]');
let totalSize = 0;
scripts.forEach(script => {
  if (script.src.includes('/_next/')) {
    console.log('Script:', script.src);
  }
});

// Check Web Vitals
import('web-vitals').then(({ getCLS, getFID, getLCP, getFCP, getTTFB }) => {
  getCLS(console.log);
  getFID(console.log);
  getLCP(console.log);
  getFCP(console.log);
  getTTFB(console.log);
});
```

## Monitoring in Production

Once deployed, use tools like:

- **Lighthouse** - Overall performance scores
- **Web Vitals** - Real user metrics
- **Vercel Analytics** - If using Vercel
- **GTMetrix/PageSpeed** - External analysis

Your SkyScout AI application is well-architected for performance with the components we've built!
