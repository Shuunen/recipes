import { readFileSync } from 'fs'
import Showdown from 'showdown'
import ShowdownToc from 'showdown-toc'

const converter = new Showdown.Converter({ ghCompatibleHeaderId: true, headerLevelStart: 2, extensions: [ShowdownToc()] })
const today = (d => `${(String(d.getMonth() + 1)).padStart(2, '0')}/${(String(d.getDate())).padStart(2, '0')}/${d.getFullYear()} à ${(String(d.getHours())).padStart(2, '0')}h${(String(d.getMinutes())).padStart(2, '0')}`)(new Date())
let template = ''

export function mdToHtml (md, updateTemplate = false) {
  if (updateTemplate) template = String(readFileSync('src/layout.html'))
  const content = converter.makeHtml('# Sommaire\n[toc]\n' + md)
  const html = template.replace('{content}', content).replace('{updated}', today)
  return html
}
