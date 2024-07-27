'use strict'

const { writeLog } = require('./utils.cjs')

/* eslint-disable jsdoc/require-jsdoc */
/** @type {import("markdownlint").Rule} */
module.exports = {
  "description": "Rule that reports an error for the first line",
  "function": function rule (parameters, onError) {
    const firstLine = parameters.lines[0]
    const isTitle = firstLine.startsWith("# ")
    if (!isTitle) onError({
      "detail": "The first line must be a title",
      "lineNumber": 1,
    })
    const nbMatches = firstLine.match(/\p{Emoji}/gu).length
    // eslint-disable-next-line no-magic-numbers
    const hasEmoji = nbMatches === 2 // because it match "#" and one emoji
    writeLog(parameters, `hasEmoji ? ${hasEmoji}`)
    if (!hasEmoji) onError({
      "detail": "The first line must contain emoji ^^",
      "lineNumber": 1,
    })
  },
  "names": ["first-line"],
  "parser": "none",
  "tags": ["test"],
}
