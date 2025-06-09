// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['http://192.168.0.180:3000'],  // ← root-level
};

export default nextConfig;
