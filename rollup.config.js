import ts from 'rollup-plugin-typescript'
import typescript from 'typescript'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import { uglify } from 'rollup-plugin-uglify'

import {
  name,
  version,
  author,
  main
} from './package.json'

const banner =
  `${'/*!\n' + ' * '}${name} v${version}\n` +
  ` * (c) 2019-${new Date().getFullYear()} ${author}\n` +
  ` * Released under the MIT License.\n` +
  ` */`

export default {
  input: './src/index.ts',
  output: {
    file: main,
    format: 'umd',
    name,
    banner
  },
  plugins: [
    replace({
      VERSION: version,
      delimiters: ['{{', '}}']
    }),
    ts({
      typescript
    }),
    commonjs({
      extensions: ['.js', '.ts']
    }),
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    process.env.NODE_ENV === 'production' ? uglify() : null
  ]
}
