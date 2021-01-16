/*
const tailwind = require('tailwindcss');
const tailwindtypography = require('@tailwindcss/typography');
const ar = require('@tailwindcss/aspect-ratio');
const forms = require('@tailwindcss/forms');
const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');
//const cssnano = require('cssnano');
*/

// const plugins = process.env.NODE_ENV === 'production'
// 	? [tailwind, autoprefixers, cssnano]
// 	: [tailwind, autoprefixer];

//module.exports = { plugins: [tailwind, autoprefixer, postcssPresetEnv()] };

/*
module.exports = {
 	plugins: [require('tailwindcss'), require('autoprefixer')],
};
*/


module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
