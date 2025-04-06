import { PlaywrightTestConfig } from '@playwright/test'
import base from './playwright.config'
import { globTimeout } from './playwright.config'

const config: PlaywrightTestConfig = {
  ...base,
  fullyParallel: false,
  timeout: globTimeout,
  workers: 1,
  retries: 0,
  use: {
    ...base.use,
    browserName: 'firefox',
    headless: false,
    viewport: { width: 1920, height: 1280 },
    ignoreHTTPSErrors: true,
    launchOptions: {
      slowMo: 250,
      args: [
        '--disable-extensions',
        '--incognito',
        '--test-type=browser',
        '--disable-dev-shm-usage'
      ]
    }
  }
}

export default config
