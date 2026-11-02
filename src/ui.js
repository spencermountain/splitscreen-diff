import { createElement, useState, useMemo, useEffect } from 'react'
import { Box, Text, useApp, useInput, useStdout } from 'ink'
import htm from 'htm'
import stringWidth from 'string-width'
import buildDisplay from './display.js'
import wrapLine from './wrap.js'

const html = htm.bind(createElement)

const pad = function (str, width) {
  return str + ' '.repeat(Math.max(0, width - stringWidth(str)))
}

// one terminal line: left cell, divider, right cell
const Row = function ({ entry, paneW }) {
  const left = pad(entry.left === null ? '' : entry.left, paneW)
  let right = html`<${Text}>${entry.right === null ? '' : entry.right}<//>`
  if (entry.kind === 'del') {
    // silhouette of the missing text, in dim red
    const w = Math.max(1, stringWidth(entry.left === null ? '' : entry.left))
    right = html`<${Text} color="red" dimColor>${'▒'.repeat(w)}<//>`
  } else if ((entry.kind === 'add' || entry.kind === 'change') && entry.right !== null) {
    right = html`<${Text} color="green">${entry.right}<//>`
  }
  return html`<${Text} wrap="truncate">${left}<${Text} dimColor> │ <//>${right}<//>`
}

const App = function ({ rows, opts = {} }) {
  const { stdout } = useStdout()
  const { exit } = useApp()
  const [size, setSize] = useState({
    cols: (stdout && stdout.columns) || 80,
    rows: (stdout && stdout.rows) || 24
  })
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (!stdout || typeof stdout.on !== 'function') {
      return undefined
    }
    const onResize = function () {
      setSize({ cols: stdout.columns || 80, rows: stdout.rows || 24 })
    }
    stdout.on('resize', onResize)
    return () => stdout.off('resize', onResize)
  }, [stdout])

  const titles = opts.titles || null
  const chrome = titles ? 2 : 1
  const viewH = Math.max(1, size.rows - chrome)
  const paneW = Math.max(4, Math.floor((size.cols - 3) / 2))
  const { lines, hunks } = useMemo(() => buildDisplay(rows, paneW), [rows, paneW])
  const maxOffset = Math.max(0, lines.length - viewH)
  const top = Math.min(offset, maxOffset)

  useInput((input, key) => {
    if (input === 'q' || key.escape) {
      exit()
      return
    }
    const clamp = (n) => Math.max(0, Math.min(maxOffset, n))
    if (key.downArrow || input === 'j') {
      setOffset(clamp(top + 1))
    } else if (key.upArrow || input === 'k') {
      setOffset(clamp(top - 1))
    } else if (key.pageDown || input === ' ' || input === 'f') {
      setOffset(clamp(top + viewH))
    } else if (key.pageUp || input === 'b') {
      setOffset(clamp(top - viewH))
    } else if (input === 'g') {
      setOffset(0)
    } else if (input === 'G') {
      setOffset(maxOffset)
    } else if (input === 'n') {
      const next = hunks.find((h) => h > top)
      if (next !== undefined) {
        setOffset(clamp(next))
      }
    } else if (input === 'p') {
      for (let i = hunks.length - 1; i >= 0; i -= 1) {
        if (hunks[i] < top) {
          setOffset(hunks[i])
          break
        }
      }
    }
  })

  const slice = lines.slice(top, top + viewH)
  const pct = maxOffset === 0 ? 100 : Math.round((top / maxOffset) * 100)
  const plural = hunks.length === 1 ? '' : 's'
  const status = ` ${hunks.length} change${plural} · ${pct}% · ↑↓ scroll · n/p jump · q quit`

  return html`
    <${Box} flexDirection="column" height=${size.rows}>
      ${titles
        ? html`<${Text} bold wrap="truncate">${pad(wrapLine(String(titles[0] || ''), paneW)[0], paneW)}<${Text} dimColor> │ <//>${wrapLine(String(titles[1] || ''), paneW)[0]}<//>`
        : null}
      <${Box} flexDirection="column" flexGrow=${1}>
        ${slice.map((entry, i) => html`<${Row} key=${top + i} entry=${entry} paneW=${paneW} />`)}
      <//>
      <${Text} dimColor wrap="truncate">${status}<//>
    <//>
  `
}

export default App
