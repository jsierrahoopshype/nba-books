/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/nba-books',
  assetPrefix: '/nba-books',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;