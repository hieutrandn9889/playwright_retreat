import { test } from "../../../utils/envName"
import { expect } from "@playwright/test"
import { urls, serviceCategories } from "../../../TestData/softserve.data"

test.describe('E2E Tests - Localization', () => {

  Object.entries(urls).forEach(([region, url]) => {
    test(`Validate categories for ${region}`, async ({ page, pageManager }) => {

      await pageManager.pageActions.openUrl(url)
      const categories = serviceCategories[region]
      
      // Wait for the service items to be visible
      await expect(pageManager.softservePage.serviceItemContent.first()).toBeVisible({ timeout: 15000 })
      
      // Get the service items content
      const elements = await pageManager.softservePage.serviceItemContent.allTextContents()
      console.log(`elements.length: ${elements.length}`)
      console.log(`categories.length: ${categories.length}`)
      expect(elements.length).toBe(categories.length)

      for (let i = 0; i < elements.length; i++) {
        const trimmedElement = elements[i].trim()
        const trimmedCategory = categories[i].trim()
        console.log(`Comparing: ${trimmedElement} with ${trimmedCategory}`)
        expect(trimmedElement).toBe(trimmedCategory)
        // Removed delay - no longer needed
      }
    })
  })

})