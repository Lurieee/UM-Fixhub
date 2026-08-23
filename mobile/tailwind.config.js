/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        maroon: "rgb(161 0 11 / <alpha-value>)",
        mustard: "rgb(227 167 47 / <alpha-value>)",
        cream: "rgb(250 247 242 / <alpha-value>)",
        ink: "rgb(42 16 21 / <alpha-value>)",
      },
    },
  },
  plugins: [],
};