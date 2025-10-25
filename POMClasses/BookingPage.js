const {expect} = require('@playwright/test');

class BookingPage
{

    constructor(page)
    {
        this.page=page;
        this.sortTypeElement=page.locator("[data-value='desc']");
        this.timeOfFlightElement=page.locator(".time-selection [for*='departure'][class*='nav-item form-check-label']");
        this.flightItemElement=page.locator(".flight-item");
    }

    async selectFlightSchedule(flightSchedule)
    {
        await this.timeOfFlightElement.first().scrollIntoViewIfNeeded();
        const countTime = await this.timeOfFlightElement.count();
        for(let i=0;i<countTime;i++)
        {
            if(await this.timeOfFlightElement.nth(i).locator("label span").textContent() === flightSchedule)
            {
                await this.timeOfFlightElement.nth(i).locator("input").click();
                break;
            }
        }
    }

    async sortPrice(sortType)
    {
        await this.page.getByText(sortType).click();
        await expect(this.sortTypeElement).toHaveAttribute("class","nav-link p-0 rounded-4 waves-effect active show");
    }

    async selectFlightType(flightType)
    {
        await this.page.getByLabel(flightType).click();
    }

    async selectSecondExpensiveFlight()
    {
        await this.flightItemElement.first().waitFor({state:'visible'});
        const flightItemCount = await this.flightItemElement.count();
        const allPrices = await this.flightItemElement.locator(".price span").allTextContents();
        allPrices.sort((a, b) => Number(a) - Number(b));
        let highPrice = null;
        if (allPrices.length > 1) {
        highPrice = allPrices[allPrices.length - 2]; // 2nd highest
        }
    
        for(let i=0;i<flightItemCount;i++)
        {
            const flightPrice = await this.flightItemElement.nth(i).locator(".price span").textContent();   
            if(flightPrice === highPrice)
            {
                await this.flightItemElement.nth(i).getByRole('button', {name:'Select Flight'}).click();
                break;
            }
        }
        
        return highPrice;
    }



}
module.exports={BookingPage};