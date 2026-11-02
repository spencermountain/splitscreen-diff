import test from 'tape'
import buildRows from '../src/model.js'
import buildDisplay from '../src/display.js'
import renderStatic from '../src/static.js'

test('wrapped change rows stay aligned', (t) => {
  const long = 'one two three four five six seven eight nine ten'
  const rows = buildRows(`a\n${long}\nz`, 'a\nshort\nz')
  const { lines } = buildDisplay(rows, 12)
  const changeLines = lines.filter((l) => l.kind === 'change')
  t.ok(changeLines.length > 1, 'long side wrapped into several lines')
  t.equal(changeLines.filter((l) => l.right !== null).length, 1, 'short side padded with filler')
  t.end()
})

test('deleted rows have no right text', (t) => {
  const rows = buildRows('a\ngone\nz', 'a\nz')
  const { lines } = buildDisplay(rows, 20)
  const del = lines.find((l) => l.kind === 'del')
  t.equal(del.left, 'gone')
  t.equal(del.right, null)
  t.end()
})

test('hunks mark the first line of each change run', (t) => {
  const rows = buildRows('a\nb\nc\nd\ne', 'a\nB\nc\nd\nE')
  const { lines, hunks } = buildDisplay(rows, 20)
  t.deepEqual(hunks, [1, 4], 'two separate hunks')
  t.equal(lines.length, 5)
  t.end()
})

test('static render paints blocks and additions', (t) => {
  const rows = buildRows('keep\ngone\nsame\n', 'keep\nsame\nnew line\n')
  const str = renderStatic(rows, { width: 40 })
  t.ok(str.includes('▒'), 'deletion rendered as a block')
  t.ok(str.includes('new line'), 'addition present')
  t.ok(str.includes('│'), 'divider present')
  const lineCount = str.split('\n').length
  t.equal(lineCount, 4, 'one terminal line per row')
  t.end()
})
