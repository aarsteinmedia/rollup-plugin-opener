import type { RollupOptions } from 'rollup'

import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { dts } from 'rollup-plugin-dts'
import { swc } from 'rollup-plugin-swc3'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'

const __dirname = path.dirname(fileURLToPath(import.meta.url)),
  pkgBuffer = await readFile(new URL(path.resolve(__dirname, 'package.json'), import.meta.url)),
  pkg: typeof import('./package.json') = JSON.parse(pkgBuffer.toString()),
  external = [
    'node:fs',
    'node:http',
    'node:https',
    'node:path',
    'node:os',
    'mime/lite',
    'mime/types/other.js',
    'mime/types/standard.js',
    'open'
  ],
  types: RollupOptions = {
    external,
    input: path.resolve(
      __dirname, 'types', 'index.d.ts'
    ),
    output: {
      file: pkg.types,
      format: 'esm'
    },
    plugins: [dts()]
  },
  plugin: RollupOptions = {
    external,
    input: path.resolve(
      __dirname, 'src', 'index.ts'
    ),
    onwarn(warning, warn) {
      if (warning.code === 'THIS_IS_UNDEFINED') {
        return
      }
      warn(warning)
    },
    output: {
      file: pkg.main,
      format: 'esm'
    },
    plugins: [
      typescriptPaths(),
      nodeResolve({
        extensions: ['.ts'],
        preferBuiltins: true,
      }),
      commonjs(),
      replace({
        '[[VERSION]]': pkg.version,
        preventAssignment: true
      }),
      swc()
    ]
  }

const bundle = process.env.NODE_ENV === 'development' ? plugin : [plugin, types]

export default bundle