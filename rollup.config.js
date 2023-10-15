import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import tsconfig from './tsconfig.json' assert { type: 'json' }
export default [
  {
    input: ['./src/my-token.ts'],
    output: {
      format: 'es',
      dir: './exports'
    },
    plugins: [
      nodeResolve(),
      typescript(tsconfig),
      terser({
        mangle: false
      })
    ]
  }
]