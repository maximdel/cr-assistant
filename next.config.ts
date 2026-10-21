import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // old page names
  async redirects() {
    return [
      { source: '/playing', destination: '/scout', permanent: true },
      { source: '/ranking', destination: '/rankings', permanent: true },
    ];
  },
  images: {
    // card icons come straight from the official API
    remotePatterns: [{ protocol: 'https', hostname: 'api-assets.clashroyale.com' }],
  },
};

export default nextConfig;
