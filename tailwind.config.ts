import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",      // Correct path for pages
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // For components if any
    "./app/**/*.{js,ts,jsx,tsx,mdx}",        // For app folder usage
    "./public/**/*.svg",                     // Optional: for SVGs if styled
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
