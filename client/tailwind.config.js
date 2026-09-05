/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        header: ['"Space Grotesk"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        box: 'var(--radiusBox, 10px)',
        component: 'var(--radiusInput, 7px)',
      },
      colors: {
        arix: 'var(--primary, #e5e5e6)',
        black: '#131a20',
        gray: {
          50: '#f4f4f5',
          100: '#d4d4d8',
          200: '#a1a1aa',
          300: '#71717a',
          400: '#52525b',
          500: '#3f3f46',
          600: '#27272a',
          700: '#18181b',
          800: '#0f0f11',
          900: '#08080a',
        },
        neutral: {
          50: '#f4f4f5',
          100: '#d4d4d8',
          200: '#a1a1aa',
          300: '#71717a',
          400: '#52525b',
          500: '#3f3f46',
          600: '#27272a',
          700: '#18181b',
          800: '#0f0f11',
          900: '#08080a',
        },
        success: {
          50: '#e1ffd8',
          100: '#56aa2b',
          200: '#3d8f1f',
        },
        danger: {
          50: '#ffd8d8',
          100: '#aa2a2a',
          200: '#8f1f20',
        },
        secondary: {
          50: '#b2b2c1',
          100: '#42425b',
          200: '#2b2b40',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
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
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
