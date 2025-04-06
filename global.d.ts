// global.d.ts
import { TestType, expect as playwrightExpect } from '@playwright/test'
import { TestFixtures, WorkerFixtures } from './utils/envName'

declare global {
  var test: TestType<TestFixtures, WorkerFixtures>
  var step: (name: string, callback: () => Promise<void>) => Promise<void>
  var expect: typeof playwrightExpect
}

export {}