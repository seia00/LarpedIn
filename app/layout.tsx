import type { Metadata } from "next";
import { garamond, inter } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "LarpedIn — Elevate Your Profile",
  description:
    "Turn your career background into a polished, narrative-driven profile people actually want to read.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${garamond.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
