import { test, step, expect } from "../../../utils/envName"

test.describe('spec', () => {
  test('test', async () => {
    await step('passes', async () => {
      expect(true).toBe(true)
    })
  })
})