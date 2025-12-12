import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_SUPABASE_DOMAIN!,
        pathname: "/**",
      },
    ],
  },
  // eslint konfiguratsiyasini bu yerda emas, .eslintrc yoki package.json da boshqarasiz
};

export default nextConfig;
