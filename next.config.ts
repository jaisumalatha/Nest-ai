import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   experimental: {
    // Note: The exact key might be slightly different in your version of Next.js,// refer to the official documentation or release notes for the precise name.    turbopackUseSystemTlsCerts: true,
  },
  /* config options here */
};

export default nextConfig;