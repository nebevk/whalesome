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
      },
      fontFamily: {
        whale: ['"Merriweather Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

