/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          light: '#a3d5ff',
          DEFAULT: '#0077b6',
          dark: '#023e8a',
        },
        whale: {
          blue: '#03045e',
          gray: '#6c757d',
        },
        'neon-pink': '#ff3ec8',
        'neon-blue': '#00f0ff',
        'neon-yellow': '#fff700',
      },
      fontFamily: {
        whale: ['"Merriweather Sans"', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 8px #ff3ec8, 0 0 16px #00f0ff, 0 0 24px #fff700',
      },
    },
  },
  plugins: [],
}

