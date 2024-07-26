/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'customBlu': '#0E4194',
      },
    },
  },
  plugins: [],
  corePlugins: {
    backgroundOpacity: true,
    preflight: false,
  },
};
