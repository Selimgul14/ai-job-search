import type { Metadata, Viewport } from "next";
import { Manrope, Space_Mono } from "next/font/google";
import "./globals.css";

// Manrope = body/UI font, Space Mono = monospace accents (matches imported design)
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "EV Trip Tracker",
  description: "Tesla charging log — Istanbul to Western Europe and back",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // mobile-first: avoid zoom-on-input jumpiness
  themeColor: "#e9e1d4",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${spaceMono.variable}`}>
      <body className="font-sans bg-sand text-ink antialiased">{children}</body>
    </html>
  );
}
