import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "ti-navy": "#002169",
        "ti-yellow": "#FFCD00",
        "ti-accent": "#004C97",
        "ti-gray": "#636466",
        "ti-bg": "#F8F9FA",
        "score-red": "#DC2626",
        "score-orange": "#F97316",
        "score-yellow": "#EAB308",
        "score-green": "#16A34A",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
