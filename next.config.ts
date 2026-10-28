import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Keep preview and deployment artifacts isolated from stale `.next` output.
  distDir: ".next-v0",
};

export default nextConfig;
