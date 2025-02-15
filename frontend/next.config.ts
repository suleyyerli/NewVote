/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Désactiver le mode strict pour TypeScript en production
  typescript: {
    ignoreBuildErrors: true,
  },
  // Désactiver les erreurs ESLint en production
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configuration pour les images externes si nécessaire
  images: {
    domains: ["*"],
  },
};

module.exports = nextConfig;
