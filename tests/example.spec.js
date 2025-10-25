//import { test, expect } from '@playwright/test';

const {test,expect} = require('@playwright/test');
const path = require('path');

test('Test1', async ({browser}) => {

  const context = await browser.newContext();
  const page  = await context.newPage();
  await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");

});

test('Test2', async function({page}) {
  
});

test.only('StandAlone', async ({page}) => {
  await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
  await console.log(await page.title());
  await expect(page).toHaveTitle("OrangeHRM");
  await expect(page).toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")
});