import { test, step } from "../../../utils/envName"
import { bookFlightData } from '../../../TestData/bookFlight.data'

test.describe('Bookretreats: E2E Tests', () => {
  test('Book a flight', async ({ pageManager }) => {
    await step('books a flight', async () => {
      await pageManager.landingPage.bookFlight(bookFlightData)
    })
  })
})  