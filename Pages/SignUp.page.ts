// Documentation https://playwright.dev/docs/api/class-apirequestcontext
import { Locator, Frame, FrameLocator, Page } from '@playwright/test'
import { PageActions } from './PageActions'
import { step } from '../utils/envName'

interface signUpData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export class SignUpPage extends PageActions {
  firstNameInput: Locator
  lastNameInput: Locator
  emailInput: Locator
  passwordInput: Locator
  reCAPTCHAFrame: FrameLocator

  constructor(page: Page) {
    super(page)
    this.firstNameInput = page.locator('input#first_name').first()
    this.lastNameInput = page.locator('input#last_name').first()
    this.emailInput = page.locator('#singup-form input[name="email"]').first()
    this.passwordInput = page.locator('#singup-form input[name="password"]').first()
    this.reCAPTCHAFrame = page.frameLocator('iframe[title="reCAPTCHA"]').first()
  }

  async fillSignUpForm(data: signUpData) {
    await step(`Fills sign up form`, async () => {
      await this.fillElement(this.firstNameInput, data.firstName)
      await this.fillElement(this.lastNameInput, data.lastName)
      await this.fillElement(this.emailInput, data.email)
      await this.fillElement(this.passwordInput, data.password)
    })
  }
}
