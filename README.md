![Gedling Borough Council](assets/images/gedling-council-logo.jpg)

# Gedling Borough Council bin collection/refuse collection day calendars

As a resident within the Gedling district in Nottingham, I like to have the bin collection day in my calendar which can be used by multiple devices as well for home automation. 

For a few years now I had always created my own calendar for my specific collection schedule (Wednesday G2). After seeing a few other residents wanting to use this data in home automation, I started this project with the original intention of providing all the bin collections in the iCal format, this then expanded to going further by providing HTML for better website accessibility as well as JSON for other software to leverage a consistent API for using the data too.

More recently Gedling Borough Council implemented a [new bin collection day search and calendar tool](https://waste.digital.gedling.gov.uk/w/webpage/bin-collections) which replaced the non-accessible PDFs, improving accessibility, however their new collection system still lacks any proper API to obtain the data for programmatic usage, which is one of the main reasons behind this project.

## Gedling bin collection schedules

If you are a new resident or are unsure of how the bin schedules work, they are explained below.

### Finding your bin collection calendar

Gedling Borough Council has a more accessible search tool available on the [bin collections page](https://waste.digital.gedling.gov.uk/w/webpage/bin-collections) which uses an autocomplete address search to select a specific full address with postcode. This provides a yearly calendar page, allowing you to view the full calendar data. A URL with a unique hash and tokens are provided, allowing use you bookmark or re-use the URL.

The legacy [refuse collection days](https://apps.gedling.gov.uk/refuse/search.aspx) search exists which maps street addresses to the specific schedule name e.g. Monday G1. This project was originally designed around this model, as it was how the PDF calendars were structured. The legacy search system is likely to be removed in the future and the specific schedule name is no longer displayed in the newer data, however the general schedule model likely remains valid.

This project uses its own [API to proxy requests](https://github.com/jamesmacwhite/gedling-borough-council-bin-calendars/blob/main/API.md) and return data from both systems which can be used by other projects or applications interested in using the data.

### Refuse/recycling/glass

There are a total of 20 bin schedules provided by Gedling Borough Council (who knew there were that many?!). The bin schedules Gedling Borough Council operate are labelled G1 - G4 and occur Monday to Friday (under normal collection days). Depending on where you are in the Gedling Borough area, you will have a bin day schedule on a specific weekday labelled as G1, G2, G3 or G4.

**The schedule of each type of bin collections is:**

* Black Bin - Every 2 weeks
* Green Bin - Every 2 weeks
* Glass Bin - Every 4 weeks

The Green bin collection is combined with the glass bin collection and occurs on same day, although any glass recycling is collected separately.

Since 2025/26 it is no longer possible to directly see the specific schedule name for your address under the newer system. Using the previous dataset from the legacy refuse search system, the following address lookups are samples to map against.

| Schedule name  | Sample address search |
|----------------|-----------------------|
| Monday G1      | Broad Valley Drive    |
| Monday G2      | Roundwood Road        |
| Monday G3      | Newman Road           |
| Monday G4      | Oakwood Drive         |
| Tuesday G1     | Valetta Road          |
| Tuesday G2     | Acton Road            |
| Tuesday G3     | Sunbury Gardens       |
| Tuesday G4     | Ballantrae Close      |
| Wednesday G1   | Weaverthorpe Road     |
| Wednesday G2   | Charnwood Lane        |
| Wednesday G3   | Woodthorpe Avenue     |
| Wednesday G4   | Blenheim Avenue       |
| Thursday G1    | Beaumaris Drive       |
| Thursday G2    | Mays Close            |
| Thursday G3    | Martins Hill          |
| Thursday G4    | Cromford Avenue       |
| Friday G1      | Midland Road          |
| Friday G2      | Nether Pasture        |	
| Friday G3      | Adbolton Avenue       |
| Friday G4      | Acorn Drive           |

### Garden waste collection schedule

Gedling Borough Council provide an additional [garden bin collection service](https://www.gedling.gov.uk/rubbish/gardenwaste/), this however is an extra paid service. There are a total of 10 different garden waste collection schedules. Collections are fortnightly (bi-weekly) from April to March (of the following year), with no collections in January and February. For collection weekdays which fall on bank holidays, these collections will be collected on the Saturday before.

For garden waste collection, this is labelled as A - J with each letter being assigned to a weekday.

* Monday - A or F
* Tuesday - B or G
* Wednesday - C or H
* Thursday - D or I
* Friday - E or J

| Schedule name  | Sample address search |
|----------------|-----------------------|
| Monday A       | Broad Valley Drive    |
| Tuesday B      | Valetta Road          |
| Wednesday C    | Oakwood Drive         | 
| Thursday D     | Roundwood Road        |
| Friday E       | Nether Pasture        |
| Monday F       | Cromford Avenue       | 
| Tuesday G      | Midland Road          |
| Wednesday H    | Newman Road           |
| Thursday I     | Acorn Drive           |
| Friday J       | Woodside Road         |

Once you know your specific schedule, you can [find all calendars](https://www.gbcbincalendars.co.uk) available in HTML, iCal and JSON.

## Calendars

The iCalendar files are named in the format of: 

* `gedling_borough_council_[day]_[g1-4]_bin_schedule.ics` for general bin collection (Black, Green and Glass bin collection)
* `gedling_borough_council_[day]_[a-j]_garden_bin_schedule.ics` for garden waste collection. 

**The calendar entries are titled as:**

* Black Bin Day (also known as grey bin) - For general/domestic waste collection.
* Green Bin Day - Recycling collection.
* Green Bin + Glass Box Day - Recycling and glass box as a combined collection.
* Glass Box Day - Glass collection only.
* Garden Waste Collection - Extra garden waste collection service.

When a collection day falls on a national holiday i.e. Bank holiday, the revised date is added as a single occurrence with (Changed Collection) in the title to denote this.

The iCal calendar entries aim to replicate the original PDF document versions as closely as possible.

All bin day events are set as "All day" events. Bin collections generally occur in the morning, but the time can vary.

## Using these calendars

This repository hosts all the calendars within the `ical` folder. For easier visibility of all calendars in a logical order and having a public iCal URL to subscribe to, view the [GitHub pages site](https://www.gbcbincalendars.co.uk). All calendars are also available in HTML and JSON formats.

The calendar files are updated yearly overwriting the previous year, this is to maintain a consistent URL path for other software and a dynamic iCal subscribe URL.

## PDF calendar sources (legacy)

Gedling Borough Council used to produce PDF calendars which were originally flyers posted to each residental address in the Gedling borough area. Gedling Borough Council no longer prints these documents due to cost and sustainability and since 2025/26 no longer produces the PDFs at all. The location where older documents are hosted is on the `apps.gedling.gov.uk` domain within the following paths below.

You can find all of the older PDF files following the instructions below.

### General bin collection PDFs

Replace `[DAY]`, `[CODE]` and `[YEAR]` with relevant data.

```
https://apps.gedling.gov.uk/refuse/data/[DAY][CODE]-[YEAR].pdf
```

An example file stored on this server for the Monday G2 2024 (2024/25) calendar:

```
https://apps.gedling.gov.uk/refuse/data/MondayG2-2025.pdf
```

### Garden waste collection PDFs

Replace the `[LETTER]` and `[YEAR]` for garden waste collection.

```
https://apps.gedling.gov.uk/GDW/Rounds/data/Garden%20Waste%20[LETTER]-[YEAR].pdf
```

An example file stored on this server for the Friday J 2025/26 garden waste collection calendar:

```
https://apps.gedling.gov.uk/GDW/Rounds/data/Garden%20Waste%20J-2025.pdf
```

## How are these calendars generated?

The calendar data from Gedling is translated into a recurring calendar events using RRULE, with the exception of changed collection days which are created as one-off VEVENT instances. Each calendar is exported in the iCal format and is the primary source data.

Using the excellent [ical.js](https://github.com/kewisch/ical.js) and wrapper library [ical-expander](https://www.npmjs.com/package/ical-expander). The iCal data is expanded to have all instances of collection dates represented in JSON. These are automatically built on any update to the iCal data.

## Disclaimer

The information and calendars published in this repository are not directly provided by Gedling Borough Council and hence this is an unofficial source. While every effort has been made to ensure each calendar is accurate per the official data provided by Gedling Borough Council, errors in translating into the iCal format are possible.

A combination of human checks and [unit tests](test/json-calendar-validation.js) are performed when the iCalendar files are converted into JSON. These tests validate the calendar data by using various rules and known pattern/occurrence rules that should always be present, which aims to reduce the chance of errors.

Any bin day collection schedule is also subject to change by Gedling Borough Council at any time.

If you spot an error or notice something wrong, please let me know.
