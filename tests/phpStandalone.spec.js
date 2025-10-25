const {test,expect} = require('@playwright/test');

test("@PhpStadalone test case", async ({browser}) => {


    const context = await browser.newContext({
  acceptDownloads: true,
  //downloadsPath: './Users/pankajshukla/Downloads'
});
    const page = await context.newPage();
    await page.goto("https://phptravels.net/");
    expect(page).toHaveTitle("PHPTRAVELS");


    await page.locator("span:has-text('Agents')").click();
    await page.getByRole("link", {name:'Login'}).click();
    await page.locator("[src*='logo.png']").click();
    const message = await page.locator("h4[class*='text-white']").textContent();
    const journeyType = await page.locator("[class*='flight_way form-select']");
    await journeyType.selectOption("return");
    const flightType = await page.locator("#flight_type");
    await flightType.selectOption("Economy");
    
    await page.getByPlaceholder("Flying From").first().pressSequentially("singapore");
    const boardPlat = await page.locator("[class*='to--insert']");
    //await expect(boardPlat.first()).toBeVisible();  
    await boardPlat.first().waitFor({ state: "visible" }); 

    const count = await boardPlat.count();
    console.log(count);

    for (let i = 0; i < count; i++) {
    const plat = boardPlat.nth(i);
    const airport = await plat.getAttribute('data-airport');
    if (airport === 'Singapore Changi Airport') {
        const button =  plat.getByRole('button', { name: 'SIN', exact: true });
        await button.waitFor({state: 'visible'});
        const visible = await button.isVisible();
        console.log(`Button visible for ${airport}:`, visible);        
        await button.click();
        break; 
        }
    }
await expect(page.getByPlaceholder("Flying From").first()).toHaveValue(/SIN/i);



    await page.getByPlaceholder("Flying From").last().pressSequentially("phuk");
    const depPlat = await page.locator("[class*='to--insert']");
    await depPlat.first().waitFor({ state: "visible" }); 
    const countDep = await boardPlat.count();
    console.log(countDep);
    for (let i = 0; i < countDep; i++) {
    const dept = depPlat.nth(i);
    const airportDep = await dept.getAttribute('data-airport');
    console.log(airportDep);
    if (airportDep === 'Phuket International Airport') {
        const deptButton =  dept.getByRole('button', { name: 'HKT', exact: true });
        await deptButton.waitFor({state: 'visible'});
        const visible = await deptButton.isVisible();
        console.log(`Button visible for ${airportDep}:`, visible);        
        await deptButton.click();
        break; 
        }
    }
await expect(page.getByPlaceholder("Flying From").last()).toHaveValue(/HKT/i);


    await page.locator("#departure").click();
    await page.locator("div[class='datepicker-days'] table thead tr th[class='switch']").nth(2).click();
    while(await page.locator("div[class='datepicker-months'] table thead tr th[class='switch']").nth(2).textContent() !== '2025')
    {
        await page.locator("div[class='datepicker-months'] table thead tr th[class='next']").nth(2).click();
    }

    const monthsName =  page.locator("table.table-condensed span.month");
    const monthsCount =  await monthsName.count();
    console.log(monthsCount);
    for(let i=0;i<monthsCount;i++)
    {
        const monthNameDis= (await monthsName.nth(i).textContent()).trim() ;
        console.log(monthNameDis)
        const visible = await monthsName.nth(i).isVisible();
        console.log(`${monthsName.nth(i)} → visible: ${visible}`);

        if(monthNameDis === 'Dec'  && visible)
        {
            //  await monthsName.nth(i).scrollIntoViewIfNeeded();
            //  await expect(monthsName.nth(i)).toBeVisible();
            //await expect(monthsName.nth(i)).toBeVisible({ timeout: 5000 });
            await monthsName.nth(i).click();
            break;
        
        }
    }

         await page.locator("#departure[name='depart']").click();
        expect(await page.locator("td[class='day  active']").first()).toBeEnabled();
        const dates = page.locator("td[class='day  active'],[class='day ']");
        const datesCount = await dates.count();
        console.log(`Found ${datesCount} date cells`);
                for(let i=0;i<datesCount;i++)
                {
                    const dateVisible = await dates.nth(i).isVisible();
                    const day = await dates.nth(i).textContent();
                    if(day==='10' && dateVisible)
                    {
                        await dates.nth(i).click();
                        break;
                    }
                }


        // const date31 = page.getByText("31", { exact: true });
        // await date31.waitFor({ state: 'visible' });
        // await date31.click();

    // await page.locator("#departure").fill("19-02-2026");
    await page.locator("#return_date").fill("12-12-2025");
    await journeyType.selectOption("oneway");
    await page.locator("[class*='dropdown-toggle dropdown-btn travellers waves-effect']").first().click();

    const passengerTypes = page.locator("[class*='_qty']");
    await expect(passengerTypes.first()).toBeVisible();
    const passengerTypeCount = await passengerTypes.count();
    for(let i=0;i<count;i++)
    {
        if(await passengerTypes.nth(i).locator("label strong").textContent() === 'Adults')
        {
            let quan=1;
            while(quan<=1){
            await passengerTypes.nth(i).locator("div[class='qtyInc']").click();
            quan++;
            }
            break;
        }
    }
    await page.locator("button#flights-search").click();
    await expect(page.locator(".loading-animation")).toHaveAttribute("style","display: none;");
    //await page.locator('.loading-animation [loading="lazy"]').waitFor({ state: 'hidden' })
    await expect(page.locator(".loading-animation [loading='lazy']")).toBeHidden();
    await page.getByText("Highest to Lower").click();
    await expect(page.locator("[data-value='desc']")).toHaveAttribute("class","nav-link p-0 rounded-4 waves-effect active show");
    await page.getByLabel("Direct").click();

    const timeOfFlight = page.locator(".time-selection [for*='departure'][class*='nav-item form-check-label']");
    await timeOfFlight.first().scrollIntoViewIfNeeded();
    const countTime = await timeOfFlight.count();
    console.log(countTime);

    for(let i=0;i<countTime;i++)
    {
        console.log(await timeOfFlight.nth(i).locator("label span").textContent());
        if(await timeOfFlight.nth(i).locator("label span").textContent() === 'Afternoon')
        {
            await timeOfFlight.nth(i).locator("input").click();
            break;
        }
    }

    const flightItem = page.locator(".flight-item");
    await flightItem.first().waitFor({state:'visible'});
    const flightItemCount = await flightItem.count();
    const allPrices = await flightItem.locator(".price span").allTextContents();
   // Sort numerically ascending
allPrices.sort((a, b) => Number(a) - Number(b));

let highPrice = null;

if (allPrices.length > 1) {
  highPrice = allPrices[allPrices.length - 2]; // 2nd highest
}

console.log("Second Highest Price:", highPrice);
console.log("Total Flights:", flightItemCount);

    
    for(let i=0;i<flightItemCount;i++)
    {
        const flightPrice = await flightItem.nth(i).locator(".price span").textContent();   
        if(flightPrice === highPrice)
        {
            await flightItem.nth(i).getByRole('button', {name:'Select Flight'}).click();
            break;
        }
    }

    const totalPrice = await page.locator("[name='total_price']").getAttribute("value");
    console.log(totalPrice);
    console.log(highPrice);
    await expect(totalPrice.replaceAll(",","").trim()).toBe(highPrice.replaceAll(",","").trim());
    //await expect(totalPrice===highPrice).toBeTruthy();

    await page.locator("[name='user[first_name]']").fill("Test");
    await page.locator("[name='user[last_name]']").fill("TSurname");
    await page.locator("[name='user[email]']").fill("test@test.com");
    await page.locator("[name='user[phone]']").fill("9022272891");
    await page.locator("[name='user[address]']").fill("Test house test");

     await page.locator("div[class*='dropdown'][class='dropdown bootstrap-select nationality w-100'] button").click();
     await page.locator("[class='bs-searchbox'] [aria-label='Search']").first().fill("India");
        await page.waitForSelector(".dropdown-menu.inner.show li a", { state: "visible" });
    await page.getByRole('option', { name: /^India$/ }).first().scrollIntoViewIfNeeded();
     await page.getByRole('option', { name: /^India$/ }).first().click();

    await page.locator("div[class*='dropdown'][class='dropdown bootstrap-select country w-100'] button").scrollIntoViewIfNeeded(); 
    await page.locator("div[class*='dropdown'][class='dropdown bootstrap-select country w-100'] button").click();
    await page.locator("[class='bs-searchbox'] [aria-label='Search']").last().fill("India");
    await page.locator(".country ul li a").first().waitFor({state:'visible'});
    const country = page.locator(".country ul li a");
    const countryCount = await country.count();
    console.log(countryCount);
    for(let i=0;i<count;i++)
    {
        const con = (await country.nth(i).textContent())?.trim() || '';
        if(con === 'India')
        {
            await country.nth(i).scrollIntoViewIfNeeded();
            await country.nth(i).click();
            break;
        }
    }


    const title = page.locator("[name='title_1']");
    await title.selectOption("Mrs");
    await page.locator("#t-first-name-1").fill("Test");
    await page.locator("#t-last-name-1").fill("Test Surname");

    const nationality = page.locator("#t-nationality-1");
    await nationality.selectOption("India");

    const dob = page.locator("[name='dob_month_1']");
    await dob.selectOption("07");

    const day = page.locator("[name='dob_day_1']");
    await day.selectOption("31");

    const year = page.locator("[name='dob_year_1']");
    await year.selectOption("1999");

    await page.locator("#t-email-1").fill("test@test.com");
    await page.locator("#t-phone-1").fill("9282765167");

    await page.locator(".form-floating").filter({has : page.locator("#t-passport-1")}).locator("input").fill("1234567AJSH")


        await page.locator("#t-first-name-2").fill("Test");
    await page.locator("#t-last-name-2").fill("Test Surname");
    await page.locator("#t-email-2").fill("test@test.com");
    await page.locator("#t-phone-2").fill("9282765167");
    await page.locator(".form-floating").filter({has : page.locator("#t-passport-2")}).locator("input").fill("1234567AJSH")


    const paymentMethod =  page.locator("label[class*='gateway']");
    await paymentMethod.first().waitFor({state:'visible'});
    const payCount  = await paymentMethod.count();


    


   

    for(let i=0;i<payCount;i++)
    {
        const payType = await paymentMethod.nth(i).filter({has: page.locator("span")}).textContent();
        console.log(payType.trim());
        if(payType.toLocaleLowerCase().includes("later".toLocaleLowerCase()))
        {
            await paymentMethod.nth(i).locator(".input").click();
            break;
        }
    }

    await page.getByLabel(" I agree to all").click();
    await page.getByRole('button', {name:' Booking Confirm'}).click();

    await expect(page.getByText('Payment Time')).toBeVisible();
    const bookingDetail = await page.locator("//form[@id='form_gateway']/following-sibling::table[1]/thead/tr/th");
    await bookingDetail.first().waitFor({state:'visible'});
    const bookingDetails = await bookingDetail.allTextContents();

    const bookingW = await page.locator("//form[@id='form_gateway']/following-sibling::table[1]/tbody/tr/th");
    await bookingW.first().waitFor({state:'visible'});
    const booking = await bookingW.allTextContents();
  
    const finalP = await page.locator("h5 strong").textContent();
    console.log(bookingDetails);
    console.log(booking);
    console.log(finalP);
    for (let i = 0; i < bookingDetails.length; i++) {
    console.log(`${bookingDetails[i]}: ${booking[i] || ""}`);
    }

    await page.getByRole('button', { name: /^Download as PDF$/ }).scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: /^Download as PDF$/ }).waitFor({state:'visible'});

const [download] = await Promise.all([
  page.waitForEvent('download'), // Waits for the download to start
  //page.getByRole('button', { name: /^Download as PDF$/ }).click()
  page.locator("button[class*='no_print']:first-of-type").first().click()
]);

await download.saveAs('/Users/pankajshukla/Downloads/invoice.pdf');
const path = await download.path();
console.log('✅ File downloaded to:', path);

await page.getByText("Back to Home",{exact:true}).click();

});