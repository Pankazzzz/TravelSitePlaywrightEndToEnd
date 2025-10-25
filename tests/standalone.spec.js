const {test,expect} = require('@playwright/test');
const { faker } = require('@faker-js/faker');


test('StandAlone Test', async ({browser}) => {

   const context = await browser.newContext();
   const page = await context.newPage();
   await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
   await expect(page).toHaveTitle("OrangeHRM");
   
   await page.locator("[name='username']").fill("Admin");
   await page.locator("[name='password']").fill("admin123");
   await page.getByRole("button",{name:"Login"}).click();
    await page.waitForLoadState('networkidle');


   const leftNavigation = page.locator("[class='oxd-navbar-nav']");
   await expect(leftNavigation).toBeVisible();
    await page.getByText('Admin', { exact: true }).click();
   await expect(page.locator('div .oxd-input--active').last()).toBeVisible();
   await expect(page.locator("//label[text()='User Role']/parent::div/following-sibling::div[1]/div")).toBeVisible();
   await expect(page.getByPlaceholder('Type for hints...')).toBeVisible();
   await expect(page.locator("//label[text()='Status']/parent::div/following-sibling::div[1]/div")).toBeVisible();
   await expect(page.locator("button:has-text('Add')")).toBeVisible();


const name = faker.person.fullName();
const userName = getRandomUsername();

   await page.locator("button:has-text('Add')").click(); 
   await page.locator('.oxd-input-group').filter({hasText:'User Role'}).locator('.oxd-select-text--after').click();
       //await page.waitForTimeout(200000); // 10s pause 
   await page.getByText('ESS', { exact: true }).click();
    await page.locator("//label[text()='Employee Name']/parent::div/following-sibling::div/descendant::input").pressSequentially("a");
    await page.locator("span[data-v-08362132]").first().waitFor({ state: 'visible', timeout: 10000 });
    const Fname = await page.locator("span[data-v-08362132]").first().textContent();
    console.log(Fname);
    await page.locator("span[data-v-08362132]").first().click();
    // await page.locator("span:has-text('Ram Ramnanda B')").click();
    await page.locator("//label[text()='Username']/parent::div/following-sibling::div/descendant::input").fill(userName);
   await page.locator('.oxd-input-group').filter({hasText:'Status'}).locator('.oxd-select-text--after').click();
    await page.getByText('Enabled', { exact: true }).click();
    await page.locator("input[type='password']").first().fill("Password123!");
        await page.locator("input[type='password']").last().fill("Password123!");
await page.getByRole('button', { name: /^Save$/ }).click();

    const successMessage = await page.locator(".oxd-text--toast-message").textContent();
    await expect(successMessage.trim()).toBe("Successfully Saved");

    const popup = await page.locator('.oxd-loading-spinner');
    // Wait until the popup becomes invisible
    await popup.waitFor({ state: 'hidden' });

await page.locator("//label[text()='Username']/parent::div/following-sibling::div/descendant::input").fill(userName);
await page.getByRole('button', { name: /^Search$/ }).click();

// Wait for table to refresh — old rows to disappear and new ones to appear
const firstCell = page.locator('[class="oxd-table-cell oxd-padding-cell"] div[data-v-6c07a142]').first();
await firstCell.waitFor({ state: 'visible', timeout: 10000 });

// Optional: wait for network idle (in case API call updates table)
await page.waitForLoadState('networkidle');

// Now fetch visible rows only
const visibleCells = page.locator('[class="oxd-table-cell oxd-padding-cell"] div[data-v-6c07a142]:visible');
const details2 = await visibleCells.allTextContents();

console.log("Filtered Table Values:", details2);

const details1 = [userName, "ESS", Fname, "Enabled"];


console.log(details2);
console.log(details2);

for (const x of details2) {
    if (details1.includes(x)) {
      await  console.log(`${x} is present in details1`);
    } else {
      await  console.log(`${x} is NOT present in details1`);
    }
}      


await page.locator("[class*='oxd-icon bi-pencil-fill']").click();

const userRole =await page.locator("//label[normalize-space(text())='User Role']/parent::div/following-sibling::div/descendant::div[contains(@class,'input')]").textContent();
const employeeName =await page.locator("//label[normalize-space(text())='Employee Name']/parent::div/following-sibling::div/descendant::div[contains(@class,'input')]").first().textContent();
const status =await page.locator("//label[normalize-space(text())='Status']/parent::div/following-sibling::div/descendant::div[contains(@class,'input')]").textContent();
const userNameDetails =await page.locator("//label[text()='Username']/parent::div/following-sibling::div/descendant::input").inputValue();
await page.getByRole('button', { name: /^Cancel$/ }).click();

console.log("User Role:", userRole);
console.log("Employee Name:", employeeName);
console.log("Status:", status);
console.log("Username:", userNameDetails);

await page.locator('.oxd-userdropdown-name').click();
const logoutLink = page.getByRole('menuitem', { name: 'Logout' });
await expect(logoutLink).toBeVisible();
await logoutLink.click();

await page.pause();


});


function getRandomUsername() {
  const randomNum = Math.floor(Math.random() * 10000); // 0–9999
  const prefix = ["auto", "test", "user", "qa", "dev"];
  const randomPrefix = prefix[Math.floor(Math.random() * prefix.length)];

  return `${randomPrefix}${randomNum}`;
}

console.log(getRandomUsername());
