# API

A serveless API exists through a Cloudflare Worker and is deployed under `api.gbcbincalendars.co.uk`. Gedling Borough Council does not provide any direct API for bin collection data, so this worker is used to proxy requests to official Gedling systems and return data in JSON. A combination of browser rendering/HTTP requests are performed to return data where needed.

The API is powered by Cloudflare Workers and the full source code for this worker is available at [worker.js](worker.js).

You can locally run the Cloudflare Worker through wrangler, which is useful for local API testing.

```
npx wrangler dev
```

This will run the worker/API on `http://localhost:8787`. The `BASE_URL` variable is set to `http://localhost:4000` the default port when using `jekyll serve`, so the API responds to the local environment and not live.

The router endpoints exposed only support GET requests, but set CORS headers, so you can use this API in any project if you wish without issues.

## Address search (dynamic calendar data)

`/get-bin-collection-calendar`

* Query Parameter: `address` - An address in the Gedling borough area.

Since November 2025, Gedling Borough Council changed the data model from street name/schedule mapping to calendar data being available per address.

Because of the changes to Gedling Borough Council's website, the use of puppeteer with browser rendering is used to provide this data, as it requires searching individual addresses and viewing each generated collection days page for that address. The design of the new system uses AJAX and has various CSRF and generated website tokens which are difficult to generate/scrape without using a browser/interaction.

The address value provided should ideally be a full Gedling address e.g. `101 Arnold Lane Gedling Nottingham NG4 4HE`. This is because the autocomplete search does partial matching and the worker selects the first result from the autocomplete results. Using full searches reduces the issue of selecting the wrong address. Although searches such as `101 Arnold Lane` will work, but depending on the search input, could lead to ambigious results if multiple are returned.

The following process happens with this endpoint:

1. A headless browser through puppeteer is used to navigate to `https://waste.digital.gedling.gov.uk/w/webpage/bin-collections`
2. The search input provided is passed to the autocomplete address search component to trigger the address selection
3. Go to the view collection days widget page for the address input
4. View the full 2025/26 collection data widget to obtain the full calendar data.
5. Locate the widget data-params which provides full data as encoded JSON.
6. Extract the JSON and return the collection data information as a JSON response.

The following JSON response is returned if successful:

* `addressQuery` - The original search input sent
* `address` - The actual matched full address from the autocomplete search result
* `binCollectionUrl` - The bin collection page for the address with valid tokens to view/bookmark
* `collections` - The calendar data of all collections across the calendar year from the page

```json
{
  "addressQuery": "101 Arnold Lane",
  "address": "101 Arnold Lane Gedling Nottingham NG4 4HE",
  "binCollectionUrl": "https://waste.digital.gedling.gov.uk/w/webpage/620GBSHB1?webpage_hash=24cd16e4de8c69655761e97d01430996fbacca8b7865b5762f59607ef7aaf62a&webpage_token=79175661266514791221023577abc0fb0b64e4980fd3811eaa77c279d888e4e9&auth=MzU3ZmY1ODhjMmJl&id=7162197",
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

The data is scraped from the Yearly Calendar webpage as there is encoded JSON stored in data attributes on various widgets on this page, the address value may be different from the original query because it is the returned data from the address autocomplete results. 

The collection data is helpfully present in the DOM and extracted under the `collections` key.

The benefit of this endpoint is that it is always dynamic, in the event Gedling change any schedules any updates will be immediately reflected, unlike the static JSON endpoints, which are based off the iCal data and converted to JSON, which requires the iCal source files to be changed and is also static.
