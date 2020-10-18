const tailwind = require('tailwindcss');
const tailwindui = require('@tailwindcss/ui')
const autoprefixer = require('autoprefixer');
//const cssnano = require('cssnano');

// const plugins = process.env.NODE_ENV === 'production'
// 	? [tailwind, autoprefixers, cssnano]
// 	: [tailwind, autoprefixer];

module.exports = { plugins: [tailwind, tailwindui, autoprefixer] };

// module.exports = {
// 	plugins: [require('tailwindcss'), require('autoprefixer')],
//   };
