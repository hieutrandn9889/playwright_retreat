import { test, step } from "../../utils/envName"
import { gmailData } from "../../TestData/gmail.data"

test.describe('E2E Tests - Gmail', () => {

  test(`Valid Gmail Email Send and Inbox Check`, async ({ pageManager }) => {
    await step(`Send email`, async () => {
      await pageManager.gmailApi.sendEmail(gmailData)
    })

    await step(`Check email`, async () => {
      const foundSubject = await pageManager.gmailApi.waitForUnreadEmailWithSubjectFragment(gmailData.subject)
      console.log(`✅ Verified email with subject: ${foundSubject}`)
    })
  })

})
