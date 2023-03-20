module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        84: '22rem',
      },
      transitionProperty: {
        size: 'width, height',
      },
      colors: {
        'dark-gray-900': '#010409',
        'dark-gray-800': '#0d1117',
        'dark-gray-700': '#161b22',
        'dark-gray-600': '#21262d',
        'dark-gray-400': '#30363d',
        'dark-gray-200': '#8b949e',
        'dark-gray-100': '#c9d1d9',
        'dark-blue': '#1f6feb',
        'dark-red': '#f78166',
        'dark-green': '#238636',
      },
    },
    fontFamily: {
      display: ['Mukta', 'sans-serif'],
    },
  },
  variants: {
    extend: {
      backgroundColor: ['checked'],
      borderColor: ['checked'],
      borderWidth: ['last', 'dark'],
      display: ['group-hover'],
      borderRadius: ['last', 'first'],
    },
  },
  plugins: [require('tailwind-scrollbar')],
};
