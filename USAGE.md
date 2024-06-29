# Using the calendars

All bin collection calendars are published in several formats, designed to be more accessible and in open data formats for use by both residents of Gedling and other software.

## HTML calendars

All calendars are [available to be viewed as HTML](https://www.gbcbincalendars.co.uk). You can view all calendars through this website.

## Importing to a calendar

You can import any calendar as static or subscribe using the iCal URL, an example for the Wednesday G2 bin collection:

```
https://www.gbcbincalendars.co.uk/ical/gedling_borough_council_wednesday_g2_bin_schedule.ics
```

The .ics files have been tested with multiple calendar software applications to ensure compatibility.

[A GitHub pages site](https://www.gbcbincalendars.co.uk) exists to display all calendars in a logical structure offering the .ics calendar for each schedule available to download and the iCal subscribe URL to use in any calendar software to automatically receive updates.

## HomeAssistant: Waste Collection Schedule integration

The [Waste Collection Schedule](https://github.com/mampfes/hacs_waste_collection_schedule) integration supports iCalendar without requiring any custom parser and provides both a sensor and calendar entity for use in HomeAssistant.

Example configuration:

```yaml
sensor:
  - platform: waste_collection_schedule
    name: Gedling Borough Council bin collection

waste_collection_schedule:
  sources:
    - name: ics
      calendar_title: Gedling Borough Council bin collection
      args:
        url: https://www.gbcbincalendars.co.uk/ical/gedling_borough_council_wednesday_g2_bin_schedule.ics
```

Multiple sources are supported e.g. if you also use the Garden Waste Collection service, you can add another iCalendar source pointing to the garden bin collection for your area.

```yaml
waste_collection_schedule:
  # Wednesday G2 collection
  sources:
    - name: ics
      calendar_title: Gedling Borough Council bin collection
      args:
        url: https://www.gbcbincalendars.co.uk/ical/gedling_borough_council_wednesday_g2_bin_schedule.ics
  # Tuesday B collection      
    - name: ics
      calendar_title: Gedling Borough Council garden waste collection
      args:
        url: https://www.gbcbincalendars.co.uk/ical/gedling_borough_council_tuesday_b_garden_bin_schedule.ics
```

## HomeAssistant: UKBinCollectionData (UKBCD)

The [UK Bin Collection Data](https://github.com/robbrad/UKBinCollectionData) project aims to create a way of providing bin collection data in JSON format from UK councils which have no direct API to do so.

The JSON data generated for each bin collection calendar by this site is used in the UKBCD project to avoid having to statically define or hard code each collection date for the various calendars.

## JSON calendar API

Using the [ical.js library](https://github.com/kewisch/ical.js) all calendars are also available as JSON endpoints, published under: `https://www.gbcbincalendars.co.uk/json/`, with the filename being the same as ical path with the exception of being `.json` instead of `.ical`. E.g. `https://www.gbcbincalendars.co.uk/json/gedling_borough_council_wednesday_g2_bin_schedule.json`.

The HTML calendars are derived from the same JSON data.

## Bin collection API

Using a Cloudflare Worker, an API is available at api.gbcbincalendars.co.uk which provides bin collection schedule identifiers and names for the refuse/recycling and garden waste collections returned. The source of this data is from [Gedling Borough Council directly](https://apps.gedling.gov.uk/refuse/search.aspx). This is the official data source from Gedling, however it lacks any form of API/endpoint. The Cloudflare worker performs searches and scrapes the results to return as JSON.

## Other

Everything within this project is open source and published under the [General Public License GPLv3](LICENSE). You are more than welcome to use any of the data and contents in other software for any purpose.

