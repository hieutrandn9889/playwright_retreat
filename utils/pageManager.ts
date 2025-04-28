import { Page } from '@playwright/test'
import { PageActions } from '../Pages/PageActions'
import { ChatPage } from '../Pages/chat.page'
import { SoftServePage } from '../Pages/softserve.page'
import { BookRetreatsPage } from '../Pages/bookretreats.page'
import { GmailApi } from '../APIs/gmailApi'

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
  get softservePage(): SoftServePage {
    return new SoftServePage(this.page)
  }
  get bookretreatsPage(): BookRetreatsPage {
    return new BookRetreatsPage(this.page)
  }
  get gmailApi(): GmailApi {
    return new GmailApi(
      process.env.GMAIL_CLIENT_ID!,
      process.env.GMAIL_CLIENT_SECRET!,
      process.env.GMAIL_REDIRECT_URI!,
      process.env.GMAIL_REFRESH_TOKEN!
    )
  }
}
