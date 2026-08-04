import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', 'Noto Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Remap raw accent families to medical teal (cascade)
        blue:   { 50:'#ECFEFF',100:'#CFFAFE',200:'#A5F3FC',300:'#67E8F9',400:'#22D3EE',500:'#06B6D4',600:'#0891B2',700:'#0E7490',800:'#155E75',900:'#164E63',950:'#083344' },
        indigo: { 50:'#ECFEFF',100:'#CFFAFE',200:'#A5F3FC',300:'#67E8F9',400:'#22D3EE',500:'#06B6D4',600:'#0891B2',700:'#0E7490',800:'#155E75',900:'#164E63',950:'#083344' },
        purple: { 50:'#ECFEFF',100:'#CFFAFE',200:'#A5F3FC',300:'#67E8F9',400:'#22D3EE',500:'#06B6D4',600:'#0891B2',700:'#0E7490',800:'#155E75',900:'#164E63',950:'#083344' },
        violet: { 50:'#ECFEFF',100:'#CFFAFE',200:'#A5F3FC',300:'#67E8F9',400:'#22D3EE',500:'#06B6D4',600:'#0891B2',700:'#0E7490',800:'#155E75',900:'#164E63',950:'#083344' },
        sky:    { 50:'#ECFEFF',100:'#CFFAFE',200:'#A5F3FC',300:'#67E8F9',400:'#22D3EE',500:'#06B6D4',600:'#0891B2',700:'#0E7490',800:'#155E75',900:'#164E63',950:'#083344' },
        brand:  { 50:'#ECFEFF',100:'#CFFAFE',200:'#A5F3FC',300:'#67E8F9',400:'#22D3EE',500:'#06B6D4',600:'#0891B2',700:'#0E7490',800:'#155E75',900:'#164E63' },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
export default config
