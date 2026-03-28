/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        daffed: '#DAFFED',
        '9bf3f0': '#9BF3F0',
        '473198': '#473198',
        '4a0d67': '#4A0D67',
        'adfc92': '#ADFC92',
      },
    },
  },
  plugins: [],
}
