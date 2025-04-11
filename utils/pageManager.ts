import { Page } from '@playwright/test'
import { PageActions } from '../Pages/PageActions'
import { ChatPage } from '../Pages/chat.page'

export class PageManager {
  page: Page
  constructor(page: Page) {
    this.page = page
  }
  get pageActions(): PageActions {
    return new PageActions(this.page)
  }
  get chatPage(): ChatPage {
    return new ChatPage(this.page)
  }
}
