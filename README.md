![Gedling Borough Council](assets/images/gedling-council-logo.jpg)

# Gedling Borough Council bin collection/refuse collection day calendars

As a resident within the Gedling district in Nottingham, I like to have the bin collection day in my calendar which can be used by multiple devices as well for home automation. 

It is somewhat frustrating that [Gedling Borough Council](https://www.gedling.gov.uk/) does not provide either a iCal calendar or API to view the bin schedule dates in full that can be parsed easily. Instead they offer either a PDF (which is horrible for accessibility) or the option to subscribe to email alerts which notifies you the day before but no way to have the entire schedule in a usable open format.

For a few years now I had always created my own calendar for my specific collection schedule (Wednesday G2). After seeing a few other residents wanting to use this data in home automation, I started this project with the original intention of providing all the bin collections in the iCal format, this then expanded to going further by providing HTML for better accessibility as well as JSON for other software to leverage a consistent API for using the data too.

## Gedling bin collection schedules

If you are a new resident or are unsure of how the bin schedules work, they are explained below.

### Finding your bin collection schedule

Gedling Borough Council has a search tool to provide either a PDF or email subscribe URL for you bin collection, however this project provides an [alternative API/search tool](https://www.gbcbincalendars.co.uk/collection-search) which takes the Gedling Borough Council data and formats the origin data into a improved data structure providing clearer information. You can enter your street name and it will provide the correct calendar link directly.

### Refuse/recycling

There are a total of 20 bin schedules provided by Gedling Borough Council (who knew there were that many?!). The bin schedules Gedling Borough Council operate are labelled G1 - G4 and occur Monday to Friday (under normal collection days). Depending on where you are in the Gedling Borough area, you will have a bin day schedule on a specific weekday labelled as G1, G2, G3 or G4.

**The schedule of each type of bin collections is:**

* Black Bin - Every 2 weeks
* Green Bin - Every 2 weeks
* Glass Bin - Every 4 weeks

The Green bin collection is combined with the glass bin collection and occurs on same day, although any glass recycling is collected separately.

### Garden waste collection schedule

Gedling Borough Council provide an additional [garden bin collection service](https://www.gedling.gov.uk/rubbish/gardenwaste/), this however is an extra paid service. There are a total of 10 different garden waste collection schedules. Collections are fortnightly (bi-weekly) from April to March (of the following year), with no collections in January and February. For collection weekdays which fall on bank holidays, these collections will be collected on the Saturday before.

For garden waste collection, this is labelled as A - J with each letter being assigned to a weekday.

* Monday - A or F
* Tuesday - B or G
* Wednesday - C or H
* Thursday - D or I
* Friday - E or J

Once you know your specific schedule, you can [find all calendars](https://www.gbcbincalendars.co.uk) available in HTML, iCal and JSON.

## Calendars

The iCalendar files are named in the format of: 

* `gedling_borough_council_[day]_[g1-4]_bin_schedule.ics` for general bin collection (Black, Green and Glass bin collection)
* `gedling_borough_council_[day]_[a-j]_garden_bin_schedule.ics` for garden waste collection. 

**The calendar entries are titled as:**

* Black Bin Day (also known as grey bin) - For general/domestic waste collection.
* Green Bin Day - Recycling collection.
* Green Bin + Glass Box Day - Recycling and glass collection.
* Garden Waste Collection - Extra garden waste collection service.

When a collection day falls on a national holiday i.e. Bank holiday, the revised date is added as a single occurrence with (Changed Collection) in the title to denote this.

The iCal calendars try to match the PDF document versions as closely as possible.

All bin day events are set as "All day" events. Bin collections generally occur in the morning, but the time can vary.

## Using these calendars

This repository hosts all the calendars within the `ical` folder. For easier visibility of all calendars in a logical order and having a public iCal URL to subscribe to, view the [GitHub pages site](https://www.gbcbincalendars.co.uk). All calendars are also available in HTML and JSON formats.

The calendar files are updated yearly overwriting the previous year, this is to maintain a consistent URL path for other software and a dynamic iCal subscribe URL.

## Original calendar sources

Gedling Borough Council produces the official calendars which were originally intended to be printed flyer documents. Gedling Borough Council no longer prints these document due to cost and sustainability. These are also available to be viewed as a PDF but this format is not very accessible. The location where these documents are hosted is on the `apps.gedling.gov.uk` domain within the following paths below. I don't believe there's a specific page that provides all of the PDF files in a single place, but with some file path snooping reveals the following naming convention to find them.

If you wanted to view the original source documents, you can find all of the PDF files following the instructions below.

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

These files are the original source of data for the calendars produced.

## How are these calendars generated?

The original printed calendars are human translated into a recurring calendar events using RRULE, with the exception of changed collection days which are created as one-off VEVENT instances. Each calendar is exported in the iCal format and is the primary source data.

Using the excellent [ical.js](https://github.com/kewisch/ical.js) and wrapper library [ical-expander](https://www.npmjs.com/package/ical-expander). The iCal data is expanded to have all instances of collection dates represented in JSON. These are automatically built on any update to the iCal data.

## Disclaimer

The information and calendars published in this repository are not directly provided by Gedling Borough Council and hence this is an unofficial source. While every effort has been made to ensure each calendar is accurate per the official printed calendar document provided by Gedling Borough Council, errors in translating this document into an iCal format are possible.

A combination of human checks and [unit tests](test/json-calendar-validation.js) are performed when the iCalendar files are converted into JSON. These tests validate the calendar data by using various rules and known pattern/occurrence rules that should always be present, which aims to reduce the chance of errors.

Any bin day collection schedule is also subject to change by Gedling Borough Council at any time. While this is unlikely, it is possible.

If you spot an error or notice something wrong, please let me know.
