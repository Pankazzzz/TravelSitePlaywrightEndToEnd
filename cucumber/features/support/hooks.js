const {After,Before,AfterStep,Status} = require('@cucumber/cucumber');
const playwright = require('@playwright/test');
const { setDefaultTimeout } = require('@cucumber/cucumber');
setDefaultTimeout(120 * 1000);


Before(async function () {
     this.browser = await playwright.chromium.launch({
      headless: false,
    });
    this.context = await this.browser.newContext({ acceptDownloads: true });
    this.page = await this.context.newPage();
    await this.page.goto("https://phptravels.net/");
});

AfterStep(async function ({result}) {
    if (result.status === Status.FAILED) {
      const buffer = await this.page.screenshot();
      await this.page.screenshot({ path: 'screenshot1.png' });
      this.attach(buffer.toString('base64'), 'base64:image/png');
      console.log("Screenshot logged")
    }
});

After(async function () {
    console.log("i am last");  
    await this.page.close();
    await this.context.close();
    await this.browser.close();
});

  
  // Before({tags:"@Regression"},async function () {
  //   // This hook will be executed before all scenarios
  //   console.log("i am first");
  //   const browser = await playwright.chromium.launch({
  //     headless: false,
  // });
  // const context = await browser.newContext();
  //   this.page =  await context.newPage();
  // });
