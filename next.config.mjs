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
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            // 🟢 UPDATED: Whitelisted Supabase, OpenStreetMap (Leaflet), and Google Fonts
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://tudfxgqctzldwicshnfu.supabase.co; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://*.supabase.co https://*.tile.openstreetmap.org https://unpkg.com/leaflet@1.9.4/dist/images/; font-src 'self' data:; connect-src 'self' https://tudfxgqctzldwicshnfu.supabase.co https://*.tile.openstreetmap.org;",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
