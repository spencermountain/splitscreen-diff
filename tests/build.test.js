import test from 'tape'
import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const built = existsSync(fileURLToPath(new URL('../builds/splitscreen-diff.mjs', import.meta.url)))

// only runs once `npm run build` has happened (prepublishOnly does both)
test('bundle renders a static diff with no deps loaded', { skip: !built }, (t) => {
  const code = `import('./builds/splitscreen-diff.mjs').then((m) => m.default('a\\nold\\nz', 'a\\nnew\\nz'))`
  const out = execFileSync(process.execPath, ['-e', code], { cwd: root, encoding: 'utf8' })
  t.ok(out.includes('│'), 'has divider')
  t.ok(out.includes('new'), 'has the new text')
  t.ok(out.includes('old'), 'has the old text')
  t.end()
})
