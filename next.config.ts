import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "http",
          hostname: "localhost", // 🔹 Remplace par le domaine de ton CMS
          port: "4337",
          pathname: '/uploads/**',
        },
      ],
      domains: ['localhost'], // Remplacez 'localhost' par le domaine de votre serveur Strapi en production.
    },
};

export default nextConfig;