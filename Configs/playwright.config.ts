import type { PlaywrightTestConfig } from '@playwright/test';

// * variable value is taken from package.json command "test_env" argument
const env = process.env.test_env;
let globTimeout: number
if(env == 'prod'){
  globTimeout = 1000 * 60 * 2 // 2 minutes
}
export {globTimeout}

const config: PlaywrightTestConfig = {
  projects: [
    {
      name: 'all',
      testMatch: ['../tests/**/**/**/*.spec.ts'],
      testIgnore: []
    },
    {
      name: 'template',
      testMatch: ['../tests/_template/*.spec.ts'],
      testIgnore: []
    },
    {
      name: 'bookretreats:e2e',
      testMatch: ['../tests/bookretreats.com/e2e/*.spec.ts'],
      testIgnore: []
    }
  ],
  timeout: globTimeout,
  expect: { 
    timeout: globTimeout 
  },
  globalSetup: 'utils/globalSetup.ts',
  reporter: [
    ['line'],
    ['html', {
      outputFolder: 'html_report',
      open: 'never',
      inlineImages: true
    }],
  ],
  use: {
    actionTimeout: globTimeout,
    navigationTimeout: globTimeout,
    screenshot: 'only-on-failure',
    video: {
      mode: 'retain-on-failure',
      // size: {
      //   width: 1920,
      //   height: 1080
      // }
    },
    trace: 'retain-on-failure',
    contextOptions: {
      recordVideo: {
        dir: './test-results/videos/',
        // size: {
        //   width: 1920,
        //   height: 1080
        // }
      },
      colorScheme: 'dark',
      serviceWorkers: 'allow'
    }
  }
};

export default config;