/**
 * Lighthouse CI Configuration for Enterprise Performance Monitoring
 * Continuous performance monitoring and regression detection
 */
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/search',
        'http://localhost:3000/deals',
      ],
      startServerCommand: 'npm run start',
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless',
        preset: 'desktop',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],

        // Core Web Vitals
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'first-input-delay': ['error', { maxNumericValue: 100 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],

        // Performance budgets
        'total-byte-weight': ['warn', { maxNumericValue: 1000000 }], // 1MB
        'dom-size': ['warn', { maxNumericValue: 1500 }],
        'unused-javascript': ['warn', { maxNumericValue: 200000 }], // 200KB
        'render-blocking-resources': ['error', { maxNumericValue: 0 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    server: {
      port: 9009,
      storage: './lighthouse-reports',
    },
  },
};
