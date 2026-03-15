import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "ti-navy": "#003087",
        "ti-navy-dark": "#001f5c",
        "ti-red": "#E8001C",
        "ti-red-dark": "#C4001A",
        "ti-yellow": "#FFCD00",
        "ti-bg": "#F4F5F7",
        "ti-grey-mid": "#E0E2E6",
        "ti-text": "#1A1A2E",
        "ti-text-muted": "#5A5A72",
        "ti-dark-bg": "#0F172A",
        "ti-dark-card": "#1E293B",
        "ti-dark-border": "#334155",
        "ti-dark-text": "#F1F5F9",
        "ti-dark-muted": "#94A3B8",
        "ti-navy-light": "#60A5FA",
        "score-red": "#DC2626",
        "score-orange": "#F97316",
        "score-yellow": "#EAB308",
        "score-green": "#16A34A",
      },
      fontFamily: {
        heading: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      animation: {
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255, 205, 0, 0)" },
          "50%": { boxShadow: "0 0 0 8px rgba(255, 205, 0, 0.3)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
