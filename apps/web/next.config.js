/** @type {import('next').NextConfig} */

const nextConfig = {
  // Environment variables
  env: {
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },

  // Package transpilation for monorepo
  transpilePackages: ['@skyscout/shared', '@skyscout/ui', '@skyscout/trpc'],

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },

  // Enable SWC minification
  swcMinify: true,

  // Experimental features
  experimental: {
    externalDir: true,
  },

  // Image optimization
  images: {
    minimumCacheTTL: 60 * 60 * 24, // 1 day
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Security headers
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
        ],
      },
    ];
  },
};

module.exports = nextConfig;

module.exports = nextConfig;
