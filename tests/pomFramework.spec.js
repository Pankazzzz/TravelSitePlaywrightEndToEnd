import { PageObjectManager } from '../POMClasses/PageObjectManager';
import fs from 'fs';
const { test, expect } = require('@playwright/test');
const dataset = require("../dataUtils/jsonData.json");

for (const data of dataset) {
  test(`@PhpFramework test case - ${data.pageHeader}`, async ({ browser }) => {
    const context = await browser.newContext({ acceptDownloads: true });
    const page = await context.newPage();
    await page.goto("https://phptravels.net/");
    await expect(page).toHaveTitle("PHPTRAVELS");

    const pageObject = new PageObjectManager(page);
    const landingPage = pageObject.getLandingPage();
    await landingPage.clickOnLogin();
    await landingPage.goToHomePage();
    const message = await landingPage.getHomeMessage();
    await expect(message.toLowerCase().trim()).toBe(data.pageHeader.toLowerCase());
    await landingPage.selectSeatType(data.seatType1);
    await landingPage.selectFlightType(data.flightType);
    await landingPage.setFlyingFrom(data.boardingLoc, data.boardingAirport, data.boardingCode);
    await landingPage.setDestination(data.arrivalLoc, data.arrivalAirport, data.arrivalCode);
    await landingPage.setDepartureDate(data.departureYear, data.departureMonth, data.departureDay);
    await landingPage.setArrivalDate(data.arrivalDate);
    await landingPage.selectSeatType(data.seatType2);
    await landingPage.selectTravellers(data.travellerType, data.travellerQuan);
    await landingPage.clickOnSearch();

    const bookingPage = pageObject.getBookingPage();
    await bookingPage.sortPrice(data.priceSortOrder);
    await bookingPage.selectFlightType(data.flightTypeFilter);
    await bookingPage.selectFlightSchedule(data.flightSchedule);
    const highPrice = await bookingPage.selectSecondExpensiveFlight();

    const checkoutPage = pageObject.getCheckoutPage();
    const totalPrice = await checkoutPage.getTotalPrice();
    await expect(totalPrice.replaceAll(",", "").trim()).toBe(highPrice.replaceAll(",", "").trim());

    const user = data.userDetails;
    await checkoutPage.fillUserDetails(user.firstName, user.lastName, user.email, user.phone, user.address);
    await checkoutPage.selectUserNationality(user.nationality);
    await checkoutPage.selectUserCountry(user.country);
    for (const passenger of data.passengers) {
      await checkoutPage.fillPassengerDetails(
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

    await checkoutPage.selectPaymentMethod(data.paymentMethod);
    await checkoutPage.clickOnTnC();
    await checkoutPage.clickOnBookButton();

    const confirmationPage = pageObject.getConfirmationPage();
    const { bookingHeader, bookingValue, finalP } = await confirmationPage.getBookingDetails();

    for (let i = 0; i < bookingHeader.length; i++) {
      console.log(`${bookingHeader[i]}: ${bookingValue[i] || ""}`);
    }

    console.log(`\nTotal Price: ${finalP}`);
    const downloadPath = await confirmationPage.downloadPDF(data.downloadPath);
    console.log('File downloaded to:', downloadPath);

    await pageObject.goToHomePage();
  });
}
