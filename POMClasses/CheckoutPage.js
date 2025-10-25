const {expect} = require('@playwright/test');

class CheckoutPage
{

    constructor(page)
    {
        this.page=page;
        this.totalPrice=page.locator("[name='total_price']");
        this.userFirstName=page.locator("[name='user[first_name]']");
        this.userLastName=page.locator("[name='user[last_name]']");
        this.userEmail=page.locator("[name='user[email]']");
        this.userPhone=page.locator("[name='user[phone]']")
        this.userAddress=page.locator("[name='user[address]']");
        this.nationalityElement=page.locator("div[class*='dropdown'][class='dropdown bootstrap-select nationality w-100'] button");
        this.nationalitySeacrhBox=page.locator("[class='bs-searchbox'] [aria-label='Search']");
        this.countryElement=page.locator("div[class*='dropdown'][class='dropdown bootstrap-select country w-100'] button");
        this.countryElementSearch=page.locator("[class='bs-searchbox'] [aria-label='Search']");
        this.country=page.locator(".country ul li a");
        this.paymentMethodElement =  page.locator("label[class*='gateway']");
        this.tncElement=page.getByLabel(" I agree to all");
        this.bookButtonElement=page.getByRole('button', {name:' Booking Confirm'});
        this.confirmElement=page.getByText('Payment Time');
    }

    async clickOnBookButton()
    {
        await this.bookButtonElement.click();
        await expect(this.confirmElement).toBeVisible();
    } 

    async clickOnTnC()
    {
        await this.tncElement.click();
    }

    async selectPaymentMethod(payText)
    {
        await this.paymentMethodElement.first().waitFor({state:'visible'});
        const payCount  = await this.paymentMethodElement.count();
        for(let i=0;i<payCount;i++)
        {
            const payType = await this.paymentMethodElement.nth(i).filter({has: this.page.locator("span")}).textContent();
            if(payType.toLocaleLowerCase().includes(payText.toLocaleLowerCase()))
            {
                await this.paymentMethodElement.nth(i).locator(".input").click();
                break;
            }
        }
    }

    async fillPassengerDetails(passengerNo, title, firstname, lastname, nationality, day, month, year, email, phone, passport) 
    {
            const titleDropdown = this.page.locator(`[name='title_${passengerNo}']`);
            await titleDropdown.selectOption(title);

            await this.page.locator(`#t-first-name-${passengerNo}`).fill(firstname);
            await this.page.locator(`#t-last-name-${passengerNo}`).fill(lastname);

            const nationalitySelect = this.page.locator(`#t-nationality-${passengerNo}`);
            await nationalitySelect.selectOption(nationality);

            await this.page.locator(`[name='dob_month_${passengerNo}']`).selectOption(month);
            await this.page.locator(`[name='dob_day_${passengerNo}']`).selectOption(day);
            await this.page.locator(`[name='dob_year_${passengerNo}']`).selectOption(year);

            await this.page.locator(`#t-email-${passengerNo}`).fill(email);
            await this.page.locator(`#t-phone-${passengerNo}`).fill(phone);

            await this.page
                .locator(".form-floating")
                .filter({ has: this.page.locator(`#t-passport-${passengerNo}`) })
                .locator("input")
                .fill(passport);
    }   


    async selectUserCountry(countryValue)
    {
        await this.countryElement.scrollIntoViewIfNeeded(); 
        await this.countryElement.click();
        await this.countryElementSearch.last().fill(countryValue);
        await this.page.locator(".country ul li a").first().waitFor({state:'visible'});
        const countryCount = await this.country.count();
        for(let i=0;i<countryCount;i++)
        {
            const con = (await this.country.nth(i).textContent())?.trim() || '';
            if(con === countryValue)
            {
                await this.country.nth(i).scrollIntoViewIfNeeded();
                await this.country.nth(i).click();
                break;
            }
        }
    }

    async selectUserNationality(nationality)
    {
        await this.nationalityElement.click();
        await this.nationalitySeacrhBox.first().fill(nationality);
        await this.page.waitForSelector(".dropdown-menu.inner.show li a", { state: "visible" });
        await this.page.getByRole('option', { name: new RegExp(`^${nationality}$`, 'i')  }).first().scrollIntoViewIfNeeded();
        await this.page.getByRole('option', { name: new RegExp(`^${nationality}$`, 'i')  }).first().click();
    }

    async fillUserDetails(firstname,lastname,email,phone,address)
    {
        await this.userFirstName.fill(firstname);
        await this.userLastName.fill(lastname);
        await this.userEmail.fill(email);
        await this.userPhone.fill(phone);
        await this.userAddress.fill(address);
    }


    async getTotalPrice()
    {
        const totalPrice = await this.totalPrice.getAttribute("value");
        return totalPrice;
    }
    

}
module.exports={CheckoutPage};