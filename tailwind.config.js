/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", 'system-ui', 'sans-serif'],
        display: ["'Space Grotesk'", 'system-ui', 'sans-serif'],
      },
      colors: {
        qv: {
          bg: '#070918',
          panel: 'rgba(14,19,42,0.82)',
          panel2: '#101733',
          line: 'rgba(147,164,255,0.16)',
          muted: '#8f98ba',
          purple: '#9a4dff',
          violet: '#6c3df5',
          cyan: '#29c8e8',
          pink: '#f26bb5',
          green: '#4cdbac',
          yellow: '#ffd75e',
          orange: '#ff9e54',
          red: '#ff5d78',
        }
      },
    },
  },
  plugins: [],
}
