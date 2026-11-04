/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Compress responses for faster page delivery
  compress: true,

  // Optimize package imports to reduce bundle size
  experimental: {
    optimizePackageImports: ["lucide-react", "@supabase/supabase-js"],
  },

  images: {
    // Use Next.js Image Optimization for all remote images
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600, // Cache optimized images for 1 hour
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dgzkmrbxqmfppcvcstgn.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  // Add security and cache headers
  async headers() {
    return [
      {
        // Cache immutable static asset chunks aggressively
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
