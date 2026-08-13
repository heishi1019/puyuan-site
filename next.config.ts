import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Turbopack's dev artifacts separate from production output. Sharing
  // `.next` allows an overlapping dev server to invalidate build chunks.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  devIndicators: false,
};

export default nextConfig;
