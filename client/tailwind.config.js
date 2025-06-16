/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        perspective: { '1000': '1000px' },
        transformStyle: { 'preserve-3d': 'preserve-3d' },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        'white': '#ffffff',
        'gray':'#FFFDFD',
        'primary': '#102430',
        'secondary': '#FF6B00',
        'secondar-light':'#206084'

      },
    },
    plugins: [],
  }
  