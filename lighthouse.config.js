/**
 * SkyScout AI - Lighthouse Configuration for All Environments
 * Performance monitoring across development, staging, and production
 */

const testUrls = {
  production: [
    'https://skyscout.ai',
    'https://skyscout.ai/search',
    'https://skyscout.ai/deals',
    'https://skyscout.ai/flights',
    'https://skyscout.ai/hotels',
  ],
  staging: [
    'https://staging.skyscout.ai',
    'https://staging.skyscout.ai/search',
    'https://staging.skyscout.ai/deals',
  ],
  development: [
    'http://localhost:3000',
    'http://localhost:3000/search',
    'http://localhost:3000/deals',
  ],
};

const environment =
  process.env.NODE_ENV || process.env.ENVIRONMENT || 'development';
const urls = testUrls[environment] || testUrls.development;

module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      url: urls,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        preset: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    upload: {
      target: 'temporary-public-storage',
      reportFilenamePattern: `skyscout-lighthouse-${environment}-%%HOSTNAME%%-%%DATETIME%%.html`,
    },
    assert: {
      // Performance budgets for SkyScout AI
      assertions: {
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:pwa': ['warn', { minScore: 0.8 }],

        // Core Web Vitals - Critical for flight search UX
        'first-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 4000 }],
        'first-meaningful-paint': ['error', { maxNumericValue: 3000 }],
        'speed-index': ['error', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],

        // Flight search specific performance metrics
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'max-potential-fid': ['error', { maxNumericValue: 130 }],
        'server-response-time': ['error', { maxNumericValue: 500 }],

        // Resource optimization
        'unused-css-rules': ['warn', { maxLength: 2 }],
        'unused-javascript': ['warn', { maxLength: 2 }],
        'unminified-css': ['error', { maxLength: 0 }],
        'unminified-javascript': ['error', { maxLength: 0 }],
        'modern-image-formats': ['warn', { maxLength: 1 }],
        'efficient-animated-content': ['warn', { maxLength: 0 }],

        // Flight search accessibility requirements
        'color-contrast': ['error', { maxLength: 0 }],
        'focus-traps': ['error', { maxLength: 0 }],
        'focusable-controls': ['error', { maxLength: 0 }],
        'interactive-element-affordance': ['error', { maxLength: 0 }],
        'logical-tab-order': ['error', { maxLength: 0 }],

        // SEO for flight discovery
        'meta-description': ['error', { maxLength: 0 }],
        'document-title': ['error', { maxLength: 0 }],
        hreflang: ['warn', { maxLength: 1 }],
        canonical: ['warn', { maxLength: 1 }],
      },
    },
    server: {
      port: 9001,
      storage: {
        storageMethod: 'filesystem',
        path: './lighthouse-reports',
      },
    },
  },

  // Environment-specific configurations
  environments: {
    development: {
      ci: {
        collect: {
          startServerCommand: 'npm run dev',
          startServerReadyPattern: 'ready',
          startServerReadyTimeout: 30000,
        },
      },
    },
    staging: {
      ci: {
        collect: {
          settings: {
            extraHeaders: JSON.stringify({
              Authorization: process.env.STAGING_AUTH_TOKEN,
            }),
          },
        },
        assert: {
          assertions: {
            // Relaxed staging performance (allows for debug builds)
            'categories:performance': ['warn', { minScore: 0.75 }],
          },
        },
      },
    },
    production: {
      ci: {
        collect: {
          settings: {
            extraHeaders: JSON.stringify({
              'User-Agent': 'SkyScout-Lighthouse-Monitor/1.0',
            }),
          },
        },
        upload: {
          target: 's3',
          bucketName: 'skyscout-lighthouse-reports',
          region: 'us-east-1',
        },
        assert: {
          assertions: {
            // Strict production performance requirements
            'categories:performance': ['error', { minScore: 0.9 }],
            'largest-contentful-paint': ['error', { maxNumericValue: 3000 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
          },
        },
      },
    },
  },

  // Custom budget for SkyScout AI flight search
  budgets: [
    {
      path: '/*',
      timings: [
        { metric: 'first-contentful-paint', budget: 2500 },
        { metric: 'largest-contentful-paint', budget: 4000 },
        { metric: 'speed-index', budget: 4000 },
        { metric: 'interactive', budget: 5000 },
      ],
      resourceSizes: [
        { resourceType: 'script', budget: 300 }, // KB
        { resourceType: 'stylesheet', budget: 100 },
        { resourceType: 'image', budget: 500 },
        { resourceType: 'font', budget: 150 },
        { resourceType: 'total', budget: 1000 },
      ],
      resourceCounts: [
        { resourceType: 'script', budget: 10 },
        { resourceType: 'stylesheet', budget: 5 },
        { resourceType: 'image', budget: 20 },
        { resourceType: 'third-party', budget: 5 },
      ],
    },
    {
      // Specific budget for flight search pages
      path: '/search*',
      timings: [
        { metric: 'first-contentful-paint', budget: 2000 }, // Stricter for search
        { metric: 'speed-index', budget: 3500 },
        { metric: 'interactive', budget: 4500 },
      ],
    },
    {
      // Budget for deals pages
      path: '/deals*',
      resourceSizes: [
        { resourceType: 'image', budget: 800 }, // More images for deals
        { resourceType: 'total', budget: 1200 },
      ],
    },
  ],
};

// Export environment-specific config
if (environment !== 'development') {
  module.exports = {
    ...module.exports,
    ...module.exports.environments[environment],
  };
}
