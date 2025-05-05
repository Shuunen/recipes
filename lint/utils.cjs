'use strict'

const { writeFileSync } = require("node:fs")
const path = require('node:path')

/**
 * Write a message to the log file
 * @param {import("markdownlint").RuleParams} parameters The rule parameters
 * @param {string} message The message to write
 * @returns {void}
 */
function writeLog(parameters, message) {
  const name = path.basename(parameters.name)
  const line = `${name} : ${message}`
  // eslint-disable-next-line no-undef
  writeFileSync(`${__dirname}/lint.log`, `${line}\n`, { "flag": "a" })
}

module.exports = { writeLog }
