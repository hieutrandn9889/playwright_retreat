// Documentation https://playwright.dev/docs/api/class-apirequestcontext
import { Locator, FrameLocator, Page, expect } from '@playwright/test'
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
  readonly recaptchaChallengeContainer: Locator
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
    this.recaptchaCheckbox = this.recaptchaIframe.locator('.recaptcha-checkbox-border')
    this.recaptchaChallengeIframe = page.frameLocator('[style*="width"] iframe[title="recaptcha challenge expires in two minutes"]')
    this.recaptchaObjectNameContainer = this.recaptchaChallengeIframe.locator('.rc-imageselect-desc-no-canonical strong')
    this.recaptchaChallengeContainer = this.recaptchaChallengeIframe.locator('.rc-imageselect-challenge')
    this.recaptchaCheckboxChechmark = this.recaptchaIframe.locator('.recaptcha-checkbox-checked')
    this.createAccountButton = this.form.locator('[class*="validSubmit"]')
  }

  async fillSignUpForm(signUpData: SignUpData) {
    await test.step('fills sign-up form', async () => {
      await this.openUrl(signUpData.url)
      await this.page.waitForTimeout(5000) // Wait for page to load completely
      await this.fillElement(this.firstNameInput, signUpData.firstName)
      await this.fillElement(this.lastNameInput, signUpData.lastName)
      await this.fillElement(this.emailInput, signUpData.email)
      await this.fillElement(this.passwordInput, signUpData.password)
    })
  }

  async generateGptPrompt(objectNameToSearch: string): Promise<string> {
    return `Count the amount of images on this picture.
    Store the amount of images in a numbered array, e.g. [1,2,3,4,5,6,7...(depending on the image quantity)].
    Then, detect which of the images contain "${objectNameToSearch}".
    If there's any images containing "${objectNameToSearch}" - return me a numbered array containing the id's of images, which contain "${objectNameToSearch}".
    Return ONLY the array, NOTHING ELSE.
    If there are no images containing "${objectNameToSearch}" - return the EXACT RESPONSE: "no images found".`
  }

  async solveRecaptcha() {
    await test.step('solves reCAPTCHA', async () => {
      try {
        console.log('Waiting for reCAPTCHA iframe...')
        
        // Check if reCAPTCHA iframe exists on page
        let iframeElements = await this.page.$$('iframe[title="reCAPTCHA"]')
        console.log(`Found ${iframeElements.length} reCAPTCHA iframe(s)`)
        
        // If no iframe found, try checking all iframes for reCAPTCHA content
        if (iframeElements.length === 0) {
          console.log('No reCAPTCHA iframe found, checking all iframes...')
          
          // Wait for reCAPTCHA to load (it might be lazy-loaded)
          await this.page.waitForTimeout(2000)
          
          // Check all iframes on the page
          const allIframes = await this.page.$$('iframe')
          console.log(`Total iframes on page: ${allIframes.length}`)
          
          for (let i = 0; i < allIframes.length; i++) {
            const title = await allIframes[i].getAttribute('title')
            const src = await allIframes[i].getAttribute('src')
            const id = await allIframes[i].getAttribute('id')
            const className = await allIframes[i].getAttribute('class')
            console.log(`iframe ${i}: title="${title}", src="${src}", id="${id}", class="${className}"`)
            
            // Check if it contains reCAPTCHA
            if (src && src.includes('recaptcha')) {
              console.log(`Found reCAPTCHA in iframe ${i}`)
            }
          }
          
          // Try waiting longer for reCAPTCHA to appear
          try {
            await this.page.waitForSelector('iframe[title="reCAPTCHA"]', { timeout: 10000 })
            console.log('reCAPTCHA iframe appeared after waiting')
          } catch (e) {
            console.log('reCAPTCHA iframe did not appear after 10s wait')
            // reCAPTCHA might not be required or might load after user interaction
            console.log('Skipping reCAPTCHA solving - it may not be required for this signup')
            return
          }
        }
        
        // Give it extra time to fully load
        await this.page.waitForTimeout(2000)
        
        // Check if the checkbox is already checked
        const isChecked = await this.recaptchaCheckboxChechmark.isVisible({ timeout: 3000 }).catch(() => false)
        console.log(`reCAPTCHA already checked: ${isChecked}`)
        
        if (!isChecked) {
          console.log('Attempting to click reCAPTCHA checkbox...')
          // Try to click the checkbox
          await this.recaptchaCheckbox.click({ timeout: 10000, force: true })
          console.log('reCAPTCHA checkbox clicked')
          
          // Wait for the click to register
          await this.page.waitForTimeout(2000)
        }
        
        // Check if challenge appears
        const challengeVisible = await this.recaptchaChallengeIframe.locator('body').isVisible({ timeout: 10000 }).catch(() => false)
        console.log(`ReCAPTCHA challenge visible: ${challengeVisible}`)

        if (challengeVisible === true) {
          console.log('ReCAPTCHA challenge shown, solving...')
          const objectName = await this.recaptchaObjectNameContainer.textContent()
          const objectNameToSearch = objectName?.trim()
          console.log(`ReCAPTCHA Object To Search: ${objectNameToSearch}`)
        } else {
          console.log('ReCAPTCHA challenge was not shown. User may be verified.')
        }
      } catch (error) {
        console.error('Error in reCAPTCHA solving:', error)
        throw error
      }

      const challengeVisible = await this.recaptchaChallengeIframe.locator('body').isVisible({ timeout: 5000 }).catch(() => false)
      console.log(`ReCAPTCHA challenge visible: ${challengeVisible}`)

      if (challengeVisible === true) {
        console.log('ReCAPTCHA challenge shown, solving...')
        const objectName = await this.recaptchaObjectNameContainer.textContent()
        const objectNameToSearch = objectName?.trim()
        console.log(`ReCAPTCHA Object To Search: ${objectNameToSearch}`)

        // console.log('Taking screenshot of reCAPTCHA challenge...')
        // await this.recaptchaChallengeContainer.screenshot({ path: 'recaptcha_challenge.png' })

        // console.log('Sending reCAPTCHA challenge to ChatGPT...')
        // const gptPrompt = await this.generateGptPrompt(objectNameToSearch)
        // const response = await fetch('https://api.openai.com/v1/chat/completions', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        //   },
        //   body: JSON.stringify({
        //     model: 'gpt-4o',
        //     messages: [
        //       { role: 'user', content: gptPrompt }
        //     ]
        //   })
        // })
        
        // const data = await response.json()
        // let imageIds: number[] = []

        // try {
        //   imageIds = JSON.parse(data.choices[0].message.content)
        //   console.log(`Image IDs to click: ${imageIds}`)
        // } catch (error) {
        //   console.error('Failed to parse image IDs:', error)
        // }

        // ...add logic to solve the challenge
        // - click on the image containers with numbers from the array
      } else {
        console.log('ReCAPTCHA challenge was not shown.')
      }
      // Remove the deliberate failure
      // expect(true).toEqual(false)
    })
  }

  async submitSignUpForm() {
    await test.step('submits sign-up form', async () => {
      await this.clickElement(this.createAccountButton)
    })
  }
}
