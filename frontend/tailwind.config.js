/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        field: {
          DEFAULT: "#1F4A3D",
          dark: "#153429",
          light: "#2E6B57",
        },
        harvest: {
          DEFAULT: "#E0A72E",
          light: "#F0C563",
        },
        clay: {
          DEFAULT: "#8C5A3B",
          light: "#B98860",
        },
        paper: "#F7F2E7",
        chili: "#C1442D",
        ink: "#24291F",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
