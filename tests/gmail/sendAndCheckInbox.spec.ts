import { test } from "../../utils/envName"
import { gmailData } from "../../TestData/gmail.data"

test.describe('E2E Tests - Gmail', () => {

  test(`Valid Email Send and Check Inbox`, async ({ pageManager }) => {
    console.log('📤 Sending test email...')
    await pageManager.gmailApi.sendEmail(gmailData)

    console.log('📥 Waiting for email to appear in inbox...')
    const foundSubject = await pageManager.gmailApi.waitForUnreadEmailWithSubjectFragment(gmailData.subject)

    console.log(`✅ Verified email with subject: ${foundSubject}`)
  })

})
