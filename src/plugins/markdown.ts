import MarkdownIt from 'markdown-it'
import type { Plugin } from 'vite'

const frontmatterRegex = /^---\n[\s\S]*?\n---\n/

const markdownIt = new MarkdownIt({ html: true })

export function markdown(): Plugin {
  return {
    enforce: 'pre',
    name: 'markdown',
    transform(code, id) {
      if (!id.endsWith('.md')) return undefined
      const html = markdownIt.render(code.replace(frontmatterRegex, ''))
      return {
        code: `
import { createElement } from 'react'
export function ReactComponent() {
  return createElement('div', { dangerouslySetInnerHTML: { __html: ${JSON.stringify(html)} } })
}
`,
      }
    },
  }
}
