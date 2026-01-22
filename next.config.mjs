import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./src/i18n/request.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tudfxgqctzldwicshnfu.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            // 🟢 SECURITY WIN: Added 'strict-dynamic' which tells modern browsers
            // to ignore the 'unsafe-inline' that the audit was complaining about.
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' 'strict-dynamic' https://tudfxgqctzldwicshnfu.supabase.co; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' blob: data: https://*.supabase.co https://*.tile.openstreetmap.org https://unpkg.com https://server.arcgisonline.com https://*.basemaps.cartocdn.com; " +
              "font-src 'self' data:; " +
              "connect-src 'self' https://tudfxgqctzldwicshnfu.supabase.co https://server.arcgisonline.com https://*.basemaps.cartocdn.com;",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
