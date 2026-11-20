import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          950: "#060913",
          900: "#0a0f1d",
          850: "#0f1629",
          800: "#131b32",
          700: "#1e294b",
          600: "#2d3b66",
        },
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
      },
      fontFamily: {
        sans: ["'Commissioner'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        commissioner: ["'Commissioner'", "sans-serif"],
        tangerine: ["'Tangerine'", "cursive"],
      },
      boxShadow: {
        "glow-purple": "0 0 25px -5px rgba(139, 92, 246, 0.25)",
        "glow-indigo": "0 0 25px -5px rgba(99, 102, 241, 0.25)",
        "card-subtle": "0 4px 20px -2px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
