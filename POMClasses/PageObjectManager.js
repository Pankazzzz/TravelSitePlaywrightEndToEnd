const { LandingPage } = require('./LandingPage');
const {BookingPage} = require('./BookingPage');
const {CheckoutPage} = require('./CheckoutPage');
const {ConfirmationPage} = require('./ConfirmationPage');

class PageObjectManager
{

    constructor(page)
    {
        this.page=page;
        this.LandingPage = new LandingPage(page);
        this.BookingPage = new BookingPage(page);
        this.CheckoutPage = new CheckoutPage(page);
        this.ConfirmationPage = new ConfirmationPage(page);
        this.homePageElement=page.getByText("Back to Home",{exact:true});
    }

    getLandingPage()
    {
        return this.LandingPage;
    }


    getBookingPage()
    {
        return this.BookingPage;
    }

    getCheckoutPage()
    {
        return this.CheckoutPage;
    }

    getConfirmationPage()
    {
        return this.ConfirmationPage;
    }

    async goToHomePage()
    {
        await this.homePageElement.click();
    }

}
module.exports={PageObjectManager};