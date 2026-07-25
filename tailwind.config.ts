import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1E3A5F",
        "ink-light": "#2D4F7F",
        amber: {
          DEFAULT: "#F59E0B",
          light: "#FCD34D",
          50: "#FFFBEB",
        },
        paper: {
          DEFAULT: "#FAFAF8",
          dark: "#F0EDE8",
        },
        border: "#E2DDD8",
      },
      fontFamily: {
        display: ['"DM Serif Display"', "serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config