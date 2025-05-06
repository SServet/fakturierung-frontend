/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // if you’re using the App Router
    appDir: true,
  },
  // any other settings you had in .ts can go here
}

module.exports = nextConfig
