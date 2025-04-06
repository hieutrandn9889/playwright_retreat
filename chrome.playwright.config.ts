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
    headless: false,
    viewport: null,
    ignoreHTTPSErrors: true,
    launchOptions: {
      slowMo: 250,
      channel: 'chrome',
      args: [
        '--start-maximized',
        '--disable-extensions',
        '--incognito',
        '--test-type=browser',
        '--disable-dev-shm-usage'
      ]
    }
  },
}
export default config