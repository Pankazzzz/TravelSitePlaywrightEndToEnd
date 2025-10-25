const {expect} = require('@playwright/test');

class ConfirmationPage
{

    constructor(page)
    {
        this.page=page;
        this.bookingDetail=page.locator("//form[@id='form_gateway']/following-sibling::table[1]/thead/tr/th");
        this.bookingW=page.locator("//form[@id='form_gateway']/following-sibling::table[1]/tbody/tr/th");
        this.finalPrice=page.locator("h5 strong");
        this.pdfElement=page.getByRole('button', { name: /^Download as PDF$/ });
        this.downloadElement=page.locator("[onClick*='pdf']");
    }

    async downloadPDF(path)
    {  
        await this.pdfElement.scrollIntoViewIfNeeded();
        await expect(this.pdfElement).toBeVisible();
        await this.page.waitForTimeout(5000);
        
        const [maybeDownload] = await Promise.all([
          this.page.waitForEvent('download', { timeout: 10000 }).catch(() => null),
          this.downloadElement.click()
        ]);
        
        await maybeDownload.saveAs(path);
        const downloadPath = await maybeDownload.path();
        return downloadPath;
    }

    async getBookingDetails()
    {
        await this.bookingDetail.first().waitFor({state:'visible'});
        const bookingHeader = await this.bookingDetail.allTextContents();

        await this.bookingW.first().waitFor({state:'visible'});
        const bookingValue = await this.bookingW.allTextContents(); 
        console.log(this.bookingW);

        const finalP = await this.finalPrice.textContent();

        return {bookingHeader,bookingValue,finalP};
    }
 
}
module.exports={ConfirmationPage};