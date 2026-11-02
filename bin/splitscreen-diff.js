#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import process from 'node:process'
import diff from '../builds/splitscreen-diff.mjs'

const args = process.argv.slice(2)
if (args.length !== 2 || args.includes('--help') || args.includes('-h')) {
  console.log('usage: splitscreen-diff <before-file> <after-file>')
  process.exit(args.length === 2 ? 0 : 1)
}

let textA = ''
let textB = ''
try {
  textA = readFileSync(args[0], 'utf8')
  textB = readFileSync(args[1], 'utf8')
} catch (e) {
  console.error(e.message)
  process.exit(1)
}

await diff(textA, textB, { titles: [args[0], args[1]] })
