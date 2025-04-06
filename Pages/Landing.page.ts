// Documentation https://playwright.dev/docs/api/class-apirequestcontext
import { Locator, Page } from '@playwright/test'
import { PageActions } from './PageActions'

export class Landing extends PageActions {
  constructor(page: Page) {
    super(page)
  }

  async joinTheWaitlist() {
    await this.openUrl(this.baseUrl)
  }
}
