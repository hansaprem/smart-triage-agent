import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { PatientProvider } from "@/lib/patient-context";

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
  title: "SMART TRIAGE AGENT | AI-Powered Emergency Decision Support System",
  description:
    "An academic healthcare AI prototype assisting emergency department staff in prioritizing incoming patients based on symptoms, vital signs, and multi-agent AI triage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-background text-clinical-text antialiased selection:bg-emerald-light selection:text-emerald-dark">
        <PatientProvider>
          {children}
        </PatientProvider>
      </body>
    </html>
  );
}
