/** @type {import('next').NextConfig} */

const debug = process.env.NODE_ENV !== "production";

const nextConfig = {
  reactStrictMode: true,
  exportPathMap: function () {
    return {
      "/": { page: "/"}
    }
  },
  assetPrefix: !debug ? 'https://superflux.dev/rpi-temperature-dashboard/' : ''
}

module.exports = nextConfig
