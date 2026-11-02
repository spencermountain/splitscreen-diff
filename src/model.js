import { diffLines } from 'diff'

const splitLines = function (value) {
  const lines = value.split('\n')
  if (lines[lines.length - 1] === '') {
    lines.pop()
  }
  return lines
}

// turn two texts into an aligned list of row-pairs
// kinds: 'same' | 'change' | 'add' | 'del'
const buildRows = function (textA, textB) {
  const parts = diffLines(textA, textB)
  const rows = []
  let i = 0
  while (i < parts.length) {
    const part = parts[i]
    const next = parts[i + 1]
    // a removal followed by an addition is a modification - pair the lines up
    if (part.removed && next && next.added) {
      const oldLines = splitLines(part.value)
      const newLines = splitLines(next.value)
      const len = Math.max(oldLines.length, newLines.length)
      for (let k = 0; k < len; k += 1) {
        const left = k < oldLines.length ? oldLines[k] : null
        const right = k < newLines.length ? newLines[k] : null
        if (left !== null && right !== null) {
          rows.push({ kind: 'change', left, right })
        } else if (left !== null) {
          rows.push({ kind: 'del', left, right: null })
        } else {
          rows.push({ kind: 'add', left: null, right })
        }
      }
      i += 2
      continue
    }
    for (const line of splitLines(part.value)) {
      if (part.removed) {
        rows.push({ kind: 'del', left: line, right: null })
      } else if (part.added) {
        rows.push({ kind: 'add', left: null, right: line })
      } else {
        rows.push({ kind: 'same', left: line, right: line })
      }
    }
    i += 1
  }
  return rows
}

export default buildRows
