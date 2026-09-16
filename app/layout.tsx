import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TRIEVO Healthcare — Clinical NLP Prototype",
  description:
    "Clinical Named Entity Recognition and Medical Text Intelligence Prototype for Trievo Healthcare.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-[#F7F7F2] text-[#1C2624] antialiased selection:bg-[#D1FAE5] selection:text-[#065F46]">
        {children}
      </body>
    </html>
  );
}
