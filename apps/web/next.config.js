/** @type {import('next').NextConfig} */
// Bundle analyzer configuration
let withBundleAnalyzer = config => config;
try {
  withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
    openAnalyzer: process.env.ANALYZE === 'true',
  });
} catch (e) {
  console.log(
    '📦 Bundle analyzer not available. Run: npm install --save-dev @next/bundle-analyzer'
  );
}

// Performance monitoring configuration
const isAnalyze = process.env.ANALYZE === 'true';

const nextConfig = {
  env: {
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  },
  transpilePackages: ['@skyscout/shared', '@skyscout/ui', '@skyscout/trpc'],
  experimental: {
    // Enable production profiling (for performance monitoring)
    profiling: true,
    // Optimize React rendering
    optimizeCss: true,
    // Enable faster builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Performance optimizations
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  // Output standalone for Docker optimization
  output: process.env.BUILD_STANDALONE ? 'standalone' : undefined,
  // Image optimization
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Headers for performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // Bundle size optimizations and analysis
  webpack: (config, { dev, isServer, webpack }) => {
    // Performance monitoring
    if (isAnalyze && !isServer) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: './analyze/client.html',
          openAnalyzer: false,
        })
      );
    }

    // Optimize bundle for production
    if (!dev && !isServer) {
      // Advanced code splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
          ui: {
            test: /[\\/]libs[\\/]ui[\\/]/,
            name: 'ui-lib',
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
          },
          shared: {
            test: /[\\/]libs[\\/]shared[\\/]/,
            name: 'shared-lib',
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
          },
          common: {
            minChunks: 2,
            name: 'common',
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };

      // Optimize module concatenation
      config.optimization.concatenateModules = true;

      // Tree shaking improvements
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }

    // Bundle analysis helpers
    if (!dev) {
      config.plugins.push(
        new webpack.DefinePlugin({
          __BUNDLE_ANALYZE__: JSON.stringify(process.env.ANALYZE === 'true'),
        })
      );
    }

    // Ignore source maps in bundle analysis for cleaner reports
    if (isAnalyze) {
      config.devtool = false;
    }

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
