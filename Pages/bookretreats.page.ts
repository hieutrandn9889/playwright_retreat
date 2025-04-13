// Documentation https://playwright.dev/docs/api/class-apirequestcontext
import { Locator, FrameLocator, Page } from '@playwright/test'
import { PageActions } from './PageActions'
import { test } from '../utils/envName'

interface SignUpData {
  url: string
  firstName: string
  lastName: string
  email: string
  password: string
}

export class BookRetreatsPage extends PageActions {
  
  readonly form: Locator
  readonly firstNameInput: Locator
  readonly lastNameInput: Locator
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly recaptchaIframe: FrameLocator
  readonly recaptchaCheckbox: Locator
  readonly recaptchaCheckboxChechmark: Locator
  readonly recaptchaChallengeIframe: FrameLocator
  readonly recaptchaObjectNameContainer: Locator
  readonly createAccountButton: Locator

  constructor(page: Page) {
    super(page)
    this.form = page.locator('form[id="singup-form"]')
    this.firstNameInput = this.form.locator('input[name="first_name"]')
    this.lastNameInput = this.form.locator('input[name="last_name"]')
    this.emailInput = this.form.locator('input[name="email"]')
    this.passwordInput = this.form.locator('input[name="password"]')
    this.recaptchaIframe = this.form.frameLocator('iframe[title="reCAPTCHA"]')
    this.recaptchaCheckbox = this.recaptchaIframe.locator('.recaptcha-checkbox-unchecked')
    this.recaptchaChallengeIframe = page.frameLocator('[style*="width"] iframe[title="recaptcha challenge expires in two minutes"]')
    this.recaptchaObjectNameContainer = this.recaptchaChallengeIframe.locator('.rc-imageselect-desc-no-canonical strong')
    this.recaptchaCheckboxChechmark = this.recaptchaIframe.locator('.recaptcha-checkbox-checkmark')
    this.createAccountButton = this.form.locator('[class*="validSubmit"]')
  }

  async fillSignUpForm(signUpData: SignUpData) {
    await test.step('fills sign-up form', async () => {
      await this.openUrl(signUpData.url)
      await this.fillElement(this.firstNameInput, signUpData.firstName)
      await this.fillElement(this.lastNameInput, signUpData.lastName)
      await this.fillElement(this.emailInput, signUpData.email)
      await this.fillElement(this.passwordInput, signUpData.password)
    })
  }

  async solveRecaptcha() {
    await test.step('solves reCAPTCHA', async () => {
      await this.recaptchaCheckbox.click()
      const objectName = await this.recaptchaObjectNameContainer.textContent()
      const objectNameToSearch = objectName?.trim()
      console.log(`ReCAPTCHA Object Name To Search: ${objectNameToSearch}`)
      //await this.recaptchaCheckboxChechmark.waitFor({ state: 'visible' })
    })
  }

  async submitSignUpForm() {
    await test.step('submits sign-up form', async () => {
      await this.clickElement(this.createAccountButton)
    })
  }
}
