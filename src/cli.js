import { buildCss, buildHtml } from './build.js'
import { watchSources } from './watch.js'

const options = process.argv.slice(2).join(' ')
const target = 'src/**/*.md'
if (options.includes('--watch')) watchSources(target)
buildHtml(target, true)
buildCss()
