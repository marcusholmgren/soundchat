
//const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./src/**/*.jsx', './src/**/*.js', './src/**/*.tsx', './src/**/*.ts'],
  theme: {
    extend: {
      fontFamily: {

      },
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/ui'),
  ],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
};
