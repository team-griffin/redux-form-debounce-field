import babel from 'rollup-plugin-babel';
import memory from 'rollup-plugin-memory';

export default {
  input: 'main.js',
  output: [
    {
      file: `dist/es/redux-form-debounce-field.js`,
      format: 'es',
    },
    {
      file: `dist/cjs/redux-form-debounce-field.js`,
      format: 'cjs',
    },
  ],
  plugins: [
    memory({
      path: 'main.js',
      contents: `
if (process.env.NODE_ENV === 'production') {
module.exports = require('./redux-form-debounce-field.production.js');
} else {
module.exports = require('./redux-form-debounce-field.development.js');
}`,
    }),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};