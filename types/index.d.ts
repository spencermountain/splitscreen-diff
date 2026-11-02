/** options for the diff viewer */
export interface DiffOptions {
  /** pane headers shown above each side, e.g. ['before', 'after'] (off by default) */
  titles?: [string, string]
  /** set false to print the aligned diff once instead of opening the viewer */
  interactive?: boolean
  /** column width for the non-interactive render (defaults to terminal width) */
  width?: number
}

/**
 * show two texts side-by-side in the terminal, diff markup on the right pane -
 * new text in green, missing text as a dim red block of the same shape.
 * resolves when the viewer is closed (q / esc / ctrl-c).
 * when stdout isn't a tty, prints the aligned diff once and resolves immediately.
 */
declare function diff(textA: string, textB: string, opts?: DiffOptions): Promise<void>

export default diff
