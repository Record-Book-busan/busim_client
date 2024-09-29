/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    g: ({ theme }) => theme('spacing'),
    extend: {
      fontFamily: {
        Light: ['Pretendard-Light'],
        Regular: ['Pretendard-Regular'],
        Medium: ['Pretendard-Medium'],
        Bold: ['Pretendard-Bold'],
        SemiBold: ['Pretendard-SemiBold'],
      },
      colors: {
        'BUSIM-blue': '#004fec',
        'BUSIM-blue-light': '#f4f8ff',
        'BUSIM-blue-dark': '#1243b6',
        'BUSIM-slate': '#b2bfd1',
        'BUSIM-slate-light': '#f1f4fb',
        'BUSIM-slate-dark': '#6e7d9d',
        'BUSIM-gray': '#374151',
        'BUSIM-gray-light': '#9CA3AF',
        'BUSIM-gray-dark': '#1F2937',
        'BUSIM-deep-lavender': '#796BBB',
        'BUSIM-thulian-pink': '#ED90A8',
        'BUSIM-warm-pink': '#F55C74',
        'BUSIM-ball-blue': '#11ABDF',
        'BUSIM-cherry': '#D71639',
        'BUSIM-olive-green': '#517900',
        'BUSIM-summber-green': '#84B768',
        'BUSIM-beaver': '#A08168',
        'BUSIM-sandy-beach': '#F5E1A6',
      },
      aspectRatio: {
        '3/4': '3 / 4',
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
