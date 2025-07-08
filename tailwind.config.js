/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       colors: {
        bg: 'var(--color-bg)',
        text: 'var(--color-text)',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
} 