import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    qualities: [75, 90, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fqoblokrlkqbnxikjfli.supabase.co",
      },
    ],
  },
};

export default nextConfig;
