import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design system — "old money meets startup"
        crimson: {
          DEFAULT: "#9B1B30",
          dark: "#7E1626",
          light: "#B84152",
        },
        ink: "#1A1A1A",
        paper: "#FFFFFF",
        // Light warm gray for card backgrounds / section dividers
        linen: "#F5F3F0",
        // Muted cream for subheads on crimson
        cream: "#F3E9E4",
      },
      fontFamily: {
        // Display / wordmark / headings + preview name/headline
        serif: ["var(--font-garamond)", "Georgia", "Cambria", "serif"],
        // Body, form inputs, UI chrome
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // The only shadow we allow — a very subtle lift on the preview card
        card: "0 1px 2px rgba(26, 26, 26, 0.04), 0 12px 32px rgba(26, 26, 26, 0.08)",
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
