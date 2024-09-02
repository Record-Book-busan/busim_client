/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    g: ({ theme }) => theme('spacing'),
    extend: {
      colors: {
        'BUSIM-blue': '#1D4ED8',
        'BUSIM-gray': '#374151',
        'BUSIM-gray-light': '#9CA3AF',
        'BUSIM-gray-dark': '#1F2937',
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
    preflight: false,
  },
}
