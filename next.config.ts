import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Cloudflare R2 public bucket
        protocol: "https",
        hostname: "**.r2.dev",
      },
      {
        // Fal.ai generated images
        protocol: "https",
        hostname: "**.fal.media",
      },
      {
        // Fal.ai storage fallback
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
