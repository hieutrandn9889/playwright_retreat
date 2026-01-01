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
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    launchOptions: {
      slowMo: 500,
      channel: 'chrome',
      args: [
        '--start-maximized',
        '--disable-blink-features=AutomationControlled',
        '--disable-sync',
        '--disable-default-apps',
        '--enable-automation=false',
        '--disable-dev-shm-usage',
        '--single-process=false',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--allow-running-insecure-content',
        '--disable-webgl',
        '--disable-features=TranslateUI',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    }
  },
}
export default config