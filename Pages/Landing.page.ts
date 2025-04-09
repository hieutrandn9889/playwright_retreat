// Documentation https://playwright.dev/docs/api/class-apirequestcontext
import { Locator, Page } from '@playwright/test'
import { PageActions } from './PageActions'
import { step } from '../utils/envName'

interface bookFlightData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export class LandingPage extends PageActions {
  readonly baseUrl: string
  readonly firstNameInput: Locator
  
  constructor(page: Page) {
    super(page)
    this.baseUrl = process.env.BASE_URL!
    this.firstNameInput = page.locator('input#first_name').first()
  }

  async bookFlight(data: bookFlightData) {
    await step(`Books a flight`, async () => {
      await this.openUrl(this.baseUrl)
    })
  }
}
