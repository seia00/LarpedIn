import type { Metadata } from "next";
import { garamond, inter } from "./fonts";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

export const metadata: Metadata = {
  title: "LarpLink — Elevate Your Profile",
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
      <body className="font-sans antialiased">
        {children}
        <PageTransition />
        <CustomCursor />
      </body>
    </html>
  );
}
