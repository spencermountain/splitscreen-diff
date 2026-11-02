import test from 'tape'
import buildRows from '../src/model.js'

test('identical text', (t) => {
  const rows = buildRows('a\nb\nc', 'a\nb\nc')
  t.equal(rows.length, 3, 'three rows')
  t.ok(rows.every((r) => r.kind === 'same'), 'all same')
  t.end()
})

test('pure addition', (t) => {
  const rows = buildRows('a\nc', 'a\nb\nc')
  t.deepEqual(rows.map((r) => r.kind), ['same', 'add', 'same'])
  t.equal(rows[1].left, null, 'left side is filler')
  t.equal(rows[1].right, 'b', 'right side has new line')
  t.end()
})

test('pure deletion', (t) => {
  const rows = buildRows('a\nb\nc', 'a\nc')
  t.deepEqual(rows.map((r) => r.kind), ['same', 'del', 'same'])
  t.equal(rows[1].left, 'b', 'left side keeps old line')
  t.equal(rows[1].right, null, 'right side is a block')
  t.end()
})

test('modification pairs into one row', (t) => {
  const rows = buildRows('a\nold line\nc', 'a\nnew line\nc')
  t.deepEqual(rows.map((r) => r.kind), ['same', 'change', 'same'])
  t.equal(rows[1].left, 'old line')
  t.equal(rows[1].right, 'new line')
  t.end()
})

test('uneven modification', (t) => {
  const rows = buildRows('a\none\ntwo\nthree\nz', 'a\nsingle\nz')
  t.deepEqual(rows.map((r) => r.kind), ['same', 'change', 'del', 'del', 'same'])
  t.equal(rows[1].left, 'one')
  t.equal(rows[1].right, 'single')
  t.end()
})

test('more new lines than old', (t) => {
  const rows = buildRows('a\none\nz', 'a\nuno\ndos\nz')
  t.deepEqual(rows.map((r) => r.kind), ['same', 'change', 'add', 'same'])
  t.end()
})

test('empty inputs', (t) => {
  t.deepEqual(buildRows('', ''), [], 'no rows for empty texts')
  const rows = buildRows('', 'hello')
  t.deepEqual(rows.map((r) => r.kind), ['add'])
  t.end()
})

test('empty line changes survive', (t) => {
  const rows = buildRows('a\n\nb', 'a\nb')
  const del = rows.find((r) => r.kind === 'del')
  t.equal(del.left, '', 'deleted empty line is kept as a row')
  t.end()
})
