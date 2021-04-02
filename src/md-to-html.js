const {readFileSync} = require('fs')
const {Converter} = require('showdown')
const showdownToc = require('showdown-toc')
const converter = new Converter({ghCompatibleHeaderId: true, headerLevelStart: 2, extensions: [showdownToc()]})
const today = (d => `${(String(d.getMonth() + 1)).padStart(2, '0')}/${(String(d.getDate())).padStart(2, '0')}/${d.getFullYear()} à ${(String(d.getHours())).padStart(2, '0')}h${(String(d.getMinutes())).padStart(2, '0')}`)(new Date())
let template = ''

function mdToHtml(md, updateTemplate = false) {
  if (updateTemplate) {
    template = String(readFileSync('src/layout.html'))
  }

  const content = converter.makeHtml('# Sommaire\n[toc]\n' + md)
  const html = template.replace('{content}', content).replace('{updated}', today)
  return html
}

module.exports = {mdToHtml}
