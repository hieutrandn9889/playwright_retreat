// Documentation https://playwright.dev/docs/api/class-apirequestcontext
import { Locator, Page } from '@playwright/test'
import { PageActions } from './PageActions'

interface signUpData {
  firstName: string
  lastName: string
  email: string
  zipCode: string
}

export class SignUp extends PageActions {
  firstNameInput: Locator
  lastNameInput: Locator
  emailInput: Locator
  zipInput: Locator
  subscribeBtn: Locator
  successText: Locator

  constructor(page: Page) {
    super(page)
    this.firstNameInput = page.locator('#firstName')
    this.lastNameInput = page.locator('#lastName')
    this.emailInput = page.locator('#email')
    this.zipInput = page.locator('#zipCode')
    this.subscribeBtn = page.locator('#subscribe')
    this.successText = page.locator('#success')
  }

  async joinTheWaitlist(data: signUpData) {
    await this.fillElement(this.firstNameInput, data.firstName)
    await this.fillElement(this.lastNameInput, data.lastName)
    await this.fillElement(this.emailInput, data.email)
    await this.fillElement(this.zipInput, data.zipCode)
    await this.clickElement(this.subscribeBtn)
    await this.checkElementText(this.successText, 'Thank you for signing up!')
  }
}
