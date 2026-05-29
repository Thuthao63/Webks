/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        paper: '#ffffff',
        cream: '#f0fdfa',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        luxury: '0 20px 40px -15px rgba(0, 0, 0, 0.05), 0 0 20px rgba(16, 185, 129, 0.1)',
        premium: '0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 0 15px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}