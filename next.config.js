/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // ne pas activer le service worker en dev
});

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // pour déploiement sur Vercel ou autre
};

module.exports = withPWA(nextConfig);
