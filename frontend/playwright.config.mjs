import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  webServer: [
    {
      command: 'cd /Users/wine/repos/personal/learlify/learlify-app/backend && npm run start',
      port: 3100,
      reuseExistingServer: true,
      timeout: 30000,
    },
    {
      command: 'cd /Users/wine/repos/personal/learlify/learlify-app/frontend && npx vite --port 3000',
      port: 3000,
      reuseExistingServer: true,
      timeout: 30000,
    },
  ],
})
