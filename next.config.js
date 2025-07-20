/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    appDir: true, // ← indispensable pour les dossiers "app/"
  },
};

module.exports = withPWA(nextConfig);
