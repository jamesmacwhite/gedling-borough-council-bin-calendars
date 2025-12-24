# API

A serveless API exists through a Cloudflare Worker and is deployed under `api.gbcbincalendars.co.uk`. Gedling Borough Council does not provide any direct API for bin collection data, so this worker is used to proxy requests to official Gedling systems and return data in JSON. A combination of browser rendering/HTTP requests are performed to return data where needed.

The API is powered by Cloudflare Workers and the full source code for this worker is available at [worker.js](worker.js).

You can locally run the Cloudflare Worker through wrangler.

```
npx wrangler dev
```

This will run the worker/API on `http://localhost:8787`. The `BASE_URL` variable is set to `http://localhost:4000` the default port when using `jekyll serve`, so the API responds to the local environment and not live.

The router endpoints exposed only support GET requests, but set CORS headers, so you can use this API in any project if you wish witout issues.

## Address search (dynamic calendar data)

`/get-bin-collection-calendar`

* Parameters: `address` - Full Gedling address, for best results, use Royal Mail PAF format

Since November 2025, Gedling Borough Council changed the data model from street name/schedule mapping to calendar data being available per address. They also implemented a front-end and made it more accessible to view the data, which this was one of the reasons behind this project in the first place.

Because of the changes to Gedling Borough Council's website, the use of puppeteer with browser rendering is used to provide this data, as it requires searching individual addresses and viewing each collection page for that address. The design of the new system uses AJAX and has various CSRF and generated website tokens which are difficult to generate/scrape without using a browser/interaction.

The address value provided should ideally be a full Gedling address e.g. `101 Arnold Lane Gedling Nottingham NG4 4HE`. This is because the autocomplete search does partial matching and the worker selects the first result from the autocomplete results. Using full searches reduces the issue of selecting the wrong address.

The following process happens with this endpoint:

1. Navigate to https://waste.digital.gedling.gov.uk/w/webpage/bin-collections
2. Trigger the autocomplete search from the address search input provided and select the first result
3. Go to the view collection days widget
4. View the full 2025/26 collection data for the returned address
5. Locate the widget data-params which provides full data as JSON
6. Extract the JSON and return the collection data information as a JSON response.

The following JSON response is returned if successful:

```json
{
  "address": "101 Arnold Lane Gedling Nottingham NG4 4HE",
  "collections": [
    {
      "month": "2025-12",
      "dates": [
        {
          "date": "2025-12-05",
          "collections": [
            "Recycling Collection Service"
          ]
        },
        {
          "date": "2025-12-12",
          "collections": [
            "General Collection Service"
          ]
        },
        {
          "date": "2025-12-19",
          "collections": [
            "Glass Collection Service",
            "Recycling Collection Service"
          ]
        },
        {
          "date": "2025-12-27",
          "collections": [
            "General Collection Service"
          ]
        }
      ]
    },
    {
      "month": "2026-01",
      "dates": [
        {
          "date": "2026-01-03",
          "collections": [
            "Recycling Collection Service"
          ]
        },
        {
          "date": "2026-01-09",
          "collections": [
            "General Collection Service"
          ]
        },
        {
          "date": "2026-01-16",
          "collections": [
            "Glass Collection Service",
            "Recycling Collection Service"
          ]
        },
        {
          "date": "2026-01-23",
          "collections": [
            "General Collection Service"
          ]
        },
        {
          "date": "2026-01-30",
          "collections": [
            "Recycling Collection Service"
          ]
        }
      ]
    },
    {
      "month": "2026-02",
      "dates": [
        {
          "date": "2026-02-06",
          "collections": [
            "General Collection Service"
          ]
        },
        {
          "date": "2026-02-13",
          "collections": [
            "Glass Collection Service",
            "Recycling Collection Service"
          ]
        },
        {
          "date": "2026-02-20",
          "collections": [
            "General Collection Service"
          ]
        },
        {
          "date": "2026-02-27",
          "collections": [
            "Recycling Collection Service"
          ]
        }
      ]
    },
    {
      "month": "2026-03",
      "dates": [
        {
          "date": "2026-03-06",
          "collections": [
            "General Collection Service"
          ]
        },
        {
          "date": "2026-03-13",
          "collections": [
            "Glass Collection Service",
            "Recycling Collection Service"
          ]
        },
        {
          "date": "2026-03-20",
          "collections": [
            "General Collection Service"
          ]
        },
        {
          "date": "2026-03-27",
          "collections": [
            "Recycling Collection Service"
          ]
        }
      ]
    },
    {
      "month": "2026-04",
      "dates": [
        {
          "date": "2026-04-03",
          "collections": [
            "General Collection Service"
          ]
        },
        {
          "date": "2026-04-10",
          "collections": [
            "Glass Collection Service",
            "Recycling Collection Service"
          ]
        },
        {
          "date": "2026-04-17",
          "collections": [
            "General Collection Service"
          ]
        },
        {
          "date": "2026-04-24",
          "collections": [
            "Recycling Collection Service"
          ]
        }
      ]
    },
    {
      "month": "2026-05",
      "dates": [
        {
          "date": "2026-05-01",
          "collections": [
            "General Collection Service"
          ]
        },
        {
          "date": "2026-05-08",
          "collections": [
            "Glass Collection Service",
            "Recycling Collection Service"
          ]
        },
        {
          "date": "2026-05-15",
          "collections": [
            "General Collection Service"
          ]
        },
        {
          "date": "2026-05-22",
          "collections": [
            "Recycling Collection Service"
          ]
        },
        {
          "date": "2026-05-29",
          "collections": [
            "General Collection Service"
          ]
        }
      ]
    },
    {
      "month": "2026-06",
      "dates": [
        {
          "date": "2026-06-05",
          "collections": [
            "Glass Collection Service",
            "Recycling Collection Service"
          ]
        },
        {
          "date": "2026-06-12",
          "collections": [
            "General Collection Service"
          ]
        },
        {
          "date": "2026-06-19",
          "collections": [
            "Recycling Collection Service"
          ]
        },
        {
          "date": "2026-06-26",
          "collections": [
            "General Collection Service"
          ]
        }
      ]
    },
    {
      "month": "2026-07",
      "dates": [
        {
          "date": "2026-07-03",
          "collections": [
            "Glass Collection Service",
            "Recycling Collection Service"
          ]
        },
        {
          "date": "2026-07-10",
          "collections": [
            "General Collection Service"
          ]
        },
        {
          "date": "2026-07-17",
          "collections": [
            "Recycling Collection Service"
          ]
        },
        {
          "date": "2026-07-24",
          "collections": [
            "General Collection Service"
          ]
        },
        {
          "date": "2026-07-31",
          "collections": [
            "Glass Collection Service",
            "Recycling Collection Service"
          ]
        }
      ]
    },
    {
      "month": "2026-08",
      "dates": [
        {
          "date": "2026-08-07",
          "collections": [
            "General Collection Service"
          ]
        },
        {
          "date": "2026-08-14",
          "collections": [
            "Recycling Collection Service"
          ]
        },
        {
          "date": "2026-08-21",
          "collections": [
            "General Collection Service"
          ]
        },
        {
          "date": "2026-08-28",
          "collections": [
            "Glass Collection Service",
            "Recycling Collection Service"
          ]
        }
      ]
    },
    {
      "month": "2026-09",
      "dates": [
        {
          "date": "2026-09-04",
          "collections": [
            "General Collection Service"
          ]
        },
        {
          "date": "2026-09-11",
          "collections": [
            "Recycling Collection Service"
          ]
        },
        {
          "date": "2026-09-18",
          "collections": [
            "General Collection Service"
          ]
        },
        {
          "date": "2026-09-25",
          "collections": [
            "Glass Collection Service",
            "Recycling Collection Service"
          ]
        }
      ]
    },
    {
      "month": "2026-10",
      "dates": [
        {
          "date": "2026-10-02",
          "collections": [
            "General Collection Service"
          ]
        },
        {
          "date": "2026-10-09",
          "collections": [
            "Recycling Collection Service"
          ]
        },
        {
          "date": "2026-10-16",
          "collections": [
            "General Collection Service"
          ]
        },
        {
          "date": "2026-10-23",
          "collections": [
            "Glass Collection Service",
            "Recycling Collection Service"
          ]
        },
        {
          "date": "2026-10-30",
          "collections": [
            "General Collection Service"
          ]
        }
      ]
    },
    {
      "month": "2026-11",
      "dates": [
        {
          "date": "2026-11-06",
          "collections": [
            "Recycling Collection Service"
          ]
        },
        {
          "date": "2026-11-13",
          "collections": [
            "General Collection Service"
          ]
        },
        {
          "date": "2026-11-20",
          "collections": [
            "Glass Collection Service",
            "Recycling Collection Service"
          ]
        },
        {
          "date": "2026-11-27",
          "collections": [
            "General Collection Service"
          ]
        }
      ]
    }
  ]
}
```

The data is scraped from the Yearly Calendar webpage as there is encoded JSON stored in data attributes on various widgets on this page, the address value can be different from the original query because it is the returned data from the address autocomplete results. 

The collection data is helpfully present in the DOM and extracted under the `collections` key.

The benefit of this endpoint is that it is always dynamic, in the event Gedling change any schedules any updates will be immediately reflected, unlike the static JSON endpoints, which are based off the iCal data and converted to JSON, which requires the iCal source files to be changed.

## Street Search (legacy)

`/street-search`

* Parameters: `streetName` - Full/partial street name value

Until November 2025, Gedling Borough Council never provided anything but PDF documents for bin calendars which is why this project was initially started. To make it easier to map a schedule to a street search, this endpoint uses the [Gedling Borough Council refuse collection days search](https://apps.gedling.gov.uk/refuse/search.aspx) to make queries and provide mapping between the data. Given the new bin collection data process, I believe that this system is likely to be removed in the future.

This worker will make search queries and scrape the results to return the data formatted as JSON. The origin data behind the search is not published as open data, which is why DOM/HTML scraping is used. The Gedling refuse search site uses ASP.NET and in order to send a valid POST request the __VIEWSTATE and __EVENTVALIDATION values must be scraped and passed in the request to be valid.

The following additional validation requirements are defined for the street name query parameter value provided:

* A street name value must be provided
* Any value must be 5 or more characters
* The value must not start with a number

The reason for these additional validation rules is due to the Gedling refuse search site doing very wide partial matching on the data within the "Location" and "No's" (Numbers) columns in the database behind it. This can lead very large paginated results with vague search queries like `1` or `A`, which this API does not currently handle. I may loosen this requirement in the future if I implement a way to process paginated responses reliably both from the Worker and front end.

For best usage and meaningful search results, make sure street name queries are full street names e.g. "Westdale Lane" or partial but with enough context like "Westdale".

An example GET request with `Westdale Lane` used as the street query:

```
https://api.gbcbincalendars.co.uk/street-search?streetName=Westdale%20Lane
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

A street name query that does not provide any data from the Gedling Borough Council search response returns a 404 response, with a specific message stating this.

A known quirk observed for certain street name queries leads to a scenario where there no data is returned for refuse/recycling, but will return data for garden waste or possibly the reverse. This scenario will not return a 404, but means either the `refuseCollections` key or `gardenWasteCollections` will be an empty array given no results were returned for that collection.

If using the API response data, you should always ensure the `refuseCollections` or `gardenWasteCollections` is not an empty array.

