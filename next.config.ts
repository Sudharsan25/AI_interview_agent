import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, //important to avoid build failure during deployment
  },
  typescript:{
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
