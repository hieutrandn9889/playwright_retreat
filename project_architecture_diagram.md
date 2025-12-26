# Project Architecture Diagram

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Playwright Test Framework                          │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐ ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐ │
│  │   Test Suite    │ │   Test Suite     │  │   Test Suite     │  │ Test Suite  │ │
│  │   Chat App      │ │   Blockchain     │  │   Authentication │  │   Gmail     │ │
│  │                 │ │                  │  │                  │  │             │ │
│  │ • chat.spec.ts  │ │ • blockchain.spec│  │ • otpSignIn.spec │  │ • gmail.spec│ │
│  │                 │ │ • ...            │  │ • ...            │  │ • ...       │ │
│  └─────────────────┘ │ └──────────────────┘  └──────────────────┘  └─────────────┘ │
│  ┌─────────────────┐ │ ┌──────────────────┐  ┌──────────┐  ┌─────────────┐ │
│  │   Test Suite    │ │ │   Test Suite     │  │   Test Suite     │  │ Test Suite  │ │
│  │   BookRetreats  │ │ │   SoftServe      │  │   Other Tests    │   Template  │ │
│  │                 │ │ │   (Localization) │  │                  │ │             │ │
│  │ • signUp.spec   │ │ │ • localization.  │  │ • ...            │ │ • template. │ │
│  │ • ...           │ │ │ • spec.ts        │  │                  │ │ • spec.ts   │ │
│  └─────────────────┘ │ └──────────────────┘  └──────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                           Page Manager & Page Objects                           │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────┐  ┌──────────────────┐  ┌──────────┐  ┌─────────────┐ │
│ │  PageManager    │  │   Page Objects   │  │   Page Actions   │  │   API Helpers││
│ │                 │  │                  │  │             │ │
│ │ • chatPage      │  │ • chat.page.ts   │  │ • fillElement()  │  │ • gmailApi  │ │
│ │ • otpSignInPage │  │ • otpSignIn.page │  │ • clickElement() │  │ • OTPgenera │ │
│ │ • bookretreats  │  │ • softserve.page │  │ • waitForElement │  │ • RequestLo │ │
│ │ • ...           │  │ • ...            │  │ • ...            │  │ • ...       │ │
│ └─────────────────┘  └──────────────────┘  └──────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────┐
│                            Test Utilities & APIs                                │
├─────────────────────────────────────────────────┤
│ ┌─────────────────┐  ┌──────────────────┐  ┌──────────┐  ┌─────────────┐ │
│  │   API Helpers   │  │   Utilities      │  │   Data Generators│  │   Common    │ │
│  │                 │  │                  │  │   Helpers   │ │
│  │ • gmailApi.ts   │  │ • envName.ts     │  │ • dataGenerator  │  │ • common.ts │ │
│  │ • OTPgenerator  │  │ • pageManager.ts │  │ • ...            │  │ • ...       │ │
│  │ • RequestLogger │  │ • globalSetup.ts │  │                  │  │             │ │
│  └─────────────────┘  └──────────────────┘  └──────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────┐
│                         Test Data & Configuration                               │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐ │
│  │   Test Data     │  │   Config Files   │  │   Environment    │  │   Secrets   │ │
│  │                 │  │                  │  │             │ │
│  │ • chat.data.ts  │  │ • playwright.conf│  │ • .env           │  │ • .env      │ │
│  │ • authentication│  │ • chrome.playwrg │  │ • process.env    │  │ • ...       │ │
│  │ • bookretreats  │  │ • ...            │  │ • test_env       │  │             │ │
│  │ • gmail.data.ts │  └──────────────────┘  └──────────┘  └─────────────┘ │
│  │ • softserve.data│                                                             │
│  │ • ...           │                                                             │
│  └─────────────────┘                                                             │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                          Target Applications & Services                         │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────┐  ┌─────────────┐ │
│  │   Chat App      │  │   Blockchain     │  │   Authentication │  │   Gmail     │ │
│  │   (Web App)     │  │   (Ganache/EVM)  │  │   (OTP/MFA)      │  │   (API)     │ │
│  │                 │  │                  │  │             │ │
│  │ • Channels      │  │ • Accounts       │  │ • Email login    │  │ • Send/Recv │ │
│  │ • Messages      │  │ • Transactions   │  │ • OTP verification│ │ • API calls │
│  │ • Users         │  │ • Balances       │  │ • Sessions       │  │ • ...       │ │
│  └─────────────────┘  └──────────────────┘  └──────────┘  └─────────────┘ │
│  ┌─────────────────┐  ┌──────────────────┐                                     │ │
│  │   BookRetreats  │  │   SoftServe      │                                     │ │
│  │   (Web App)     │  │   (Localization) │                                     │ │
│  │                 │  │                  │                                     │ │
│  │ • Registration  │  │ • Multi-language │                                     │ │
│  │ • Booking       │  │ • Regional tests │                                     │ │
│  │ • UI elements   │  │ • Content check  │                                     │ │
│  └─────────────────┘  └──────────────────┘                                     │ │
└─────────────────────────────────────────────────────────────────────────┘
```

## Detailed Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                           Test Execution Flow                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Test Runner (npm run chat:e2e:tests:prod)                                      │
│           │                                                                      │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                     Playwright Configuration                                │ │
│  │ • Timeout settings (1 min for prod)                                         │ │
│  │ • Browser settings                                                          │ │
│  │ • Reporter settings (HTML, line)                                            │ │
│  │ • Video/Screenshot on failure                                               │ │
│  │ • Trace logs on failure                                                     │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│           │                                                                      │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                       Global Setup                                          │ │
│  │ • Environment initialization                                                │ │
│  │ • Browser context creation                                                  │ │
│  │ • PageManager injection                                                     │ │
│  │ • Test environment preparation                                              │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│           │                                                                      │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                      Test Execution                                         │ │
│  │ • BeforeAll hooks (setup)                                                   │ │
│  │ • Individual test steps (using step() wrapper)                              │ │
│  │ • Page interactions (via PageManager)                                       │ │
│  │ • API calls (via API helpers)                                               │ │
│  │ • Assertions (using Playwright expect)                                      │ │
│  │ • AfterAll hooks (cleanup)                                                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│           │                                                                      │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                       Reporting & Artifacts                                 │ │
│  │ • HTML reports (in html_report folder)                                      │ │
│  │ • Video recordings (on failure)                                             │ │
│  │ • Screenshots (on failure)                                                  │ │
│  │ • Trace logs (on failure)                                                   │ │
│  │ • Console logs with step status                                             │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Workflow-Specific Diagrams

### 1. Chat Application Testing Workflow
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Support User  │    │   Chat Server   │    │   Client User   │
│   (Browser 1)   │    │   (WebSocket)   │    │   (Browser 2)   │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          │ Create Channel       │                      │
          │─────────────────────▶│                      │
          │                      │                      │
          │ Join Channel         │                      │
          │─────────────────────▶│                      │
          │                      │                      │
          │                      │ Join Channel         │
          │◀─────────────────────│─────────────────────▶│
          │                      │                      │
          │ Send Message         │                      │
          │─────────────────────▶│─────────────────────▶│
          │                      │                      │
          │                      │ Send Message         │
          │◀─────────────────────│─────────────────────▶│
          │                      │                      │
          │ Check Client Message │                      │
          │◀─────────────────────│                      │
          │                      │ Check Support Message│
          │                      │◀─────────────────────│
```

### 2. Blockchain Testing Workflow
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Test Script   │    │   Ganache       │    │   Web3 Client   │
│                 │    │   (Local Node)  │    │                 │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          │ Start Ganache        │                      │
          │─────────────────────▶│                      │
          │                      │                      │
          │ Connect Web3         │                      │
          │─────────────────────▶│                      │
          │                      │                      │
          │ Get Accounts         │                      │
          │─────────────────────▶│                      │
          │                      │                      │
          │ Send Transaction     │                      │
          │─────────────▶│─────────────────────▶│
          │                      │                      │
          │ Verify Balances      │                      │
          │◀─────────────────────│                      │
          │                      │                      │
          │ Stop Ganache         │                      │
          │─────────────────────▶│                      │
```

### 3. Authentication Testing Workflow (OTP/MFA)
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Test Script   │    │   OTP Generator │    │   Auth Server   │
│                 │    │   (Time-based)  │    │                 │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          │ Generate OTP         │                      │
          │─────────────────────▶│                      │
          │                      │                      │
          │ Fill Login Form      │                      │
          │─────────────────────▶│                      │
          │                      │                      │
          │ Submit Credentials   │                      │
          │─────────────────────▶│─────────────────────▶│
          │                      │                      │
          │ Verify OTP           │                      │
          │─────────────────────▶│─────────────────────▶│
          │                      │                      │
          │ Check Success        │                      │
          │◀─────────────────────│                      │
```

### 4. Gmail Testing Workflow
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Test Script   │    │   Gmail API     │    │   Gmail Server │
│                 │    │   (Google APIs) │    │                 │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          │ Send Email           │                      │
          │─────────────────────▶│─────────────────────▶│
          │                      │                      │
          │ Check Inbox          │                      │
          │─────────────────────▶│─────────────────────▶│
          │                      │                      │
          │ Verify Email Content │                      │
          │◀─────────────────────│                      │
          │                      │                      │
          │ Verify Subject & Body│                      │
          │◀─────────────────────│                      │
```

### 5. Localization Testing Workflow (SoftServe)
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Test Script   │    │   Web Browser   │    │   SoftServe App │
│                 │    │   (Multi-region)│    │                 │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          │ Open URL (Region A)  │                      │
          │─────────────────────▶│                      │
          │                      │                      │
          │ Get Service List     │                      │
          │─────────────────────▶│─────────────────────▶│
          │                      │                      │
          │ Compare Text Content │                      │
          │─────────────────────▶│                      │
          │                      │                      │
          │ Validate Language    │                      │
          │◀─────────────────────│                      │
          │                      │                      │
          │ Repeat for All Reg.  │                      │
          │─────────────────────▶│─────────────────────▶│
```

## Detailed Component Analysis

### 1. Test Suites
- **Chat App Testing**: Tests real-time chat functionality between multiple users
- **Blockchain Testing**: Tests Ethereum transactions using local Ganache blockchain
- **Authentication Testing**: Tests OTP/MFA login functionality
- **Gmail Testing**: Tests email sending and inbox verification via Gmail API
- **SoftServe Testing**: Tests localization and multi-language support
- **BookRetreats Testing**: Tests booking and registration functionality

### 2. Page Objects & Page Manager
- **PageManager**: Centralized manager that instantiates all page objects
- **Page Objects**: Encapsulate UI elements and actions for specific pages
- **PageActions**: Base class with common UI interaction methods
- **API Helpers**: Handle non-UI interactions like email APIs and OTP generation

### 3. Test Utilities
- **envName.ts**: Extends Playwright test with custom fixtures and step wrapper
- **step() function**: Provides detailed logging for each test step
- **Common helpers**: Utility functions for common operations
- **Global setup**: Environment initialization before test runs

### 4. Test Data Management
- **Data files**: Organized by test suite (chat.data.ts, authentication.data.ts, etc.)
- **Environment configuration**: Different settings for stage/prod environments
- **Sensitive data**: Managed through environment variables

### 5. Target Applications
- **Web Applications**: Chat app, BookRetreats, SoftServe with various UI features
- **Blockchain**: Local Ganache network for Ethereum transaction testing
- **Authentication Systems**: OTP/MFA enabled login systems
- **External APIs**: Gmail API for email testing
- **Multi-language Sites**: Localization testing across different regions