<div align="center">
  <div><b>splitscreen-diff</b></div>
  <div>CLI plaintext diff viewer</div>
  <div><code>npm install splitscreen-diff</code></div>
  <div align="center">
    <sub>
      by
      <a href="https://github.com/spencermountain">Spencer Kelly</a>
    </sub>
  </div>
  <img height="25px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>
<!--2nd row-->
<div align="center">
  <div>
    <a href="https://npmjs.org/package/splitscreen-diff">
    <img src="https://img.shields.io/npm/v/splitscreen-diff.svg?style=flat-square" />
  </a>
  <a href="https://bundlephobia.com/result?p=splitscreen-diff">
    <img src="https://badgen.net/bundlejs/min/splitscreen-diff" />
  </a>
  </div>
</div>
<!-- spacer -->
<img height="20px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

### Usage

```js
import diff from 'splitscreen-diff'

await diff(textA, textB, { titles: ['before', 'after'] })
// resolves when the viewer is closed
```

the original text sits on the left, the new text on the right —
new text in <b>green</b>, deleted text as a <b>dim red block</b> the same shape as what's missing.
both panes share one scrollbar, so you're always looking at the same spot in each.

| keys | |
| --- | --- |
| `↑`/`↓` or `j`/`k` | scroll |
| `space`/`b` or `pgup`/`pgdn` | page |
| `n` / `p` | next / previous change |
| `g` / `G` | top / bottom |
| `q` / `esc` | quit |

when stdout isn't a tty, it prints the aligned diff once and resolves immediately.

### CLI

```bash
npx splitscreen-diff before.txt after.txt
```

MIT
