/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        backgroundImage: {
        'hero-pattern': "url('/bg.webp')",
        brandBlue: "#125795",
      },
      fontFamily :{
        merriweather: ["Merriweather", 'serif'],
        montserrat: ["Montserrat", 'sans-serif'],
      },
    },
  },
  plugins: [],
}