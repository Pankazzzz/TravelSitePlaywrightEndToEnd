const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const {PageObjectManager} = require('../../../POMClasses/PageObjectManager.js');
const { setDefaultTimeout } = require('@cucumber/cucumber');
setDefaultTimeout(120 * 1000); // 60 seconds for each step


Given('User checks login functionality and header {string}', async function (header) {
    console.log(`Checking login functionality with header: ${header}`);
    this.pageObject = new PageObjectManager(this.page);
    this.landingPage = this.pageObject.getLandingPage();
    await this.landingPage.clickOnLogin();
    await this.landingPage.goToHomePage();
    const message = await this.landingPage.getHomeMessage();
    await expect(message.toLowerCase().trim()).toBe(header.toLowerCase());
});

Given('User fills flight details', async function (dataTable) {
  const data = dataTable.hashes()[0]; //dataTable.hashes() converts the table into an array of objects (one per row).
  await this.landingPage.selectSeatType(data.seatType1);
  await this.landingPage.selectFlightType(data.flightType);
  await this.landingPage.setFlyingFrom(data.boardingLoc, data.boardingAirport, data.boardingCode);
  await this.landingPage.setDestination(data.arrivalLoc, data.arrivalAirport, data.arrivalCode);
  await this.landingPage.setDepartureDate(data.departureYear, data.departureMonth, data.departureDay);
  await this.landingPage.setArrivalDate(data.arrivalDate);
  await this.landingPage.selectSeatType(data.seatType2);
  await this.landingPage.selectTravellers(data.travellerType, parseInt(data.travellerQuan));
});

When('User clicks on search flight', { timeout: 60 * 1000 },async function () {
    await this.landingPage.clickOnSearch();
});

Then('User selects flight based on expense with {string} {string} {string}',
  async function (priceSortOrder, flightTypeFilter, flightSchedule) {
    
    this.bookingPage = this.pageObject.getBookingPage();
    await this.bookingPage.sortPrice(priceSortOrder);
    await this.bookingPage.selectFlightType(flightTypeFilter);
    await this.bookingPage.selectFlightSchedule(flightSchedule);

    const highPrice = await this.bookingPage.selectSecondExpensiveFlight();
    this.checkoutPage = this.pageObject.getCheckoutPage();

    const totalPrice = await this.checkoutPage.getTotalPrice();
    await expect(totalPrice.replaceAll(",", "").trim()).toBe(
      highPrice.replaceAll(",", "").trim()
    );
  }
);


Then('User fills his details', async function (dataTable) {
    const user = dataTable.hashes()[0];
    await this.checkoutPage.fillUserDetails(user.firstName, user.lastName, user.email, user.phone, user.address);
    await this.checkoutPage.selectUserNationality(user.nationality);
    await this.checkoutPage.selectUserCountry(user.country);
});

Then('User fills passenger details', async function (dataTable) {
  const passengers = dataTable.hashes();
  for (const passenger of passengers) {
      await this.checkoutPage.fillPassengerDetails(
        passenger.passengerNo,
        passenger.title,
        passenger.firstName,
        passenger.lastName,
        passenger.nationality,
        passenger.day,
        passenger.month,
        passenger.year,
        passenger.email,
        passenger.phone,
        passenger.passport
      );
    }
});

When('User clicks on book {string}', async function (paymentMethod) {
    await this.checkoutPage.selectPaymentMethod(paymentMethod);
    await this.checkoutPage.clickOnTnC();
    await this.checkoutPage.clickOnBookButton();
    this.confirmationPage = this.pageObject.getConfirmationPage();
});


Then('User download the invoice and check details {string}', async function (path) {
    const { bookingHeader, bookingValue, finalP } = await this.confirmationPage.getBookingDetails();

    for (let i = 0; i < bookingHeader.length; i++) {
    this.attach(`Booking details: ${bookingHeader[i]}: ${bookingValue[i] || ""}`);
    }

    console.log(`\nTotal Price: ${finalP}`);
    const downloadPath = await this.confirmationPage.downloadPDF(path);
    console.log('File downloaded to:', downloadPath);

    await this.pageObject.goToHomePage();
});
