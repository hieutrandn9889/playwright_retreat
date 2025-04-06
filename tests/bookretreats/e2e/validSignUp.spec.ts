import { test, step } from "../../../utils/envName"
import { validSignUpData } from '../../../TestData/signUp.data'

test.describe('Bookretreats: E2E Tests', () => {
  test('Valid Sign Up', async ({ pageManager }) => {
    await step('signs up with valid data', async () => {
      await pageManager.landingPage.openUrl()
      await pageManager.signUpPage.clickSignUpBtn()
      await pageManager.signUpPage.fillSignUpForm(validSignUpData)
    })
  })
})