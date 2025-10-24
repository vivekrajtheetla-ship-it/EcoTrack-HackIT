/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#48bb78',
          DEFAULT: '#38a169',
          dark: '#2f855a',
        },
        secondary: {
          light: '#4299e1',
          DEFAULT: '#3182ce',
          dark: '#2b6cb0',
        },
      },
    },
  },
  plugins: [],
}