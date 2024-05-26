# Gedling Borough Council bin collection/refuse collection day calendars

As a resident within the Gedling district in Nottingham, I like to have the bin collection day in my calendar which can be used by multiple devices as well for home automation. 

It is somewhat annoying that [Gedling Borough Council](https://www.gedling.gov.uk/) does not provide either a iCal calendar or API to view the bin schedule dates in full that can be parsed easily. Instead they offer either a PDF (which is horrible for accessibility) or the option to subscribe to email alerts which notifies you the day before.

For a few years now I have created my own calendar for my specific collection schedule (Wednesday G2). After seeing a few other residents wanting to use this data in home automation, I decided to convert all the bin collections into iCal format.

## Bin collection schedules

### General bin collection schedule

There are a total of 20 bin schedules provided by Gedling Borough Council. The bin schedules Gedling Borough Council operate are labelled G1 - G4 and occur Monday to Friday (under normal collection days). Depending on where you are in the Gedling Borough area, you will have a bin day schedule on a specific weekday.

**The schedule of each type of bin collections is:**

* Black Bin - Every 2 weeks
* Green Bin - Every 2 weeks
* Glass Bin - Every 4 weeks

The Green bin collection is combined with the glass bin collection on the same day, although any glass recycling is collected separately.

### Garden waste collection schedule

Gedling Borough Council provide an additional [garden bin collection service](https://www.gedling.gov.uk/rubbish/gardenwaste/), this however is an extra paid service. There are a total of 10 different garden waste collection schedules. Collections are fortnightly (bi-weekly) from April to March (of the following year), with no collections in January and February. For collection weekdays which fall on bank holidays, these collections will be collected on the Saturday before.

### Finding your bin collection schedule

Gedling Borough Council [have a search tool](https://apps.gedling.gov.uk/refuse/search.aspx) where by you enter your street name and it will provide the correct schedule where you'll also be able to see the day of the week and code being either G1, G2, G3 or G4 for your general bin collection (his is visible on the PDF calendar, the PDF filename and email subscription URL link). You can use this information to then select the correct calendar that matches your area.

For garden waste collection, this is labelled as A - J with each letter being assigned to a weekday e.g. Monday A, Wednesday C or Tuesday G.

## Calendars

The calendar ICS files are named in the format of `gedling_borough_council_[DAY]_[G1-4]_bin_schedule.ics` for general bin collection (Black, Green and Glass bin collection) and `gedling_borough_council_[DAY]_[A-J]_garden_bin_schedule.ics` for garden waste collection. The calendars use a repeating occurrence schedule and end on the last occurrence per the PDF calendar. When a collection day falls on a national holiday, the revised date is added as a single occurrence with (Changed Collection) in the title.

**The calendar entries are titled as:**

* Black Bin day (also known as grey bin) - For general/domestic waste collection.
* Green Bin day - Recycling collection.
* Green Bin + Glass Box day - Recycling and glass collection.

This matches the key used on the printed calendar versions.

All bin day events are set as "All day" events. Bin collections generally occur in the morning, but the time can vary.

## Using these calendars

This repostiory hosts all the calendars within the `ical` folder. Using the raw URL of any ics file will provide a URL for either downloading or further parsing by software.

In addition, various types of home automation can be driven from calendar events too. One example is the [Waste Collection Schedule](https://github.com/mampfes/hacs_waste_collection_schedule) integration. I won't go into specific concepts or methods, but chances are if you are interested in using this data, you probably have an idea of what to use and the setup required.

The calendar .ics files try to be as minimalist as possible, each event is a simple title with the information available at a glance, other systems or integrations are welcome to use the iCal data for other purposes with further parsing and adjustments.

## Original calendar sources

Gedling Borough Council produces the official calendars which are intended to be printed flyer documents. These are also available to be viewed as a PDF. The location where these documents are hosted is on the `apps.gedling.gov.uk` domain within the following paths below.

Replace `[DAY]`, `[CODE]` and `[YEAR]` with relevant data.

```
# Example bin collection calendar path
https://apps.gedling.gov.uk/refuse/data/[DAY][CODE]-[YEAR].pdf
```

Replace `[DAY]`, `[CODE]` and `[YEAR]` with relevant data.

An example file stored on this server for the Monday G2 2024 (2023/24) calendar:

```
https://apps.gedling.gov.uk/refuse/data/MondayG2-2024.pdf
```

Replace the `[LETTER]` and `[YEAR]` for garden waste collection.

```
# Example garden waste collection calendar path
https://apps.gedling.gov.uk/GDW/Rounds/data/Garden%20Waste%20[LETTER]-[YEAR].pdf

# Calendar PDF file
https://apps.gedling.gov.uk/GDW/Rounds/data/Garden%20Waste%20J-2024.pdf
```

These files are the original source of data for the calendars produced.

## How are these calendars generated?

Nothing fancy. the original printed calendars are human translated into a repeated calendar occurrence events, with the exception of changed collection days which are then one-off instances. I use Google Calendar to create them and then download the public .ics calendar file to this repostiory. The data shouldn't change, given the documents are printed and set for the year.

## Disclaimer

The information and calendars published in this repository are not directly provided by Gedling Borough Council and hence this is an unofficial source. While every effort has been made to ensure each calendar is accurate per the official printed calendar document provided by Gedling Borough Council, errors in translating this document into an iCal format are possible. If you spot an error or notice something wrong, please let me know.

Any bin day collection schedule may be subject to change by Gedling Borough Council at any time.
