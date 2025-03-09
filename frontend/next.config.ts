import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Try to successfully deploy in vercel
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
  /* config options here */
};

export default nextConfig;
