import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.melvin-et-amelia.fr",
        pathname: '/uploads/**',
      },
      {
        protocol: "http",
        hostname: "api.melvin-et-amelia.fr",
        pathname: '/uploads/**',
      },
      {
        protocol: "http",
        hostname: "51.91.101.218",
        port: "1337",
        pathname: '/uploads/**',
      },
    ],
    domains: ['api.melvin-et-amelia.fr', '51.91.101.218'],
  },
};

export default nextConfig;
