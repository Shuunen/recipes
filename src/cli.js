const { watchSrc } = require('./watch')
const { buildHtml, buildCss } = require('./build')

const options = process.argv.slice(2).join(' ')
const target = 'src/**/*.md'
if (options.includes('--watch')) watchSrc(target)
buildHtml(target, true)
buildCss()
