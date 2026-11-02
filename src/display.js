import wrapLine from './wrap.js'

// expand row-pairs into terminal lines at a given pane width.
// each row-pair becomes max(leftHeight, rightHeight) lines, so the
// two panes can never drift out of alignment - a null side is filler.
const buildDisplay = function (rows, width) {
  const lines = []
  for (const row of rows) {
    const leftSegs = row.left === null ? [] : wrapLine(row.left, width)
    const rightSegs = row.right === null ? [] : wrapLine(row.right, width)
    const len = Math.max(leftSegs.length, rightSegs.length, 1)
    for (let i = 0; i < len; i += 1) {
      lines.push({
        kind: row.kind,
        left: i < leftSegs.length ? leftSegs[i] : null,
        right: i < rightSegs.length ? rightSegs[i] : null
      })
    }
  }
  // first line of each run of changes, for n/p navigation
  const hunks = []
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].kind !== 'same' && (i === 0 || lines[i - 1].kind === 'same')) {
      hunks.push(i)
    }
  }
  return { lines, hunks }
}

export default buildDisplay
