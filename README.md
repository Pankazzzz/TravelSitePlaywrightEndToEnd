# 🧪 Playwright + Cucumber Hybrid Framework

This project is a **hybrid automation framework** built using **Playwright** and **Cucumber.js**, designed to test both **UI flows** and **feature-based scenarios** for web applications such as [OrangeHRM](https://opensource-demo.orangehrmlive.com/).

---

## 📁 Project Structure

ORANGEHRM/
├── cucumber/
│ ├── features/
│ │ └── bookFlight.feature
│ ├── step_definitions/
│ │ └── flightBookingSteps.js
│ └── support/
│ └── hooks.js
├── POMClasses/
│ ├── BookingPage.js
│ ├── CheckoutPage.js
│ ├── ConfirmationPage.js
│ ├── LandingPage.js
│ └── PageObjectManager.js
├── tests/
│ ├── example.spec.js
│ ├── pomFramework.spec.js
│ ├── phpStandalone.spec.js
│ └── standalone.spec.js
├── test-results/
├── allure-results/
├── allure-report/
├── dataUtils/
│ └── jsonData.json
├── package.json
├── .gitignore
└── README.md



---

## ⚙️ Setup Instructions

### 1️⃣ Install Dependencies
```bash
npm install


npx cucumber-js ./cucumber/features/bookFlight.feature
npx playwright test tests/pomFramework.spec.js --headed
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report

🧩 Key Features
✅ Hybrid BDD + UI Testing: Combines the best of Cucumber and Playwright.
🧱 Page Object Model (POM): Clean and maintainable structure for test scripts.
⚙️ Parallel Execution: Supports multiple test runs across browsers.
🔒 Reusable Hooks & Utilities: Common preconditions and data handling.
📊 Allure Integration: Beautiful and detailed test reports with screenshots.
🌐 Cross-Browser Testing: Runs on Chromium, Firefox, and WebKit.
🚀 CI/CD Ready: Easily integratable with Jenkins, GitHub Actions, or Azure Pipelines.

👤 Author
Pankaj Shukla
📍 Framework Contributor 
