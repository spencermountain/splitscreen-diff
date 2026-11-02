import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import json from '@rollup/plugin-json'

// ink's react-devtools bridge is opt-in dev tooling (requires installing
// react-devtools-core yourself) - stub it so it doesn't land in the bundle
const stubDevtools = {
  name: 'stub-devtools',
  resolveId(id, importer) {
    if (id === 'react-devtools-core' || (id === './devtools.js' && importer && importer.includes('/ink/'))) {
      return '\0devtools-stub'
    }
    return null
  },
  load(id) {
    if (id === '\0devtools-stub') {
      return 'export default {}'
    }
    return null
  }
}

const quiet = new Set(['MODULE_LEVEL_DIRECTIVE', 'CIRCULAR_DEPENDENCY', 'THIS_IS_UNDEFINED'])

export default {
  input: 'src/index.js',
  output: {
    file: 'builds/splitscreen-diff.mjs',
    format: 'es',
    inlineDynamicImports: true
  },
  onwarn: (warning, warn) => {
    if (!quiet.has(warning.code)) {
      warn(warning)
    }
  },
  plugins: [
    stubDevtools,
    replace({
      preventAssignment: true,
      values: { 'process.env.NODE_ENV': JSON.stringify('production') }
    }),
    resolve({ preferBuiltins: true, exportConditions: ['node', 'import', 'module', 'default'] }),
    commonjs(),
    json()
  ]
}
