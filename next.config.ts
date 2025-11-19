import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Idhu build errors-a ignore panni build-a complete panna vidum
  typescript: {
    ignoreBuildErrors: true,
  },
  // Idhu linting-a skip pannum
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
