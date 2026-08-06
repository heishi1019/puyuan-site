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
      /* Type scale. design-system.tokens.md names its steps xs..3xl and caps at
         3xl=64 (the hero display size). Tailwind's class ladder runs two steps
         longer (…4xl, 5xl), and the pages use text-4xl/5xl for h1 and text-3xl
         for section h2. Seating the token values in their token-named slots
         would therefore render h2 (64) larger than h1 (Tailwind default 36/48).
         The token values are kept intact and re-seated onto the slots the
         markup actually uses:
           token 3xl 64 → 5xl   h1 desktop (display)
           token 2xl 40 → 4xl   h1 mobile
           token xl  28 → 3xl   section h2
           token lg  20 → xl    h3 / lead paragraph
         2xl (24) and lg (18) are bridge steps keeping the ladder monotonic. */
      fontSize: {
        xs:   ["0.75rem",  { lineHeight: "1rem"     }],
        sm:   ["0.875rem", { lineHeight: "1.25rem"  }],
        base: ["1rem",     { lineHeight: "1.5rem"   }],
        lg:   ["1.125rem", { lineHeight: "1.75rem"  }],
        xl:   ["1.25rem",  { lineHeight: "1.75rem"  }],
        "2xl":["1.5rem",   { lineHeight: "2rem"     }],
        "3xl":["1.75rem",  { lineHeight: "2.25rem"  }],
        "4xl":["2.5rem",   { lineHeight: "2.875rem" }],
        "5xl":["4rem",     { lineHeight: "4.5rem"   }],
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
