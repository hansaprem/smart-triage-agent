import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F7F2",
        card: "#FFFFFF",
        ivory: {
          50: "#FAFAF7",
          100: "#F7F7F2",
          200: "#EFEFE8",
          300: "#E2E2D6",
        },
        emerald: {
          DEFAULT: "#047857",
          primary: "#047857",
          dark: "#065F46",
          light: "#D1FAE5",
          hover: "#059669",
        },
        gold: {
          DEFAULT: "#D4A017",
          accent: "#D4A017",
          light: "#FEF3C7",
          dark: "#B45309",
        },
        clinical: {
          text: "#1C2624",
          secondary: "#64748B",
          muted: "#94A3B8",
          border: "#E5E7EB",
          borderDark: "#D1D5DB",
        },
        triage: {
          critical: "#EF4444",
          criticalBg: "#FEF2F2",
          criticalBorder: "#FECACA",
          urgent: "#F59E0B",
          urgentBg: "#FFFBEB",
          urgentBorder: "#FDE68A",
          nonUrgent: "#10B981",
          nonUrgentBg: "#ECFDF5",
          nonUrgentBorder: "#A7F3D0",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        heading: ["var(--font-manrope)", "Manrope", "system-ui", "sans-serif"],
      },
      boxShadow: {
        clinical: "0 1px 3px 0 rgba(28, 38, 36, 0.04), 0 1px 2px -1px rgba(28, 38, 36, 0.04)",
        card: "0 4px 6px -1px rgba(28, 38, 36, 0.05), 0 2px 4px -2px rgba(28, 38, 36, 0.05)",
        float: "0 10px 25px -5px rgba(28, 38, 36, 0.08), 0 8px 10px -6px rgba(28, 38, 36, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
