/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neobrutalist color palette
        'neo-yellow': '#FFD700',
        'neo-pink': '#FF1493',
        'neo-blue': '#00BFFF',
        'neo-green': '#00FF7F',
        'neo-purple': '#9370DB',
        'neo-orange': '#FF8C00',
        'neo-black': '#000000',
        'neo-white': '#FFFFFF',
      },
      boxShadow: {
        'brutal': '8px 8px 0px 0px #000000',
        'brutal-sm': '4px 4px 0px 0px #000000',
        'brutal-lg': '12px 12px 0px 0px #000000',
      },
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
