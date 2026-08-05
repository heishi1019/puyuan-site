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
        bg:          "#0A0A0B",
        surface:     "#141416",
        border:      "#26262A",
        text:        "#F5F5F7",
        muted:       "#8A8A93",
        accent:      "#00E5A0",
        "accent-dim":"#00B37E",
        "accent-hover": "#27F2AE",
      },
      fontFamily: {
        sans: ["Inter", "HarmonyOS Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        xs:   ["0.75rem",  { lineHeight: "1rem"    }],
        sm:   ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem",     { lineHeight: "1.5rem"  }],
        lg:   ["1.25rem",  { lineHeight: "1.75rem" }],
        xl:   ["1.75rem",  { lineHeight: "2.25rem" }],
        "2xl":["2.5rem",   { lineHeight: "3rem"    }],
        "3xl":["4rem",     { lineHeight: "4.5rem"  }],
      },
      borderRadius: {
        sm:   "6px",
        md:   "10px",
        lg:   "16px",
        pill: "9999px",
      },
      boxShadow: {
        glow: "0 0 24px rgba(0,229,160,0.25)",
        "glow-lg": "0 0 48px rgba(0,229,160,0.20)",
      },
      spacing: {
        section: "6rem", // 96px
      },
    },
  },
  plugins: [],
};

export default config;
