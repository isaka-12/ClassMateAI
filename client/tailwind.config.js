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
    },
    plugins: [],
  }
  