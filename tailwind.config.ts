import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design system — old money: deep oxblood, parchment, antique gold.
        // Token kept as `crimson` for continuity; the hue is now a dark oxblood.
        crimson: {
          DEFAULT: "#5A121E", // oxblood
          dark: "#3D0C15",
          light: "#7A1E2B",
        },
        // Antique / brushed brass — used only as hairlines and small accents.
        gold: {
          DEFAULT: "#A98A50",
          dark: "#836A3B",
          light: "#C6AA73",
        },
        ink: "#221E19", // warm near-black
        // Page background — aged parchment, never stark white.
        parchment: "#F2EBDB",
        // Card / input surface — a lighter ivory that still reads as paper.
        ivory: "#FBF7EE",
        // Insets and dividers — deeper parchment.
        linen: "#E9E0CD",
        // Muted cream for text on oxblood.
        cream: "#EBDDC8",
      },
      fontFamily: {
        // Display / wordmark / headings + preview name/headline
        serif: ["var(--font-garamond)", "Georgia", "Cambria", "serif"],
        // Body, form inputs, UI chrome
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // The only shadow we allow — a very subtle lift on the preview card
        card: "0 1px 2px rgba(34, 30, 25, 0.05), 0 18px 44px rgba(61, 12, 21, 0.10)",
      },
      maxWidth: {
        card: "620px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
