const {mdToHtml} = require('./md-to-html')
const chokidar = require('chokidar')
const fs = require('fs')
const globcat = require('globcat')

let watch = false
let focus = '**'
for (const argument of process.argv.slice(2)) {
  if (argument === '--watch') {
    watch = true
  } else {
    focus = argument
  }
}

const target = `src/${focus}/*.md`
const buildHtml = (updateTemplate = false) => globcat(target, (error, md) => {
  if (error) {
    throw error
  }

  fs.writeFileSync('public/index.html', mdToHtml(md, updateTemplate))
})
const copyStyles = () => fs.copyFile('src/styles.css', 'public/styles.css', error => {
  if (error) {
    throw error
  }
})

if (watch) {
  console.log(`watching : ${target}`)
  chokidar.watch(['src/*.html', target]).on('change', path => {
    console.log(`${path} changed, rebuilding...`)
    buildHtml(path.includes('.html'))
  })
  chokidar.watch('src/*.css').on('change', () => {
    console.log('styles changed, copying...')
    copyStyles()
  })
}

buildHtml(true)
copyStyles()
