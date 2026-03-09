import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-c0c9fa17ee6d4f09a44602af401f6312.r2.dev",
      },
    ],
  },
};

export default nextConfig;
