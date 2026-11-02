import stringWidth from 'string-width'
import buildDisplay from './display.js'

const codes = {
  green: '\u001B[32m',
  dimRed: '\u001B[2;31m',
  dim: '\u001B[2m',
  bold: '\u001B[1m',
  reset: '\u001B[0m'
}

// non-interactive render: the whole aligned diff as one string
const renderStatic = function (rows, opts = {}) {
  const useColor = !process.env.NO_COLOR
  const paint = function (str, code) {
    return useColor ? code + str + codes.reset : str
  }
  const cols = opts.width || process.stdout.columns || 80
  const paneW = Math.max(4, Math.floor((cols - 3) / 2))
  const pad = (str) => str + ' '.repeat(Math.max(0, paneW - stringWidth(str)))
  const sep = paint(' │ ', codes.dim)
  const { lines } = buildDisplay(rows, paneW)
  const out = []
  if (opts.titles) {
    out.push(paint(pad(String(opts.titles[0] || '')), codes.bold) + sep + paint(String(opts.titles[1] || ''), codes.bold))
  }
  for (const e of lines) {
    const left = pad(e.left === null ? '' : e.left)
    let right = e.right === null ? '' : e.right
    if (e.kind === 'del') {
      right = paint('▒'.repeat(Math.max(1, stringWidth(e.left === null ? '' : e.left))), codes.dimRed)
    } else if ((e.kind === 'add' || e.kind === 'change') && e.right !== null) {
      right = paint(right, codes.green)
    }
    out.push(left + sep + right)
  }
  return out.join('\n')
}

export default renderStatic
