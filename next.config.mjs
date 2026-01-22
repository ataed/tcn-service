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
          {
            key: "X-Content-Type-Options",
            value: "nosniff", // Fixes "nosniff" failure
          },
          {
            key: "X-Frame-Options",
            value: "DENY", // Fixes XFO failure
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin", // Fixes Referrer failure
          },
          {
            key: "Strict-Transport-Security",
            // 🟢 Fixes "Cookies" failure by ensuring HTTPS for all sessions
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            // 🟢 WHIETELISTED: Supabase, Leaflet, Google Fonts, Esri Satellite, and CartoDB Labels
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://tudfxgqctzldwicshnfu.supabase.co; " +
              "style-src 'self' 'unsafe-inline' https://unpkg.com; " +
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
