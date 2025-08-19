/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#00ff73ff", // VERDE personalizado
      },
    },
  },
  plugins: [],
};
