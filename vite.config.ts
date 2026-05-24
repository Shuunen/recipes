import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { Mode, plugin as md } from 'vite-plugin-markdown'
import { defineConfig } from 'vitest/config'
import { cspNonce } from './src/plugins/csp-nonce.ts'
import { uniqueMark } from './src/plugins/unique-mark.ts'

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    reportCompressedSize: false,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [{ name: 'react-dom', test: /react-dom/ }],
        },
      },
    },
  },
  plugins: [react(), md({ mode: [Mode.REACT, Mode.TOC] }), tailwindcss(), uniqueMark(), cspNonce()],
  test: {
    coverage: {
      exclude: ['**/*.md', 'src/bin/lint.rules.ts'],
      provider: 'v8' as const,
    },
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    reporters: ['dot'],
    silent: true,
  },
})
