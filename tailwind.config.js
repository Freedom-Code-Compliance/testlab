/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'fcc-black': 'var(--fcc-black)',
        'fcc-dark': 'var(--fcc-dark)',
        'fcc-divider': 'var(--fcc-divider)',
        'fcc-cyan': 'var(--system-color, #3366FF)',
        'fcc-blue': '#0066ff',
        'fcc-white': 'var(--fcc-white)',
      },
    },
  },
  plugins: [],
}



