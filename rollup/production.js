import path from 'path';
import babel from 'rollup-plugin-babel';
import localResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify-es';
import typescript from 'rollup-plugin-typescript2';

const pkg = require(path.resolve('./package.json'));
const external = Object.keys(pkg.dependencies || {})
  .concat(Object.keys(pkg.devDependencies || {}))
  .concat(Object.keys(pkg.peerDependencies || {}));

export default {
  input: 'src/index.ts',
  output: [
    {
      file: `dist/es/redux-form-debounce-field.production.js`,
      format: 'es',
    },
    {
      file: `dist/cjs/redux-form-debounce-field.production.js`,
      format: 'cjs',
    },
  ],
  plugins: [
    localResolve(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    typescript({
      tsconfig: path.resolve('./tsconfig.json'),
      tsconfigOverride: {
        compilerOptions: {
          module: 'ES2015',
        },
      },
    }),
    babel({
      exclude: 'node_modules/**',
      extensions: [ '.js', '.ts', '.tsx' ],
    }),
    uglify(),
  ],
  external,
};