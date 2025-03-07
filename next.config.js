const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  pageExtensions: ["page.tsx", "page.ts", "api-route.ts"],
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "tailwindui.com" },
      { hostname: "127.0.0.1", port: "1337" },
      { hostname: "storage.googleapis.com" },
    ],
  },
  output: "standalone",
  rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:path*",
          has: [
            {
              type: "host",
              value: "app.heures-supp.fr",
            },
          ],
          destination: "/app/:path*",
        },
      ],
    };
  },
};

module.exports = withBundleAnalyzer(nextConfig);
