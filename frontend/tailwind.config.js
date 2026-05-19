// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind where your JSX files are
  // Without this: Tailwind generates nothing
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      // Custom font — use className="font-playfair" anywhere
      fontFamily: {
        playfair: ['"Playfair Display"', "serif"],
        sans:     ['"Inter"', "sans-serif"], // optional base font
      },

      // Custom colors — use className="bg-brand text-brand-dark"
      colors: {
        brand: {
          DEFAULT: "#1a1a2e",
          light:   "#e8e0f5",
          dark:    "#0f0f1a",
        },
      },

      // Custom screen sizes if needed
      screens: {
        xs: "480px",
      },
    },
  },

  plugins: [],
};