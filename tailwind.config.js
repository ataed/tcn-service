/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/schema/definitions.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-josefin)", "sans-serif"],
        arabic: ["var(--font-almarai)", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#E1E8EF",
          100: "#D4DEE7",
          200: "#B7C7D7",
          300: "#99B0C7",
          400: "#7C99B6",
          500: "#5E82A6",
          600: "#4C6B8A",
          700: "#3C546C",
          800: "#2C3D4F",
          900: "#1B2631",
          950: "#141C24",
        },
        accent: {
          50: "#FAF5F0",
          100: "#F4ECE1",
          200: "#E8D6BF",
          300: "#DDC2A2",
          400: "#D2AF84",
          500: "#C69963",
          600: "#B78343",
          700: "#926835",
          800: "#6C4D28",
          900: "#4B351B",
          950: "#382814",
        },
        admin: {
          bg: "rgb(var(--admin-bg) / <alpha-value>)",
          surface: "rgb(var(--admin-surface) / <alpha-value>)",
          text: "rgb(var(--admin-text-primary) / <alpha-value>)",
          muted: "rgb(var(--admin-text-muted) / <alpha-value>)",
          accent: "#C69963",
        },
      },
      screens: {
        "2xl": "1536px",
        "3xl": "1920px",
      },
      //  Animations for the Hero Section
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "subtle-zoom": "subtleZoom 20s infinite alternate linear",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        subtleZoom: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};
