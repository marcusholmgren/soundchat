const tailwind = require('tailwindcss');
const autoprefixer = require('autoprefixer');
//const cssnano = require('cssnano');

// const plugins = process.env.NODE_ENV === 'production'
// 	? [tailwind, autoprefixers, cssnano]
// 	: [tailwind, autoprefixer];

module.exports = { plugins: [tailwind, autoprefixer] };

// module.exports = {
// 	plugins: [require('tailwindcss'), require('autoprefixer')],
//   };
