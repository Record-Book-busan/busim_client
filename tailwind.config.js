/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    g: ({ theme }) => theme('spacing'),
    extend: {
      colors: {
        customBlu: '#0E4194',
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          g: value => ({
            gap: value,
          }),
        },
        { values: theme('g') },
      )
    }),
  ],
  corePlugins: {
    backgroundOpacity: true,
  },
}
