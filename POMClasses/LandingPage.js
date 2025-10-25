const {expect} = require('@playwright/test');

class LandingPage
{

    constructor(page)
    {
        this.page=page;
        this.agentElement=page.locator("span:has-text('Agents')");
        this.loginElement=page.getByRole("link", {name:'Login'});
        this.homePageElement=page.locator("[src*='logo.png']");
        this.homeMessageElement=page.locator("h4[class*='text-white']");
        this.seatTypeElement=page.locator("[class*='flight_way form-select']");
        this.flightTypeElement=page.locator("#flight_type");
        this.flyingFromElement=page.getByPlaceholder("Flying From");
        this.boardPlatElement=page.locator("[class*='to--insert']");
        this.departureDateElement=page.locator("#departure");
        this.month=page.locator("table.table-condensed span.month");
        this.dayElement=page.locator("td[class='day  active']");
        this.daysElements=page.locator("td[class='day  active'],[class='day ']");
        this.arrivalElement=page.locator("#return_date");
        this.travelerElement=page.locator("[class*='dropdown-toggle dropdown-btn travellers waves-effect']");
        this.passengerTypesElement=page.locator("[class*='_qty']");
        this.searchElement=page.locator("button#flights-search");
        this.load=page.locator(".loading-animation");
        this.loadLazy=page.locator(".loading-animation [loading='lazy']");
        this.flyingFromElement2=page.locator("[name='from']");
    }

    async clickOnSearch()
    {
        await this.searchElement.click();
        await expect(this.load).toHaveAttribute("style","display: none;",{ timeout: 60000 });
        await expect(this.loadLazy).toBeHidden(); 
    }

    async selectTravellers(passengerType,quantity)
    {
    await this.travelerElement.first().click();
    await expect(this.passengerTypesElement.first()).toBeVisible();
    const passengerTypeCount = await this.passengerTypesElement.count();
    for(let i=0;i<passengerTypeCount;i++)
    {
        if(await this.passengerTypesElement.nth(i).locator("label strong").textContent() === passengerType)
        {
            let quan=1;
            while(quan<quantity){
            await this.passengerTypesElement.nth(i).locator("div[class='qtyInc']").click();
            quan++;
            }
            break;
        }
    }
    }

    async setArrivalDate(arrivalDate)
    {
       await this.arrivalElement.fill(arrivalDate);
    }

    async setDepartureDate(year,month,date)
    {
     
        await this.departureDateElement.click();
        await this.page.locator("div[class='datepicker-days'] table thead tr th[class='switch']").nth(2).click();

        const yearSwitch = this.page.locator(
            "div[class='datepicker-months'] table thead tr th[class='switch']"
        );
        const nextButton = this.page.locator(
            "div[class='datepicker-months'] table thead tr th[class='next']"
        );

        while ((await yearSwitch.nth(2).textContent()).trim() !== year) {
        await nextButton.nth(2).click();
        }

        const monthsCount =  await this.month.count();
        for(let i=0;i<monthsCount;i++)
        {
        const monthNameDis= (await this.month.nth(i).textContent()).trim() ;
        const visible = await this.month.nth(i).isVisible();
        console.log(`${this.month.nth(i)} → visible: ${visible}`);

        if(monthNameDis === month  && visible)
        {
            await this.month.nth(i).click();
            break;
        
        }
        }

        await this.departureDateElement.click();
        expect(await this.dayElement.first()).toBeEnabled();
        const datesCount = await this.daysElements.count();
        console.log(`Found ${datesCount} date cells`);
                for(let i=0;i<datesCount;i++)
                {
                    const dateVisible = await this.daysElements.nth(i).isVisible();
                    const day = await this.daysElements.nth(i).textContent();
                    if(day===date && dateVisible)
                    {
                        await this.daysElements.nth(i).click();
                        break;
                    }
                }

    }

    async clickOnLogin()
    {
    await this.agentElement.click();
    await this.loginElement.click();
    }    

    async goToHomePage()
    {
        await this.homePageElement.click();
    }

    async getHomeMessage()
    {
         const message = await this.homeMessageElement.textContent();
         return message;
    }

    async selectSeatType(seatType)
    {
        await this.seatTypeElement.selectOption(seatType);
    }


    async selectFlightType(flighType)
    {
            await this.flightTypeElement.selectOption(flighType);
    }

    async setFlyingFrom(departLocation,airportName,airportCode)
    {
        try{
            await this.flyingFromElement.first().pressSequentially(departLocation);
            await this.boardPlatElement.first().waitFor({ state: "visible" }); 
            const count = await this.boardPlatElement.count();
        
            for (let i = 0; i < count; i++) {
            const plat = this.boardPlatElement.nth(i);
            const airport = await plat.getAttribute('data-airport');
            if (airport === airportName) {
                const button =  plat.getByRole('button', { name: airportCode, exact: true });
                await button.waitFor({state: 'visible'});
                const visible = await button.isVisible();
                console.log(`Button visible for ${airport}:`, visible);        
                await button.click();
                break; 
                }
            }
        }catch(error)
        {   
            await this.flyingFromElement2.fill("");
            await this.flyingFromElement2.fill("SIN - Singapore Changi Airport");    
        }
    }

    async setDestination(destination,airportName,airportCode)
    {
                await this.flyingFromElement.last().pressSequentially(destination);
                await this.boardPlatElement.first().waitFor({ state: "visible" }); 
                const countDep = await this.boardPlatElement.count();

                for (let i = 0; i < countDep; i++) {
                const dept = this.boardPlatElement.nth(i);
                const airportDep = await dept.getAttribute('data-airport');
                if (airportDep === airportName) {
                    const deptButton =  dept.getByRole('button', { name: airportCode, exact: true });
                    await deptButton.waitFor({state: 'visible'});
                    const visible = await deptButton.isVisible();
                    console.log(`Button visible for ${airportDep}:`, visible);        
                    await deptButton.click();
                    break; 
                    }
                }
            await expect(this.flyingFromElement.last()).toHaveValue(new RegExp(airportCode, "i"));
    }



}

module.exports={LandingPage};