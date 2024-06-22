# API

To provide dynamic bin collection search an API exists at api.gbcbincalendars.co.uk, which is designed to proxy requests to the [Gedling Borough Council refuse collection days search](https://apps.gedling.gov.uk/refuse/search.aspx) and return data in a JSON format.

The API is powered by a Cloudflare Worker and the source code for this worker is available at [worker.js](worker.js).

This worker will make search queries and scrape the result to return the data back in a JSON format. The official Gedling search tool offers no direct API, which is why DOM/HTML scraping is used. The app uses ASP.NET and must scrape a valid __VIEWSTATE and __EVENTVALIDATION value in order to send a valid POST request to perform an automatic search.

Gedling Borough Council do not appear to have any rate limiting or bot protection on this tool, however please be respectful and do not hammer their website.

## Using the API

The API accepts GET requests only and one URL query parameter `streetName`.

An example API request

```
https://api.gbcbincalendars.co.uk/?streetName=Westdale%20Lane
```

Which return the JSON response of:

```json
{
    "streetNameQuery": "Westdale Lane",
    "refuseCollections": [
        {
            "Location": "Westdale Lane East (152-166 even only)",
            "Area": "Gedling",
            "Calendar PDF URL": "https://apps.gedling.gov.uk/refuse/data/FridayG3-2024.pdf",
            "Email Subscribe URL": "https://pages.comms.gedling.gov.uk/pages/friday-g3",
            "Schedule Identifier": "friday-g3",
            "Schedule Name": "Friday G3",
            "Calendar URL": "https://www.gbcbincalendars.co.uk/collections/refuse/friday-g3"
        },
        {
            "Location": "Westdale Lane East (Nos 1 - 275 odd and 2 - 150 &168 - 292A even) (152-166 put bins on Besecar Ave)",
            "Area": "Gedling/Carlton",
            "Calendar PDF URL": "https://apps.gedling.gov.uk/refuse/data/ThursdayG2-2024.pdf",
            "Email Subscribe URL": "https://pages.comms.gedling.gov.uk/pages/thursday-g2",
            "Schedule Identifier": "thursday-g2",
            "Schedule Name": "Thursday G2",
            "Calendar URL": "https://www.gbcbincalendars.co.uk/collections/refuse/thursday-g2"
        },
        {
            "Location": "Westdale Lane West (Nos 289 - 401 odd and 294 - 396 even)",
            "Area": "Mapperley",
            "Calendar PDF URL": "https://apps.gedling.gov.uk/refuse/data/WednesdayG3-2024.pdf",
            "Email Subscribe URL": "https://pages.comms.gedling.gov.uk/pages/wednesday-g3",
            "Schedule Identifier": "wednesday-g3",
            "Schedule Name": "Wednesday G3",
            "Calendar URL": "https://www.gbcbincalendars.co.uk/collections/refuse/wednesday-g3"
        },
        {
            "Location": "Westdale Lane West (Nos 403 - 473 odd and 398 - 450 even)",
            "Area": "Mapperley",
            "Calendar PDF URL": "https://apps.gedling.gov.uk/refuse/data/WednesdayG2-2024.pdf",
            "Email Subscribe URL": "https://pages.comms.gedling.gov.uk/pages/wednesday-g2",
            "Schedule Identifier": "wednesday-g2",
            "Schedule Name": "Wednesday G2",
            "Calendar URL": "https://www.gbcbincalendars.co.uk/collections/refuse/wednesday-g2"
        },
        {
            "Location": "Westmoore Court Westdale Lane",
            "Area": "Mapperley",
            "Calendar PDF URL": "https://apps.gedling.gov.uk/refuse/data/WednesdayG2-2024.pdf",
            "Email Subscribe URL": "https://pages.comms.gedling.gov.uk/pages/wednesday-g2",
            "Schedule Identifier": "wednesday-g2",
            "Schedule Name": "Wednesday G2",
            "Calendar URL": "https://www.gbcbincalendars.co.uk/collections/refuse/wednesday-g2"
        }
    ],
    "gardenWasteCollections": [
        {
            "Location": "Westdale Lane East",
            "Numbers": null,
            "Area": "Carlton",
            "Calendar PDF URL": "https://apps.gedling.gov.uk/GDW/Rounds/data/Garden%20Waste%20I-2024.pdf",
            "Email Subscribe URL": "https://pages.comms.gedling.gov.uk/pages/thursday-i",
            "Schedule Identifier": "thursday-i",
            "Schedule Name": "Thursday I",
            "Calendar URL": "https://www.gbcbincalendars.co.uk/collections/garden/thursday-i"
        },
        {
            "Location": "Westdale Lane East",
            "Numbers": null,
            "Area": "Gedling",
            "Calendar PDF URL": "https://apps.gedling.gov.uk/GDW/Rounds/data/Garden%20Waste%20I-2024.pdf",
            "Email Subscribe URL": "https://pages.comms.gedling.gov.uk/pages/thursday-i",
            "Schedule Identifier": "thursday-i",
            "Schedule Name": "Thursday I",
            "Calendar URL": "https://www.gbcbincalendars.co.uk/collections/garden/thursday-i"
        },
        {
            "Location": "Westdale Lane West",
            "Numbers": null,
            "Area": "Gedling",
            "Calendar PDF URL": "https://apps.gedling.gov.uk/GDW/Rounds/data/Garden%20Waste%20F-2024.pdf",
            "Email Subscribe URL": "https://pages.comms.gedling.gov.uk/pages/monday-f",
            "Schedule Identifier": "monday-f",
            "Schedule Name": "Monday F",
            "Calendar URL": "https://www.gbcbincalendars.co.uk/collections/garden/monday-f"
        },
        {
            "Location": "Westdale Lane West",
            "Numbers": "300-300",
            "Area": "Gedling",
            "Calendar PDF URL": "https://apps.gedling.gov.uk/GDW/Rounds/data/Garden%20Waste%20I-2024.pdf",
            "Email Subscribe URL": "https://pages.comms.gedling.gov.uk/pages/thursday-i",
            "Schedule Identifier": "thursday-i",
            "Schedule Name": "Thursday I",
            "Calendar URL": "https://www.gbcbincalendars.co.uk/collections/garden/thursday-i"
        },
        {
            "Location": "Westdale Lane West",
            "Numbers": "282-282",
            "Area": "Gedling",
            "Calendar PDF URL": "https://apps.gedling.gov.uk/GDW/Rounds/data/Garden%20Waste%20J-2024.pdf",
            "Email Subscribe URL": "https://pages.comms.gedling.gov.uk/pages/friday-j",
            "Schedule Identifier": "friday-j",
            "Schedule Name": "Friday J",
            "Calendar URL": "https://www.gbcbincalendars.co.uk/collections/garden/friday-j"
        },
        {
            "Location": "Westdale Lane West",
            "Numbers": null,
            "Area": "Mapperley",
            "Calendar PDF URL": "https://apps.gedling.gov.uk/GDW/Rounds/data/Garden%20Waste%20F-2024.pdf",
            "Email Subscribe URL": "https://pages.comms.gedling.gov.uk/pages/monday-f",
            "Schedule Identifier": "monday-f",
            "Schedule Name": "Monday F",
            "Calendar URL": "https://www.gbcbincalendars.co.uk/collections/garden/monday-f"
        }
    ],
    "viewState": "BoUWZWXLhOABD91N0+kFrAULOqXSFYpCaYoMHsy/HD0ljRHYWSlPLsa7dfELo/T49vCoweSpt4F42L/YSOxJ7cMv6xu7PPsfUpuQa14V1XR9z2om5YVZhXBWKJws7wflHlVPaINCy5YGSVdd9gQUj3nX7yuIYCOzlxK+ftDzw3xdEwHPiZ1uEmJdvaUqHAUj/jd7AuewZyMbJPJlSkdUgj7majXBtpQuZKSYFe7zg2Gj05AlmgniGQvchPW/wSd3jXip/a6SB45i2YTzZVVfiQ==",
    "viewStateGenerator": "3260408D",
    "eventValidation": "3gyF/28TK1dWTcKbBL3FKFoCv8Yg5AUqCmqdNKD0ceroifDJ+QIJHwBzyN/FOhOj9Ew1wPZV/+sluiOPfXiLuAvL5cWmx18AUbWmR4ZyFlFiKUVLhkYMLuB0URTviImyjtyj0MVU/wQIffS8DIK20Q=="
}
```

A street name that does not provide any data from Gedling Borough Council returns a 404 response.

## Running the API locally

You can locally run the API through wrangler.

```
npx wrangler dev
```

This will run the API on `http://localhost:8787`.

