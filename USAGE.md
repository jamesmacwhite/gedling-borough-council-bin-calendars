# Using the calendars

All bin collection calendars are published in several formats, designed to be more accessible and in open data formats for use by both residents of Gedling and other software.

## HTML calendars

All calendars are [available to be viewed as HTML](https://www.gbcbincalendars.co.uk). You can view all calendars through this website.

## Importing to a calendar

You can import any calendar as a static one time import or subscribe using the iCal URL for a dynamic calendar URL, an example iCal URL for the Wednesday G2 bin collection:

```
https://www.gbcbincalendars.co.uk/ical/gedling_borough_council_wednesday_g2_bin_schedule.ics
```

The .ics files have been tested with multiple calendar software applications to ensure compatibility.

[A GitHub pages site](https://www.gbcbincalendars.co.uk) exists to display all calendars in a logical structure offering the .ics calendar for each schedule available to download or the iCal subscribe URL to use in any calendar software to automatically receive yearly updates.

## Calendar data as JSON

Using the [ical.js library](https://github.com/kewisch/ical.js) all calendars are also available as JSON data, published under: `https://www.gbcbincalendars.co.uk/json/`, with the filename being the same as ical path with the exception of being `.json` instead of `.ics`. E.g. `https://www.gbcbincalendars.co.uk/json/gedling_borough_council_wednesday_g2_bin_schedule.json`.

The HTML calendars are derived from the same JSON data. You can find further [documentation about the JSON endpoints](https://www.gbcbincalendars.co.uk/json-endpoints) on the GitHub pages site.

## HomeAssistant: HACS Waste Collection Schedule integration

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
  # Refuse/Recyling Wednesday G2 collection
  sources:
    - name: ics
      calendar_title: Gedling Borough Council bin collection
      args:
        url: https://www.gbcbincalendars.co.uk/ical/gedling_borough_council_wednesday_g2_bin_schedule.ics
  # Garden Tuesday B collection      
    - name: ics
      calendar_title: Gedling Borough Council garden waste collection
      args:
        url: https://www.gbcbincalendars.co.uk/ical/gedling_borough_council_tuesday_b_garden_bin_schedule.ics
```

The HACS Waste Collection Schedule integration also supports parsing another widely used project [UK Bin Collection Data (UKBCD)](https://github.com/mampfes/hacs_waste_collection_schedule/blob/master/doc/source/ukbcd.md).

## HomeAssistant: UKBinCollectionData (UKBCD)

The [UK Bin Collection Data](https://github.com/robbrad/UKBinCollectionData) project aims to create a way of providing bin collection data in JSON format from UK councils which have no direct API to do so.

The JSON API data provided for each bin collection calendar by this project is directly used for the [GedlingBoroughCouncil.py parser](https://github.com/robbrad/UKBinCollectionData/blob/master/uk_bin_collection/uk_bin_collection/councils/GedlingBoroughCouncil.py) in the UKBCD project.

## Open bin collection street search API

Using a Cloudflare Worker, an API is available at api.gbcbincalendars.co.uk which provides bin collection search, using street name values. The source of this data is from [Gedling Borough Council directly](https://apps.gedling.gov.uk/refuse/search.aspx). This is the only official data source from Gedling, however it lacks any form of usable API/endpoint. The Cloudflare worker performs searches and scrapes the results to return as JSON. You can read more about this on the [API docs](API.md).

## Other use cases

Everything within this project is open source and published under the [General Public License GPLv3](LICENSE). If you are using the data from this project in other software or applications, I'd love to hear about it!

