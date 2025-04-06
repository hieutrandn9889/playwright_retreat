import { Page, expect, request } from "@playwright/test"
import { RequestLogger } from "./RequestLogger"
import { color } from "../utils/common"


export class SalesforceESGApi extends RequestLogger {

  expectedStatus: number
  page: Page
  globalTimeout: number
  esgSfOauthUrl: string
  esgSfClientId: string
  esgSfClientSecret: string
  esgSfRefreshToken: string
  esgSfApiUrl: string

  constructor(expectedStatus: number = 200) {
    super()
    this.expectedStatus = expectedStatus
    this.globalTimeout = 5000
    this.esgSfOauthUrl = process.env.ESG_SF_OAUTH_URL!
    this.esgSfClientId = process.env.ESG_SF_CLIENT_ID!
    this.esgSfClientSecret = process.env.ESG_SF_CLIENT_SECRET!
    this.esgSfRefreshToken = process.env.ESG_SF_REFRESH_TOKEN!
    this.esgSfApiUrl = process.env.ESG_SF_API_URL!
  }

  async getAuthToken() {
    try{
      const context = await request.newContext()
      const url = `${this.esgSfOauthUrl}?grant_type=refresh_token&client_id=${this.esgSfClientId}&client_secret=${this.esgSfClientSecret}&refresh_token=${this.esgSfRefreshToken}`
  
      const response = await context.post(url)
  
      let resp = await response.json()
  
      if(response.status() !== 200) {
        await this.logRequest('POST', url)
        await this.logResponse(response.status(), resp)
      }
  
      expect(response.status()).toEqual(200)
      
      return resp.access_token
    } catch (err) {
      console.error(err)
      let error = err.toString()
      throw new Error(error)
    }
  }

  async getContactIdByEmail(email: string, totalSize: number = 1): Promise<string> {
    const sfToken = await this.getAuthToken()
    let contactId = ''
  
    while (true) {
      try {
        console.log(color.info(`Searching for Contact with email: ${email}...`))
  
        await new Promise(resolve => setTimeout(resolve, this.globalTimeout))
  
        const context = await request.newContext()
        const url = `${this.esgSfApiUrl}/services/data/v59.0/query/?q=SELECT+Id+FROM+Contact+WHERE+Email='${email}'`
  
        const response = await context.get(url, {
          headers: {
            Authorization: `Bearer ${sfToken}`
          }
        })
  
        if (response.status() !== this.expectedStatus) {
          await this.logRequest('GET', url)
          await this.logResponse(response.status(), await response.text())
          console.log(color.error(`Unexpected response code: ${response.status()}, retrying...`))
          continue
        }
  
        const resp = await response.json()
  
        if (resp.totalSize === 0) {
          console.log(color.warning(`No Contact found, retrying...`))
          continue
        }
  
        if (resp.totalSize === totalSize) {
          contactId = resp.records[0]?.Id || ''
  
          if (!contactId) {
            console.log(color.warning(`Contact ID is empty, retrying...`))
            continue
          }

          console.log(`Salesforce response: ${JSON.stringify(resp, null, 2)}`)
          console.log(color.info(`SalesForce Contact ID: ${contactId}`))
          break
        } else {
          console.log(color.warning(`Total records found (${resp.totalSize}) does not match expected (${totalSize}), retrying...`))
          continue
        }
  
      } catch (err) {
        console.error(color.error(`Error while searching Contact: ${err}`))
        throw new Error(err.toString())
      }
    }
  
    return contactId
  }

  async getSignUpIdByContactId(contactId: string, totalSize: number = 1, arrayElement: number = 0): Promise<string> {
    const sfToken = await this.getAuthToken()
    let signUpId = ''
  
    while (true) {
      try {
        console.log(color.info(`Searching for SignUp with Contact ID: ${contactId}...`))
  
        await new Promise(resolve => setTimeout(resolve, this.globalTimeout))
  
        const context = await request.newContext()
        const url = `${this.esgSfApiUrl}/services/data/v59.0/query/?q=SELECT+Id+FROM+Opportunity+WHERE+Contact__c='${contactId}'`
  
        const response = await context.get(url, {
          headers: {
            Authorization: `Bearer ${sfToken}`
          }
        })
  
        if (response.status() !== this.expectedStatus) {
          await this.logRequest('GET', url)
          await this.logResponse(response.status(), await response.text())
          console.log(color.error(`Unexpected response code: ${response.status()}, retrying...`))
          continue
        }
  
        const resp = await response.json()
  
        if (resp.totalSize === 0) {
          console.log(color.warning(`No SignUp found, retrying...`))
          continue
        }
  
        if (resp.totalSize === totalSize) {
          signUpId = resp.records[arrayElement]?.Id || ''
  
          if (!signUpId) {
            console.log(color.warning(`SignUp ID is empty, retrying...`))
            continue
          }
  
          console.log(`Salesforce response: ${JSON.stringify(resp, null, 2)}`)
          console.log(color.info(`SalesForce SignUp ID: ${signUpId}`))
          break
        } else {
          console.log(color.warning(`Total records found (${resp.totalSize}) does not match expected (${totalSize}), retrying...`))
          continue
        }
  
      } catch (err) {
        console.error(color.error(`Error while searching SignUp: ${err}`))
        throw new Error(err.toString())
      }
    }
  
    return signUpId
  }

  async getSignUpIdByUtilityId(signUpId: string, totalSize: number = 1, arrayElement: number = 0): Promise<string> {
    const sfToken = await this.getAuthToken()
    let utilityId = ''
  
    while (true) {
      try {
        console.log(color.info(`Searching for Utility with SignUp ID: ${signUpId}...`))
  
        await new Promise(resolve => setTimeout(resolve, this.globalTimeout))
  
        const context = await request.newContext()
        const url = `${this.esgSfApiUrl}/services/data/v59.0/query/?q=SELECT+Utility__c+FROM+Opportunity+WHERE+Id='${signUpId}'`
  
        const response = await context.get(url, {
          headers: {
            Authorization: `Bearer ${sfToken}`
          }
        })
  
        if (response.status() !== this.expectedStatus) {
          await this.logRequest('GET', url)
          await this.logResponse(response.status(), await response.text())
          console.log(color.error(`Unexpected response code: ${response.status()}, retrying...`))
          continue
        }
  
        const resp = await response.json()
  
        if (resp.totalSize === 0) {
          console.log(color.warning(`No Utility found, retrying...`))
          continue
        }
  
        if (resp.totalSize === totalSize) {
          utilityId = resp.records[arrayElement]?.Utility__c || ''
  
          if (!utilityId) {
            console.log(color.warning(`Utility ID is empty, retrying...`))
            continue
          }
  
          console.log(`Salesforce response: ${JSON.stringify(resp, null, 2)}`)
          console.log(color.info(`SalesForce Utility ID: ${utilityId}`))
          break
        } else {
          console.log(color.warning(`Total records found (${resp.totalSize}) does not match expected (${totalSize}), retrying...`))
          continue
        }
  
      } catch (err) {
        console.error(color.error(`Error while searching SignUp: ${err}`))
        throw new Error(err.toString())
      }
    }
  
    return utilityId
  }

  async getSignUpTransactionId(signUpId: string, totalSize: number = 1): Promise<string> {
    const sfToken = await this.getAuthToken()
    let transactionId = ''

    while (true) {
      try {
        console.log(color.info(`Searching for Transactions related to SignUp ID: ${signUpId}...`))

        await new Promise(resolve => setTimeout(resolve, this.globalTimeout))

        const context = await request.newContext()
        const url = `${this.esgSfApiUrl}/services/data/v59.0/query/?q=SELECT+Id,+(SELECT+Id+FROM+Transactions__r)+FROM+Opportunity+WHERE+Id='${signUpId}'`

        const response = await context.get(url, {
          headers: {
            Authorization: `Bearer ${sfToken}`
          }
        })

        if (response.status() !== this.expectedStatus) {
          await this.logRequest('GET', url)
          await this.logResponse(response.status(), await response.text())
          console.log(color.error(`Unexpected response code: ${response.status()}, retrying...`))
          continue
        }

        const resp = await response.json()

        if (resp.totalSize === 0) {
          console.log(color.warning(`No SignUp ID found, retrying...`))
          continue
        }

        const transactionRecords = resp.records[0]?.Transactions__r?.records

        if (!transactionRecords || transactionRecords.length === 0) {
          console.log(color.warning(`No Transactions found for SignUp ID ${signUpId}, retrying...`))
          continue
        }

        if (resp.totalSize === totalSize) {
          transactionId = transactionRecords[0]?.Id || ''

          if (!transactionId) {
            console.log(color.warning(`Transaction ID is empty, retrying...`))
            continue
          }

          console.log(`Salesforce response: ${JSON.stringify(resp, null, 2)}`)
          console.log(color.info(`SalesForce Transaction ID: ${transactionId}`))
          break
        } else {
          console.log(color.warning(`Total records found (${resp.totalSize}) does not match expected (${totalSize}), retrying...`))
          continue
        }

      } catch (err) {
        console.error(color.error(`Error while searching for Transactions: ${err}`))
        throw new Error(err.toString())
      }
    }

    return transactionId
  }
  
  async getObjectData(objectType: string, objectId: string) {
    const sfToken = await this.getAuthToken()
    let resp

    while(true) {
      try{
        await new Promise((resolve) => {
          setTimeout(resolve, this.globalTimeout)
        })

        const context = await request.newContext()
        const url = `${this.esgSfApiUrl}/services/data/v61.0/sobjects/${objectType}/${objectId}`
        
        const response = await context.get(url, {
          headers: {
            Authorization: `Bearer ${sfToken}`
          }
        })
    
        if (response.status() === this.expectedStatus) {
          resp = await response.json()
          if (!resp.hasOwnProperty("attributes")) {
            console.log(color.error(`Response does not have "attributes" property, retrying...`))
            continue
          }
          break
        } else {
          await this.logRequest('GET', url)
          await this.logResponse(response.status(), await response.text())
          console.log(color.error(`Response code is not ${this.expectedStatus}. Got ${response.status()}, retrying...`))
          continue
        }
      
      } catch (err) {
        console.error(err)
        let error = err.toString()
        throw new Error(error)
      }
    }

    return resp
  }

  async getObjectDataParsed(objectType: string, objectId: string) {
    const sfToken = await this.getAuthToken()
    let resp
  
    while (true) {
      try {
        await new Promise((resolve) => {
          setTimeout(resolve, this.globalTimeout)
        })
  
        const context = await request.newContext()
        const url = `${this.esgSfApiUrl}/services/data/v61.0/sobjects/${objectType}/${objectId}`
  
        const response = await context.get(url, {
          headers: {
            Authorization: `Bearer ${sfToken}`
          }
        })
  
        if (response.status() === this.expectedStatus) {
          resp = await response.json()
          if (!resp.hasOwnProperty("attributes")) {
            console.log(color.error(`Response does not have "attributes" property, retrying...`))
            continue
          }
  
          // ✅ Parse Payload__c if it exists
          if (resp?.Payload__c && typeof resp.Payload__c === 'string') {
            try {
              resp.Payload__c = JSON.parse(resp.Payload__c)
              console.log('✅ Parsed Payload__c successfully.')
            } catch (err) {
              console.error('❌ Failed to parse Payload__c JSON:', err)
              console.log('🔹 Raw Payload__c:', resp.Payload__c)
            }
          }
  
          break
        } else {
          await this.logRequest('GET', url)
          await this.logResponse(response.status(), await response.text())
          console.log(color.error(`Response code is not ${this.expectedStatus}. Got ${response.status()}, retrying...`))
          continue
        }
  
      } catch (err) {
        console.error(err)
        let error = err.toString()
        throw new Error(error)
      }
    }
  
    return resp
  }  

  async updateObjectData(objectType: string, objectId: string, payload: Record<string, any>) {
    const sfToken = await this.getAuthToken()

    while (true) {
      try {
        await new Promise((resolve) => setTimeout(resolve, this.globalTimeout))

        const context = await request.newContext()
        const url = `${this.esgSfApiUrl}/services/data/v61.0/sobjects/${objectType}/${objectId}`

        const response = await context.patch(url, {
          headers: {
            Authorization: `Bearer ${sfToken}`,
            'Content-Type': 'application/json'
          },
          data: payload
        })

        if (response.status() === 204) {
          console.log(color.success(`Object ${objectType} with ID ${objectId} updated successfully.`))
          break
        } else {
          await this.logRequest('PATCH', url, payload)
          await this.logResponse(response.status(), await response.text())
          console.log(color.error(`Response code is not 204. Got ${response.status()}, retrying...`))
          continue
        }
      
      } catch (err) {
        console.error(err)
        throw new Error(err.toString())
      }
    }
  }

  async assertValues(
    objectType: string,
    objectId: string,
    propertiesToAssert: { [path: string]: any }
  ): Promise<void> {
    const remainingProperties = { ...propertiesToAssert }
    let failedPropertyPath: string | null = null
  
    const getValueByPath = (obj: any, path: string): any => {
      return path.split('.').reduce((acc, part) => {
        // Handle array indices
        const match = part.match(/(\w+)\[(\d+)\]/)
        if (match) {
          const [, key, index] = match
          return acc && acc[key] ? acc[key][index] : undefined
        }
        return acc ? acc[part] : undefined
      }, obj)
    }
  
    const isRegexString = (value: string): boolean => {
      try {
        new RegExp(value)
        return true
      } catch (e) {
        return false
      }
    }
  
    while (Object.keys(remainingProperties).length > 0) {
      const response = await this.getObjectData(objectType, objectId)
  
      for (const path in remainingProperties) {
        if (failedPropertyPath !== null && path !== failedPropertyPath) {
          // Skip properties that have already been successfully asserted
          continue
        }
  
        const expectedValue = remainingProperties[path]
        const foundElement = getValueByPath(response, path)
  
        try {
          if (foundElement !== undefined) {
            let isMatch = false
  
            if (typeof expectedValue === 'boolean' && foundElement === expectedValue) {
              isMatch = true
            } else if (typeof expectedValue === 'string' && !isRegexString(expectedValue) && foundElement.includes(expectedValue)) {
              isMatch = true
            } else if (typeof expectedValue === 'number' && foundElement === expectedValue) {
              isMatch = true
            } else if (typeof expectedValue === 'string' && isRegexString(expectedValue)) {
              const regexPattern = new RegExp(expectedValue)
              if (regexPattern.test(foundElement)) {
                isMatch = true
              }
            }
  
            if (isMatch) {
              console.log(`Found Salesforce property '${path}' with value of ${foundElement}`)
              // Remove successful property
              delete remainingProperties[path]
              failedPropertyPath = null
            } else {
              throw new Error(`Found Salesforce property '${path}' but value '${foundElement}' does not match the expected value '${expectedValue}', retrying...`)
            }
          } else {
            throw new Error(`Salesforce property '${path}' not found, retrying...`)
          }
        } catch (error) {
          console.error((error as Error).message)
          failedPropertyPath = path
          break
        }
      }
    }
  }

  async publishToInboundEsgUpdates(payload: any): Promise<string> {
    const sfToken = await this.getAuthToken()
    const url = `${this.esgSfApiUrl}/services/data/v62.0/sobjects/Inbound_ESG_Updates_Event__e/`
  
    console.log(color.info(`🚀 Publishing data to Inbound_ESG_Updates_Event__e...`))
  
    try {
      const context = await request.newContext()
  
      // Extract Type__c and SubType__c from payload
      const { Type__c, SubType__c, Payload__c } = payload
  
      if (!Type__c || !SubType__c || !Payload__c) {
        throw new Error("❌ Missing required fields: Type__c, SubType__c, or Payload__c in payload")
      }
  
      // Construct final request body
      const requestBody = {
        Type__c,
        SubType__c,
        Payload__c: JSON.stringify(Payload__c)
      }
  
      const response = await context.post(url, {
        headers: {
          Authorization: `Bearer ${sfToken}`,
          'Content-Type': 'application/json',
          'X-PrettyPrint': '1'
        },
        data: requestBody
      })
  
      const responseData = await response.json()
      const status = response.status()
  
      console.log(color.info(`📨 Sent request to Salesforce! Status: ${status}`))
  
      if (status === 201 && responseData.success === true) {
        console.log(color.success(`✅ Successfully published! 🎉 Salesforce ID: ${responseData.id}`))
        console.log(color.info(`📡 Response: ${JSON.stringify(responseData, null, 2)}`))
        return responseData.id
      } else {
        console.log(color.error(`⚠️ Unexpected response status: ${status}`))
        console.log(color.error(`🚨 Response Details: ${JSON.stringify(responseData, null, 2)}`))
        throw new Error(`Salesforce API returned unexpected status: ${status}`)
      }
    } catch (err) {
      console.error(color.error(`💥 Error while publishing to Salesforce: ${err}`))
      throw new Error(err.toString())
    }
  }

  async enrollSignUps(signupIds: string[]) {
    const sfToken = await this.getAuthToken()
    const url = `${this.esgSfApiUrl}/services/apexrest/router/v1/EnrollSignups`
  
    const context = await request.newContext()
    const response = await context.post(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sfToken}`
      },
      data: {
        signups: signupIds
      }
    })
  
    const respBody = await response.text()
  
    if (response.status() !== 200) {
      await this.logRequest('POST', url, { signups: signupIds })
      await this.logResponse(response.status(), respBody)
      throw new Error(`Expected status 200, got ${response.status()}`)
    }
  
    const resp = JSON.parse(respBody)
  
    for (const id of signupIds) {
      if (!resp.successfulSignups?.includes(id)) {
        console.error(`Response body:`, JSON.stringify(resp, null, 2))
        throw new Error(`Missing signup ID "${id}" in response.successfulSignups`)
      }
    }
  
    return resp
  }

  async enrollSignUpsMissingFields(signupIds: string[], expectedMissingFields: string[]) {
    const sfToken = await this.getAuthToken()
    const url = `${this.esgSfApiUrl}/services/apexrest/router/v1/EnrollSignups`
  
    const context = await request.newContext()
    const response = await context.post(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sfToken}`
      },
      data: {
        signups: signupIds
      }
    })
  
    const respBody = await response.text()
  
    if (response.status() !== 200) {
      await this.logRequest('POST', url, { signups: signupIds })
      await this.logResponse(response.status(), respBody)
      console.error("❌ Error: Expected status 200, got", response.status())
      throw new Error(`Expected status 200, got ${response.status()}`)
    }
  
    const resp = JSON.parse(respBody)
  
    // Assert that signup ID is present in emptyRequiredFields
    for (const id of signupIds) {
      if (!resp.emptyRequiredFields?.hasOwnProperty(id)) {
        console.error("❌ Error: Missing signup ID in response.emptyRequiredFields", id)
        console.error(`Response body:`, JSON.stringify(resp, null, 2))
        throw new Error(`Missing signup ID "${id}" in response.emptyRequiredFields`)
      }
  
      // Assert that the field names for this ID are correctly returned
      const missingFields = resp.emptyRequiredFields[id]
      
      if (!missingFields || missingFields.length === 0) {
        console.error("❌ Error: No missing fields for signup ID", id)
        console.error(`Response body:`, JSON.stringify(resp, null, 2))
        throw new Error(`No missing fields for signup ID "${id}"`)
      }
      
      // If missing fields are a comma-separated string, convert them to an array
      const missingFieldsArray = typeof missingFields === 'string' ? missingFields.split(',').map(field => field.trim()) : missingFields;
  
      // Test that the missing fields are in the response
      expectedMissingFields.forEach(expectedField => {
        if (!missingFieldsArray.includes(expectedField)) {
          console.error("❌ Error: Missing expected field", expectedField, "for signup ID", id)
          console.error(`Expected fields: ${JSON.stringify(expectedMissingFields)}`)
          console.error(`Actual fields: ${JSON.stringify(missingFieldsArray)}`)
          throw new Error(`Expected missing field "${expectedField}" for signup ID "${id}", but it was not found in the response`)
        }
      })
  
      // Successful assertion
      console.log("✅ Success: Signup ID", id, "is missing fields:", missingFieldsArray)
    }
  
    return resp
  }
  
  async waitForStrictLogAssertions(
    objectType: string,
    objectId: string,
    expectedValues: Record<string, any>
  ): Promise<void> {
    let remainingAssertions = { ...expectedValues }

    while (Object.keys(remainingAssertions).length > 0) {
      console.log('🔄 Fetching Salesforce...')

      const logs = await this.getObjectData(objectType, objectId)
      if (!logs || logs.length === 0) {
        console.log('⚠️ No data found, retrying in 5 seconds...')
        await this.delay(5000)
        continue
      }

      let payload
      try {
        payload = typeof logs === 'string' ? JSON.parse(logs) : logs

        console.log('✅ Parsed data payload successfully.')

        // If Payload__c exists, parse it and merge into the main JSON
        if (payload?.Payload__c) {
          try {
            payload.Payload__c = JSON.parse(payload.Payload__c)
            console.log('✅ Parsed Payload__c successfully.')
          } catch (err) {
            console.error('❌ Failed to parse Payload__c JSON:', err)
            console.log('🔹 Raw Payload__c:', payload.Payload__c)
            await this.delay(5000)
            continue
          }
        }

      } catch (error) {
        console.error('❌ Failed to parse payload JSON:', error)
        console.log('🔹 Raw payload data:', logs)
        await this.delay(5000)
        continue
      }

      // Track successfully validated fields
      const successfullyValidated = new Set<string>()

      for (const [jsonPath, expectedValue] of Object.entries(remainingAssertions)) {
        const actualValue = this.getValueFromJsonPath(payload, jsonPath)

        console.log(`🔎 Asserting: ${jsonPath} | Expected: ${expectedValue} | Actual: ${actualValue}`)

        if (actualValue === expectedValue) {
          console.log(`✅ Assertion passed for ${jsonPath}`)
          successfullyValidated.add(jsonPath)
        } else {
          console.log(`❌ Assertion failed for ${jsonPath}. Retrying...`)
        }
      }

      // Remove successfully asserted fields from next iteration
      successfullyValidated.forEach(path => delete remainingAssertions[path])

      if (Object.keys(remainingAssertions).length > 0) {
        console.log(`⏳ Remaining assertions: ${Object.keys(remainingAssertions).length}. Retrying in 5 seconds...`)
        await this.delay(5000)
      }
    }

    console.log('🎉 All strict assertions passed successfully!')
  }

  async waitForStrictLogRegexAssertions(
    objectType: string,
    objectId: string,
    expectedRegexes: Record<string, RegExp>
  ): Promise<void> {
    let remainingAssertions = { ...expectedRegexes }

    while (Object.keys(remainingAssertions).length > 0) {
      console.log('🔄 Fetching Salesforce...')

      const logs = await this.getObjectData(objectType, objectId)
      if (!logs || logs.length === 0) {
        console.log('⚠️ No data found, retrying in 5 seconds...')
        await this.delay(5000)
        continue
      }

      let payload
      try {
        payload = typeof logs === 'string' ? JSON.parse(logs) : logs
        console.log('✅ Parsed data payload successfully.')

        // Parse Payload__c if it exists
        if (payload?.Payload__c) {
          try {
            payload.Payload__c = JSON.parse(payload.Payload__c)
            console.log('✅ Parsed Payload__c successfully.')
          } catch (err) {
            console.error('❌ Failed to parse Payload__c JSON:', err)
            console.log('🔹 Raw Payload__c:', payload.Payload__c)
            await this.delay(5000)
            continue
          }
        }
      } catch (error) {
        console.error('❌ Failed to parse payload JSON:', error)
        console.log('🔹 Raw payload data:', logs)
        await this.delay(5000)
        continue
      }

      // Track successfully validated fields
      const successfullyValidated = new Set<string>()

      for (const [jsonPath, expectedRegex] of Object.entries(remainingAssertions)) {
        const actualValue = this.getValueFromJsonPath(payload, jsonPath)

        console.log(`🔎 Asserting: ${jsonPath} | Expected Regex: ${expectedRegex} | Actual: ${actualValue}`)

        if (typeof actualValue === 'string' && expectedRegex.test(actualValue)) {
          console.log(`✅ Assertion passed for ${jsonPath}`)
          successfullyValidated.add(jsonPath)
        } else {
          console.log(`❌ Assertion failed for ${jsonPath}. Retrying...`)
        }
      }

      // Remove successfully asserted fields from next iteration
      successfullyValidated.forEach(path => delete remainingAssertions[path])

      if (Object.keys(remainingAssertions).length > 0) {
        console.log(`⏳ Remaining assertions: ${Object.keys(remainingAssertions).length}. Retrying in 5 seconds...`)
        await this.delay(5000)
      }
    }

    console.log('🎉 All strict regex assertions passed successfully!')
  }

  async waitForNonEmptyLogAssertions(
    objectType: string,
    objectId: string,
    expectedPaths: string[]
  ): Promise<void> {
    let remainingAssertions = new Set(expectedPaths)

    while (remainingAssertions.size > 0) {
      console.log('🔄 Fetching Salesforce...')

      const logs = await this.getObjectData(objectType, objectId)
      if (!logs || logs.length === 0) {
        console.log('⚠️ No data found, retrying in 5 seconds...')
        await this.delay(5000)
        continue
      }

      let payload
      try {
        payload = typeof logs === 'string' ? JSON.parse(logs) : logs
        console.log('✅ Parsed log payload successfully.')

        // Parse Payload__c if it exists
        if (payload?.Payload__c) {
          try {
            payload.Payload__c = JSON.parse(payload.Payload__c)
            console.log('✅ Parsed Payload__c successfully.')
          } catch (err) {
            console.error('❌ Failed to parse Payload__c JSON:', err)
            console.log('🔹 Raw Payload__c:', payload.Payload__c)
            await this.delay(5000)
            continue
          }
        }
      } catch (error) {
        console.error('❌ Failed to parse payload JSON:', error)
        console.log('🔹 Raw payload data:', logs)
        await this.delay(5000)
        continue
      }

      // Track successfully validated fields
      const successfullyValidated = new Set<string>()

      for (const jsonPath of remainingAssertions) {
        const actualValue = this.getValueFromJsonPath(payload, jsonPath)

        // Check if the value is valid (not null, undefined, or empty)
        const isValid = !(
          actualValue === undefined ||
          actualValue === null ||
          (typeof actualValue === "string" && actualValue.trim() === "") || // Empty string
          (Array.isArray(actualValue) && actualValue.length === 0) || // Empty array
          (typeof actualValue === "object" && Object.keys(actualValue).length === 0) // Empty object
        )

        console.log(`🔎 Checking: ${jsonPath} | Actual: ${JSON.stringify(actualValue)} | Valid: ${isValid}`)

        if (isValid) {
          console.log(`✅ Assertion passed for ${jsonPath} (Non-empty value)`)
          successfullyValidated.add(jsonPath)
        } else {
          console.log(`❌ Assertion failed for ${jsonPath}. Value is empty, null, or undefined. Retrying...`)
        }
      }

      // Remove successfully asserted fields from next iteration
      successfullyValidated.forEach(path => remainingAssertions.delete(path))

      if (remainingAssertions.size > 0) {
        console.log(`⏳ Remaining assertions: ${remainingAssertions.size}. Retrying in 5 seconds...`)
        await this.delay(5000)
      }
    }

    console.log('🎉 All non-empty assertions passed successfully!')
  }

  async waitForNullValueAssertions(
    objectType: string,
    objectId: string,
    targetPaths: string[]
  ): Promise<void> {
    let remainingAssertions = new Set(targetPaths)

    while (remainingAssertions.size > 0) {
      console.log('🔄 Fetching Salesforce...')

      const logs = await this.getObjectData(objectType, objectId)
      if (!logs || logs.length === 0) {
        console.log('⚠️ No data found, retrying in 5 seconds...')
        await this.delay(5000)
        continue
      }

      let payload
      try {
        payload = typeof logs === 'string' ? JSON.parse(logs) : logs
        console.log('✅ Parsed log payload successfully.')

        // Parse Payload__c if it exists
        if (payload?.Payload__c) {
          try {
            payload.Payload__c = JSON.parse(payload.Payload__c)
            console.log('✅ Parsed Payload__c successfully.')
          } catch (err) {
            console.error('❌ Failed to parse Payload__c JSON:', err)
            console.log('🔹 Raw Payload__c:', payload.Payload__c)
            await this.delay(5000)
            continue
          }
        }
      } catch (error) {
        console.error('❌ Failed to parse payload JSON:', error)
        console.log('🔹 Raw payload data:', logs)
        await this.delay(5000)
        continue
      }

      // Track successfully validated fields
      const successfullyValidated = new Set<string>()

      for (const jsonPath of remainingAssertions) {
        const actualValue = this.getValueFromJsonPath(payload, jsonPath)

        // Check if the value is explicitly null
        const isNull = actualValue === null

        console.log(`🔎 Checking: ${jsonPath} | Actual: ${JSON.stringify(actualValue)} | Is Null: ${isNull}`)

        if (isNull) {
          console.log(`✅ Assertion passed for ${jsonPath} (Value is NULL)`)
          successfullyValidated.add(jsonPath)
        } else {
          console.log(`❌ Assertion failed for ${jsonPath}. Value is not NULL. Retrying...`)
        }
      }

      // Remove successfully asserted fields from next iteration
      successfullyValidated.forEach(path => remainingAssertions.delete(path))

      if (remainingAssertions.size > 0) {
        console.log(`⏳ Remaining assertions: ${remainingAssertions.size}. Retrying in 5 seconds...`)
        await this.delay(5000)
      }
    }

    console.log('🎉 All NULL value assertions passed successfully!')
  }

  private getValueFromJsonPath(payload: any, path: string): any {
    const keys = path.replace(/^\./, '').split('.')
    return keys.reduce((obj, key) => (obj && key in obj ? obj[key] : undefined), payload)
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

}