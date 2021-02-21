
//const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./src/**/*.jsx', './src/**/*.js', './src/**/*.tsx', './src/**/*.ts'],
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {

      },
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'), require('@tailwindcss/aspect-ratio'), require('@tailwindcss/forms'),
  ]
};
