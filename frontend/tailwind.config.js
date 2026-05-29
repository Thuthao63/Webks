/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          50: '#fcfaf6',
          100: '#f7f4ec',
          200: '#ebe3d1',
          300: '#dfcfb3',
          400: '#ceb48c',
          500: '#b59a6d', // Base luxury gold
          600: '#a38456',
          700: '#856643',
          800: '#6d543b',
          900: '#5a4633',
          950: '#32251a',
        },
        paper: '#FDFBF7',
        cream: '#F9F8F6',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        luxury: '0 20px 40px -15px rgba(0, 0, 0, 0.05), 0 0 20px rgba(181, 154, 109, 0.1)',
        premium: '0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 0 15px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}