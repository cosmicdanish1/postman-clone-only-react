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
        // Add your custom colors here
        primary: {
          DEFAULT: 'var(--color-primary, #3b82f6)',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Add more custom colors as needed
      },
      // Add any other theme extensions here
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
  // Safelist all dynamic classes
  safelist: [
    // Accent colors
    'bg-blue-500', 'hover:bg-blue-600', 'focus:ring-blue-500',
    'bg-green-500', 'hover:bg-green-600', 'focus:ring-green-500',
    'bg-red-500', 'hover:bg-red-600', 'focus:ring-red-500',
    'bg-yellow-500', 'hover:bg-yellow-600', 'focus:ring-yellow-500',
    'bg-purple-500', 'hover:bg-purple-600', 'focus:ring-purple-500',
    'bg-pink-500', 'hover:bg-pink-600', 'focus:ring-pink-500',
    'bg-indigo-500', 'hover:bg-indigo-600', 'focus:ring-indigo-500',
    'bg-cyan-500', 'hover:bg-cyan-600', 'focus:ring-cyan-500',
    'bg-orange-500', 'hover:bg-orange-600', 'focus:ring-orange-500',
    // Text colors
    'text-blue-500', 'text-green-500', 'text-red-500', 'text-yellow-500',
    'text-purple-500', 'text-pink-500', 'text-indigo-500', 'text-cyan-500',
    // Border colors
    'border-blue-500', 'border-green-500', 'border-red-500', 'border-yellow-500',
    'border-purple-500', 'border-pink-500', 'border-indigo-500', 'border-cyan-500',
    // Other utility classes that might be used dynamically
    'bg-gray-800', 'bg-gray-700', 'bg-gray-600', 'bg-gray-500', 'bg-gray-400',
    'hover:bg-gray-700', 'hover:bg-gray-600', 'hover:bg-gray-500', 'hover:bg-gray-400',
    'text-white', 'text-gray-100', 'text-gray-200', 'text-gray-300', 'text-gray-400',
    'border-gray-700', 'border-gray-600', 'border-gray-500', 'border-gray-400',
    // Add any other dynamic classes you might be using
  ],
}