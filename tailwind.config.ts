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
          950: "#000000",
          900: "#050505",
          850: "#0a0a0a",
          800: "#121212",
          700: "#1e1e1e",
          600: "#2a2a2a",
        },
        brand: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
          950: "#09090b",
        },
      },
      fontFamily: {
        sans: ["'Commissioner'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        commissioner: ["'Commissioner'", "sans-serif"],
        tangerine: ["'Tangerine'", "cursive"],
      },
      boxShadow: {
        "glow-white": "0 0 25px rgba(255, 255, 255, 0.4)",
        "glow-purple": "0 0 25px rgba(255, 255, 255, 0.35)",
        "glow-indigo": "0 0 25px rgba(255, 255, 255, 0.35)",
        "card-subtle": "0 4px 20px -2px rgba(0, 0, 0, 0.7)",
      },
    },
  },
  plugins: [],
};
export default config;
