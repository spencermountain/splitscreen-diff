import test from 'tape'
import stringWidth from 'string-width'
import wrapLine from '../src/wrap.js'

test('short line passes through', (t) => {
  t.deepEqual(wrapLine('hello', 10), ['hello'])
  t.deepEqual(wrapLine('', 10), [''])
  t.end()
})

test('wraps at word boundaries', (t) => {
  const segs = wrapLine('the quick brown fox jumps', 10)
  t.ok(segs.length > 1, 'wrapped into multiple segments')
  t.ok(segs.every((s) => stringWidth(s) <= 10), 'no segment wider than 10')
  const joined = segs.join(' ').replace(/\s+/g, ' ')
  t.equal(joined, 'the quick brown fox jumps', 'no words lost')
  t.end()
})

test('hard-splits words longer than the pane', (t) => {
  t.deepEqual(wrapLine('abcdefghij', 4), ['abcd', 'efgh', 'ij'])
  t.end()
})

test('counts wide characters properly', (t) => {
  const segs = wrapLine('汉字汉字', 4)
  t.deepEqual(segs, ['汉字', '汉字'], 'cjk chars count as two columns')
  t.end()
})

test('expands tabs', (t) => {
  const segs = wrapLine('\ta', 80)
  t.equal(segs[0], '    a')
  t.end()
})
