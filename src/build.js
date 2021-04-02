const { mdToHtml } = require('./build-md')
const fs = require('fs')
const globcat = require('globcat')

module.exports.buildHtml = (target, updateTemplate = false) => globcat(target, (error, md) => {
  if (error) throw error
  fs.writeFileSync('public/index.html', mdToHtml(md, updateTemplate))
})

module.exports.buildCss = () => fs.copyFile('src/styles.css', 'public/styles.css', error => { if (error) throw error })
