import stringWidth from 'string-width'

const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

// take the widest grapheme-safe chunk off the front of a word that fits in `width` columns
const takeChunk = function (word, width) {
  let chunk = ''
  let w = 0
  for (const { segment } of segmenter.segment(word)) {
    const sw = stringWidth(segment)
    if (chunk !== '' && w + sw > width) {
      break
    }
    chunk += segment
    w += sw
    if (w >= width) {
      break
    }
  }
  return chunk === '' ? word.slice(0, 1) : chunk
}

// wrap one line of plaintext into segments no wider than `width` columns
const wrapLine = function (text, width) {
  text = text.replace(/\t/g, '    ')
  if (width < 1) {
    width = 1
  }
  if (stringWidth(text) <= width) {
    return [text]
  }
  const out = []
  let line = ''
  let lineW = 0
  const push = function () {
    out.push(line.replace(/\s+$/, ''))
    line = ''
    lineW = 0
  }
  for (let tok of text.split(/(\s+)/)) {
    if (tok === '') {
      continue
    }
    let tw = stringWidth(tok)
    if (lineW + tw <= width) {
      line += tok
      lineW += tw
      continue
    }
    // whitespace that would overflow becomes the break itself
    if (/^\s+$/.test(tok)) {
      push()
      continue
    }
    if (lineW > 0) {
      push()
    }
    // a single word wider than the pane gets hard-split
    while (tw > width) {
      const chunk = takeChunk(tok, width)
      out.push(chunk)
      tok = tok.slice(chunk.length)
      tw = stringWidth(tok)
    }
    line = tok
    lineW = tw
  }
  if (line !== '') {
    push()
  }
  if (out.length === 0) {
    out.push('')
  }
  return out
}

export default wrapLine
