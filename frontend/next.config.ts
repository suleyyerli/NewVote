/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = nextConfig;
