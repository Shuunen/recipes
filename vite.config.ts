import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'
import { cspNonce } from './src/plugins/csp-nonce.ts'
import { markdown } from './src/plugins/markdown.ts'
import { uniqueMark } from './src/plugins/unique-mark.ts'

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  build: {
    reportCompressedSize: false,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [{ name: 'react-dom', test: /react-dom/ }],
        },
      },
    },
  },
  plugins: [
    react(),
    markdown(),
    tailwindcss(),
    uniqueMark(),
    cspNonce(),
    // oxlint-disable-next-line new-cap
    VitePWA({
      // the manifest is public/manifest.webmanifest, linked from index.html
      manifest: false,
      registerType: 'autoUpdate',
      workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'] },
    }),
  ],
  // dedicated ports, so apps never collide when running together
  preview: { port: 4107, strictPort: true },
  server: { port: 5107, strictPort: true },
  test: {
    coverage: {
      exclude: ['**/*.md', 'src/bin/lint.rules.ts'],
      provider: 'v8' as const,
      thresholds: {
        100: true,
      },
    },
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    reporters: ['dot'],
    silent: true,
  },
})
