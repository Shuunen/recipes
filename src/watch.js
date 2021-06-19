import { watch } from 'chokidar'
import { buildCss, buildHtml } from './build.js'

export function watchSources (target) {
  if (!target) throw new Error('cannot watch without target')
  console.log(`watching : ${target}`)
  watch(['src/*.html', target]).on('change', path => {
    console.log(`${path} changed, rebuilding...`)
    buildHtml(target, path.includes('.html'))
  })
  watch('src/*.css').on('change', () => {
    console.log('styles changed, copying...')
    buildCss()
  })
}
