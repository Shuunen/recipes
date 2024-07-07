/* eslint-disable no-undef */
/* eslint-disable no-console */
import { globcat } from 'globcat'
import { readFileSync, writeFileSync } from 'node:fs'
import Showdown from 'showdown'
import ShowdownToc from 'showdown-toc'

const timerLabel = 'build exécuté en '
console.time(timerLabel)

// eslint-disable-next-line new-cap
const converter = new Showdown.Converter({ extensions: [ShowdownToc()], ghCompatibleHeaderId: true, headerLevelStart: 2 })
// eslint-disable-next-line no-magic-numbers
const today = (date => `${(String(date.getMonth() + 1)).padStart(2, '0')}/${(String(date.getDate())).padStart(2, '0')}/${date.getFullYear()} à ${(String(date.getHours())).padStart(2, '0')}h${(String(date.getMinutes())).padStart(2, '0')}`)(new Date())
let template = ''

/**
 * Transform md to html
 * @param {string} md the markdown
 * @param {boolean} updateTemplate if true, update the template
 * @returns {string} the html
 */
const mdToHtml = (md, updateTemplate = false) => {
  if (updateTemplate) template = String(readFileSync('src/layout.html'))
  const content = converter.makeHtml(`# Sommaire\n[toc]\n${md}`)
  const html = template.replace('{content}', content).replace('{updated}', today)
  return html
}

/**
 * Build to public/index.html
 * @returns {void}
 */
const buildHtml = () => globcat('src/**/*.md', (error, md) => {
  if (error) throw error
  writeFileSync('public/index.html', mdToHtml(md, true))
})

buildHtml()

console.timeEnd(timerLabel)
