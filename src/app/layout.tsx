import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KalshiAI | AI-Powered Kalshi Intelligence",
  description:
    "See the market before everyone else. AI-powered probability analysis, smart money tracking, and real-time alerts for Kalshi traders.",
  keywords: [
    "Kalshi",
    "prediction markets",
    "trading",
    "AI analytics",
    "event contracts",
    "market intelligence",
  ],
  authors: [{ name: "KalshiAI" }],
  openGraph: {
    title: "KalshiAI | AI-Powered Kalshi Intelligence",
    description:
      "See the market before everyone else. AI-powered probability analysis, smart money tracking, and real-time alerts.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "KalshiAI | AI-Powered Kalshi Intelligence",
    description:
      "See the market before everyone else. AI-powered probability analysis and smart money tracking.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
