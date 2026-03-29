/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          100: '#f8f9fc',
          200: '#f1f3f9',
          300: '#dee3ed',
          400: '#c2c9d6',
          500: '#8f96a3',
          600: '#5e636e',
          700: '#2f3237',
          800: '#1d1e20',
          900: '#111213',
        }
      }
    },
  },
  plugins: [],
}
