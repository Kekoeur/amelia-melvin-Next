import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'], // Format moderne plus léger
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    unoptimized: false,
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
