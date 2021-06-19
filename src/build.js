import { copyFile, writeFileSync } from 'fs'
import globcat from 'globcat'
import { mdToHtml } from './build-md.js'

export function buildHtml (target, updateTemplate = false) {
  return globcat(target, (error, md) => {
    if (error) throw error
    writeFileSync('public/index.html', mdToHtml(md, updateTemplate))
  })
}

export function buildCss () { return copyFile('src/styles.css', 'public/styles.css', error => { if (error) throw error })}
