const chokidar = require('chokidar')
const { buildHtml, buildCss } = require('./build')

module.exports.watchSrc = target => {
  if (!target) throw new Error('cannot watch without target')
  console.log(`watching : ${target}`)
  chokidar.watch(['src/*.html', target]).on('change', path => {
    console.log(`${path} changed, rebuilding...`)
    buildHtml(target, path.includes('.html'))
  })
  chokidar.watch('src/*.css').on('change', () => {
    console.log('styles changed, copying...')
    buildCss()
  })
}
