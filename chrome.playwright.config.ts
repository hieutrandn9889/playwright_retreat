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
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    launchOptions: {
      slowMo: 500,
      channel: 'chrome',
      args: [
        '--start-maximized',
        '--disable-blink-features=AutomationControlled',
        '--disable-extensions',
        '--disable-sync',
        '--disable-default-apps',
        '--disable-plugins',
        '--disable-images',
        '--disable-component-extensions-with-background-pages',
        '--disable-default-apps',
        '--enable-automation=false',
        '--disable-dev-shm-usage',
        '--single-process=false'
      ]
    }
  },
}
export default config