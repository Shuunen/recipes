import { defineConfig, devices } from '@playwright/test'

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  fullyParallel: true,
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], channel: 'chromium-headless-shell' } }],
  reporter: './e2e/summary-reporter.ts',
  testDir: './e2e',
  use: { baseURL: 'http://localhost:5173' },
  webServer: {
    command: 'pnpm run dev',
    reuseExistingServer: !process.env.CI,
    url: 'http://localhost:5173',
  },
})
