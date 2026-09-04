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
        brand: {
          dark: {
            900: "#0D0D0D",
            800: "#141414",
            700: "#1F1F1F",
            600: "#2A2A2A",
            500: "#383838",
          },
          gold: {
            DEFAULT: "#D4A72C",
            light: "#F3C649",
            dark: "#AA8015",
            glow: "rgba(212, 167, 44, 0.2)",
          },
          cream: {
            DEFAULT: "#F5EBDD",
            muted: "#C8BDAC",
            dim: "#8C8375",
          },
          red: {
            DEFAULT: "#7A1F1F",
            bright: "#B92B2B",
            dark: "#4A1212",
          },
        },
      },
      fontFamily: {
        cairo: ["var(--font-cairo)", "sans-serif"],
        tajawal: ["var(--font-tajawal)", "sans-serif"],
      },
      boxShadow: {
        gold: "0 4px 20px -2px rgba(212, 167, 44, 0.3)",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.8)",
      },
      animation: {
        'flame-glow': 'flameGlow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        flameGlow: {
          '0%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(212, 167, 44, 0.4))' },
          '100%': { opacity: '0.9', filter: 'drop-shadow(0 0 30px rgba(122, 31, 31, 0.7))' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
