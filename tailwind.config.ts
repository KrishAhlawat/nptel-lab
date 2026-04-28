import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0f172a",
          secondary: "#1e293b",
          card: "#162032",
          hover: "#1a2840",
        },
        accent: {
          DEFAULT: "#22c55e",
          hover: "#16a34a",
          muted: "#166534",
          glow: "rgba(34,197,94,0.15)",
        },
        text: {
          primary: "#e2e8f0",
          secondary: "#94a3b8",
          muted: "#64748b",
        },
        border: {
          DEFAULT: "#1e293b",
          accent: "#22c55e",
          subtle: "#334155",
        },
        wrong: {
          DEFAULT: "#ef4444",
          muted: "#7f1d1d",
          glow: "rgba(239,68,68,0.15)",
        },
        correct: {
          DEFAULT: "#22c55e",
          muted: "#166534",
          glow: "rgba(34,197,94,0.15)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.3)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.4)",
        accent: "0 0 20px rgba(34,197,94,0.2)",
        glow: "0 0 40px rgba(34,197,94,0.1)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
