import { EB_Garamond, Inter } from "next/font/google";

// Garamond — wordmark, headings, and the generated profile's name/headline.
// This is what visually differentiates the preview card from LinkedIn's sans UI.
export const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-garamond",
  display: "swap",
});

// Inter — all form labels, inputs, buttons, and body copy.
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});
