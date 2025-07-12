/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  },
  transpilePackages: ['@skyscout/shared', '@skyscout/ui', '@skyscout/trpc'],
};

module.exports = nextConfig;
