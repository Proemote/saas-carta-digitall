import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: "#f2ead9",
        cream: "#faf7ef",
        parchment: "#ede2cb",
        wood: "#6b4f3a",
        "wood-dark": "#3a2a1e",
        ink: "#241a12",
        teja: "#a03d2a",
        "teja-dark": "#7e2e1f",
        gold: "#c89b5f",
        "gold-soft": "#e3cfa8",
      },
      fontFamily: {
        script: ["var(--font-dancing)", "cursive"],
        body: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
