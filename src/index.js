import { createElement } from 'react'
import { render } from 'ink'
import buildRows from './model.js'
import App from './ui.js'
import renderStatic from './static.js'

// show two texts side-by-side, diff markup on the right pane.
// resolves when the viewer is closed (q / esc / ctrl-c).
// without a tty, prints the aligned diff once and resolves.
const diff = async function (textA = '', textB = '', opts = {}) {
  textA = String(textA).replace(/\r\n/g, '\n')
  textB = String(textB).replace(/\r\n/g, '\n')
  const rows = buildRows(textA, textB)
  const isTTY = process.stdout.isTTY && process.stdin.isTTY
  if (!isTTY || opts.interactive === false) {
    process.stdout.write(renderStatic(rows, opts) + '\n')
    return
  }
  process.stdout.write('\u001B[?1049h\u001B[H') // enter alternate screen
  const app = render(createElement(App, { rows, opts }), { exitOnCtrlC: true })
  try {
    await app.waitUntilExit()
  } finally {
    process.stdout.write('\u001B[?1049l') // restore the terminal
  }
}

export default diff
