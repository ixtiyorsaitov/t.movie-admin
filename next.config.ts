import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [process.env.NEXT_PUBLIC_SUPABASE_DOMAIN!],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
