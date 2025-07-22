/** @type {import('next').NextConfig} */
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });

const nextConfig = {
  env: {
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  },
  transpilePackages: ['@skyscout/shared', '@skyscout/ui', '@skyscout/trpc'],
  experimental: {
    // Enable production profiling (for performance monitoring)
    profiling: true,
  },
  // Performance optimizations
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  // Bundle size optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle for production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          ui: {
            test: /[\\/]libs[\\/]ui[\\/]/,
            name: 'ui-lib',
            chunks: 'all',
          },
          shared: {
            test: /[\\/]libs[\\/]shared[\\/]/,
            name: 'shared-lib',
            chunks: 'all',
          },
        },
      };
    }

    return config;
  },
};

module.exports = nextConfig;
// module.exports = withBundleAnalyzer(nextConfig);
