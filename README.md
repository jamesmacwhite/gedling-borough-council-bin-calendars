# Gedling Borough Council bin collection calendars

As a resident in the Gedling, Nottingham area I like to have the bin collection day in my calendar which can be used by multiple devices as well as home automation. 

It is somewhat annoying that Gedling Borough Council does not provide either a iCal calendar or provide a web interface to view the bin schedule dates in full that can be parsed easily. Instead they offer either a PDF (horrible for accessibility) or the option to subscribe to email alerts which notifies you the day before.

I decided that I would create unofficial calendars of the bin schedule for others to use. I already do this for my own bin schedule (Wednesday G2) but for any other Gedling residents, the others have been converted from the PDF calendar they provide. I have hosted them on GitHub for possible use by others as well as applications.

## Bin schedules

The bin schedules Gedling Borough Council operate are labelled G1 - G4 and occur Monday to Friday. Depending on where you are in the Gedling Borough area, you will have a bin day schedule on a specific weekday.

Gedling Borough Council [have a search tool](https://apps.gedling.gov.uk/refuse/search.aspx) where by you enter your street name and it will provide the correct schedule where you'll also be able to see the day and code being either G1, G2, G3 or G4.

## Calendars

The calendars hosted are named in the format of `gedling_borough_council_[DAY]_[G1-4]_[YEAR]_bin_schedule.ics`. The calendars use a repeating occurrence schedule and end on the last occurrence per the PDF calendar. When a collection day falls on a national holiday, the revised date and time is added as a single occurrence with (Changed Collection) in the title.

The calendar entries are labelled as:

* Black Bin day (also known as grey bin) - For general/domestic waste
* Green Bin day - Recycling
* Green Bin + Glass Box day - Recycling and glass

All bin day events are set as "All day" events. Bin collections generally occur in the morning, but the time can vary.

## Using these calendars

This repostiory hosts all the calendars within the `ical` folder. Using the raw URL of any ics file will provide a URL for either downloading or further parsing.

In addition, various types of home automation can be driven from calendar events too. I won't go into specific concepts or methods, but chances are if you are interested in doing this, you probably have an idea of what to use and the setup.

Te calendar .ics files try to be as minimalist as possible to provide what is needed as a calendar, other systems or integrations are welcome to use the iCal data for other purposes with further parsing and adjustments.

## Original printed calendars

Gedling Borough Council produces the official calendars which are intended to be printed documents. These are also available to be viewed as PDF. The location these documents are hosted is on the `apps.gedling.gov.uk` website within the following path:

```
# Replace [DAY], [CODE] and [YEAR] with relevant data
https://apps.gedling.gov.uk/refuse/data/[DAY][CODE]-[YEAR].pdf

# Example file
https://apps.gedling.gov.uk/refuse/data/MondayG2-2024.pdf
```

This is the original source of data for the calendars.

## Disclaimer

The information and calendars published in this repository are not provided by Gedling Borough Council and are unofficial. While every effort has been made to ensure each calendar is accurate per the official printed calendar document provided by Gedling Borough Council, errors in translating this document into an iCal format is possible. If you spot an error or notice something wrong, please let me know.
