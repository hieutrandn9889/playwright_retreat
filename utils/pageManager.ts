import { Page } from '@playwright/test'
import { PageActions } from '../Pages/PageActions'
import { Landing } from '../Pages/Landing.page'
import { SignUp } from '../Pages/SignUp.page'

export class PageManager {
  page: Page
  constructor(page: Page) {
    this.page = page
  }
  get pageActions(): PageActions {
    return new PageActions(this.page)
  }
  get landing(): Landing {
    return new Landing(this.page)
  }
  get signUp(): SignUp {
    return new SignUp(this.page)
  }
}
