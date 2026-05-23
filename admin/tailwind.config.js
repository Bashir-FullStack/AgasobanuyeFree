/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        primary: { DEFAULT: '#2275fc', light: '#60A5FA', dark: '#1a5fcf' },
        dark: { DEFAULT: '#0F172A', 2: '#1E293B', 3: '#334155' }
      }
    }
  },
  plugins: [],
};
