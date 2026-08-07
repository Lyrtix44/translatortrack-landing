import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base surfaces
        paper: { DEFAULT: "#FAFAF8", dark: "#F0EDE8" },
        ink: { DEFAULT: "#1E3A5F", light: "#2D4F7F" },
        border: "#E2DDD8",
        "slate-mid": "#64748B",

        // Sidebar / dark chrome — used for the left rail, topbar, mobile tab bar.
        // "text" = inactive item color, "text-active" = active item color.
        // Hover/active BACKGROUNDS are handled as white/5, white/10 opacity
        // overlays at the component level rather than fixed hexes, so they
        // always look correct regardless of what's rendered beneath them.
        sidebar: {
          DEFAULT: "#1E3A5F",
          text: "#94A3B8",
          "text-active": "#FFFFFF",
        },

        // Accent / brand
        amber: {
          DEFAULT: "#F59E0B",
          hover: "#D97706",
          light: "#FFFBEB",
          50: "#FFFBEB", // alias — keeps existing bg-amber-50 usages (hero badge, FAQ, pricing) rendering correctly
        },

        // Semantic status — base color for text/icons, "light" for badge
        // and alert backgrounds. Reused everywhere: project status, invoice
        // status, form validation, toasts.
        success: { DEFAULT: "#16A34A", light: "#F0FDF4" },
        warning: { DEFAULT: "#D97706", light: "#FFFBEB" },
        danger: { DEFAULT: "#DC2626", light: "#FEF2F2" },
        info: { DEFAULT: "#2563EB", light: "#EFF6FF" },
      },
      fontFamily: {
        display: ['"DM Serif Display"', "serif"],
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["3rem", { lineHeight: "1.1" }], // 48px
        display: ["2.25rem", { lineHeight: "1.15" }], // 36px
        h2: ["1.5rem", { lineHeight: "1.3" }], // 24px
        h3: ["1.125rem", { lineHeight: "1.4" }], // 18px
      },
      boxShadow: {
        sm: "0 1px 2px rgba(30, 58, 95, 0.04)",
        card: "0 1px 3px rgba(30, 58, 95, 0.08), 0 1px 2px rgba(30, 58, 95, 0.04)",
        "card-hover": "0 4px 12px rgba(30, 58, 95, 0.12)",
        dropdown: "0 10px 40px rgba(30, 58, 95, 0.16)",
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        lg: "12px",
      },
      spacing: {
        sidebar: "240px",
        topbar: "64px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config