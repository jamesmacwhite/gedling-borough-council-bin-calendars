# API

To provide a dynamic bin collection search on the GitHub pages site an API exists at api.gbcbincalendars.co.uk, which is designed to proxy requests to the [Gedling Borough Council refuse collection days search](https://apps.gedling.gov.uk/refuse/search.aspx) and return the data in a JSON format.

The API is powered by a Cloudflare Worker and the source code for this worker is available at [worker.js](worker.js).

This worker will make search queries and scrape the results to return the data back in a JSON format. The official Gedling search tool offers no direct API, which is why DOM/HTML scraping is used. The Gedling refuse search site uses ASP.NET and in order to send a valid POST request the __VIEWSTATE and __EVENTVALIDATION values must be scraped and passed in the request to be valid.

Gedling Borough Council do not appear to have any rate limiting or bot protection on this tool, which fortunately for this API, removes most typical scraping issues, however please be respectful and do not hammer their website through this API, as it could get the Cloudflare Worker blocked.

## Using the API

The API accepts GET requests only and requires the URL query parameter `streetName`.

An example GET request:

```
https://api.gbcbincalendars.co.uk/?streetName=Westdale%20Lane
```

Which will return the JSON response of:

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
    "viewState": "...",
    "viewStateGenerator": "...",
    "eventValidation": "..."
}
```

A street name that does not provide any data from Gedling Borough Council search response returns a 404 response.

The origin search data appears to support partial matches on the "Location" and "No's" (Numbers) columns, this can lead to paginated responses, which this API currently doesn't handle, due to using JavaScript postbacks. It is therefore recommended to use more specific street search queries, ideally full street name values like "Oxclose Lane".

## Running the API locally

You can locally run the API through wrangler.

```
npx wrangler dev
```

This will run the API on `http://localhost:8787`. The `BASE_URL` variable is set to `http://localhost:4000` the default port when using `jekyll serve`, so the API responds to the local environment and not live.
