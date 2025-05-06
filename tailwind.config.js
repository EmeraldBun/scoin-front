/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        monobank: '#0f0f0f',
        hacker: '#00ff88',
      },
      boxShadow: {
        neon: '0 0 10px #00ff88',
      },
    },
  },
  plugins: [],
}
