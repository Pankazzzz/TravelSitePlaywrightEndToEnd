Feature: Book a flight
As a user i want to book flight 
and download invoice


# Background: 
# Given User should have all the necessary information


@SmokeTest
Scenario: Complete end-to-end flight booking and PDF download
Given User checks login functionality and header "Your Trip Starts Here!"
And User fills flight details
| seatType1 | flightType | boardingLoc | boardingAirport             | boardingCode | arrivalLoc | arrivalAirport               | arrivalCode  | departureYear | departureMonth | departureDay | arrivalDate | seatType2 | travellerType | travellerQuan |
| return    | Economy    | singa       | Singapore Changi Airport    | SIN          | phuket     | Phuket International Airport | HKT          | 2025          | Dec            | 10           | 12-12-2025  | oneway    | Adults        | 2             |
When User clicks on search flight
Then User selects flight based on expense with "Highest to Lower" "Direct" "Afternoon"
And User fills his details
| firstName | lastName   | email          | phone       | address         | nationality | country |
| test      | tSurname   | test@test.com  | 9022571622  | Test house test | India       | India   | 
And User fills passenger details
 | passengerNo | title | firstName | lastName | nationality | day | month | year | email          | phone       | passport    |
 | 1           | Mrs   | Test      | Surname  | India       | 31  | 07    | 1999 | test@test.com  | 9282765167  | 1234567AJSH |
 | 2           | Mr    | Test      | Surname  | India       | 01  | 01    | 1984 | test@test.com  | 9282765167  | 1234567AJSH |
When User clicks on book "later"
Then User download the invoice and check details "/Users/pankajshukla/PlayWrightProjects/OrangeHRM/downloads/invoice.pdf"



