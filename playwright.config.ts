import type { PlaywrightTestConfig } from '@playwright/test'

const env = process.env.test_env
let globTimeout: number
if (env == 'prod') {
  globTimeout = 1000 * 60 * 1 // 1 minute
}
export { globTimeout }

const config: PlaywrightTestConfig = {
  projects: [
    {
      name: 'chat:e2e',
      testMatch: ['/tests/chat/e2e/*.spec.ts'],
      testIgnore: [],
    },
  ],
  timeout: globTimeout,
  expect: {
    timeout: globTimeout,
  },
  globalSetup: './utils/globalSetup.ts',
  reporter: [
    ['line'],
    ['html', {
      outputFolder: './html_report',
      open: 'never',
      inlineImages: true,
    }],
  ],
  use: {
    actionTimeout: globTimeout,
    navigationTimeout: globTimeout,
    video: {
      mode: 'retain-on-failure',
    },
    contextOptions: {
      recordVideo: {
        dir: 'test-results/videos',
        size: { width: 1280, height: 720 },
      }
    },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
}

export default config