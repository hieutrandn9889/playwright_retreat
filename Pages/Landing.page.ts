// Documentation https://playwright.dev/docs/api/class-apirequestcontext
import { Locator, Page } from '@playwright/test'
import { PageActions } from './PageActions'

export class LandingPage extends PageActions {

  menuBtn: Locator
  signUpBtn: Locator

  constructor(page: Page) {
    super(page)
    this.menuBtn = page.locator('nav.items-center >> button:has-text("Menu")')
    this.signUpBtn = page.locator('[href="/signup?redirect=/"]')
  }

}
