import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./src/i18n/request.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 🟢 Standard optimization settings
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tudfxgqctzldwicshnfu.supabase.co",
        port: "",
        // pathname: "/storage/v1/object/public/**",
        // 🟢 CHANGED: Allow ALL paths (safer to avoid 403 errors)
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
