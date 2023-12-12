/* eslint-disable no-console */
import { readFileSync, writeFileSync } from 'fs'
import { globcat } from 'globcat'
import Showdown from 'showdown'
import ShowdownToc from 'showdown-toc'

const timerLabel = 'build exécuté en '
console.time(timerLabel)

const converter = new Showdown.Converter({ ghCompatibleHeaderId: true, headerLevelStart: 2, extensions: [ShowdownToc()] })
const today = (date => `${(String(date.getMonth() + 1)).padStart(2, '0')}/${(String(date.getDate())).padStart(2, '0')}/${date.getFullYear()} à ${(String(date.getHours())).padStart(2, '0')}h${(String(date.getMinutes())).padStart(2, '0')}`)(new Date())
let template = ''

const mdToHtml = (md, updateTemplate = false) => {
  if (updateTemplate) template = String(readFileSync('src/layout.html'))
  const content = converter.makeHtml('# Sommaire\n[toc]\n' + md)
  const html = template.replace('{content}', content).replace('{updated}', today)
  return html
}

const buildHtml = () => globcat('src/**/*.md', (error, md) => {
  if (error) throw error
  writeFileSync('public/index.html', mdToHtml(md, true))
})

buildHtml()

console.timeEnd(timerLabel)
