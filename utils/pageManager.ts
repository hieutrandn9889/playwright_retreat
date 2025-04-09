import { Page } from '@playwright/test'
import { PageActions } from '../Pages/PageActions'
import { LandingPage } from '../Pages/Landing.page'

export class PageManager {
  page: Page
  constructor(page: Page) {
    this.page = page
  }
  get pageActions(): PageActions {
    return new PageActions(this.page)
  }
  get landingPage(): LandingPage {
    return new LandingPage(this.page)
  }
}
