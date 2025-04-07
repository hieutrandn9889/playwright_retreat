// Documentation https://playwright.dev/docs/api/class-apirequestcontext
import { Locator, Page } from '@playwright/test'
import { PageActions } from './PageActions'

export class LandingPage extends PageActions {

  menuBtn: Locator
  signUpBtn: Locator

  constructor(page: Page) {
    super(page)
    this.menuBtn = page.locator('nav.flex.items-center >> button.Button_outlinePill__JmBTn:has-text("Menu")')
    this.signUpBtn = page.locator('[href="/signup?redirect=/"]')
  }

  async openUrl() {
    await super.openUrl(this.baseUrl)
  }

  async clickMenuBtn() {
    await this.clickElement(this.menuBtn)
  }

  async clickSignUpBtn() {
    await this.clickElement(this.signUpBtn)
  }

}
