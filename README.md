# Gedling Borough Council bin collection/refuse collection day calendars

As a resident in the Gedling, Nottingham area I like to have the bin collection day in my calendar which can be used by multiple devices as well as home automation. 

It is somewhat annoying that [Gedling Borough Council](https://www.gedling.gov.uk/) does not provide either a iCal calendar or provide a web interface to view the bin schedule dates in full that can be parsed easily. Instead they offer either a PDF (which is horrible for accessibility) or the option to subscribe to email alerts which notifies you the day before.

I decided that I would create unofficial calendars of the bin schedule for others to use. I happened to already do this for my own bin schedule (Wednesday G2) but for any other Gedling residents, all others have been converted from the PDF calendar documents. I have hosted them on GitHub for possible use by others as well as applications.

## Bin collection schedules

There are a total of 20 bin schedules provided by Gedling Borough Council. The bin schedules Gedling Borough Council operate are labelled G1 - G4 and occur Monday to Friday (under normal collection days). Depending on where you are in the Gedling Borough area, you will have a bin day schedule on a specific weekday.

**The schedule of each type of bin collections is:**

* Black Bin - Every 2 weeks
* Green Bin - Every 2 weeks
* Glass Bin - Every 4 weeks

The Green bin collection is combined with the glass bin collection on the same day, although glass is collected separately.

There is also an additional garden bin collection, this however is an extra paid service. Garden waste collections **are not** currently included in the .ics files.

### Finding your bin collection schedule

Gedling Borough Council [have a search tool](https://apps.gedling.gov.uk/refuse/search.aspx) where by you enter your street name and it will provide the correct schedule where you'll also be able to see the day of the week and code being either G1, G2, G3 or G4, this is visible on the PDF calendar, the PDF filename and email subscription URL link. You can use this information to then select the correct calendar that matches your area.

## Calendars

The calendar ICS files are named in the format of `gedling_borough_council_[DAY]_[G1-4]_bin_schedule.ics` for easy identification. The calendars use a repeating occurrence schedule and end on the last occurrence per the PDF calendar. When a collection day falls on a national holiday, the revised date is added as a single occurrence with (Changed Collection) in the title.

**The calendar entries are titled as:**

* Black Bin day (also known as grey bin) - For general/domestic waste collection
* Green Bin day - Recycling collection
* Green Bin + Glass Box day - Recycling and glass collection

All bin day events are set as "All day" events. Bin collections generally occur in the morning, but the time can vary.

## Using these calendars

This repostiory hosts all the calendars within the `ical` folder. Using the raw URL of any ics file will provide a URL for either downloading or further parsing by software.

In addition, various types of home automation can be driven from calendar events too. I won't go into specific concepts or methods, but chances are if you are interested in doing this, you probably have an idea of what to use and the setup required.

The calendar .ics files try to be as minimalist as possible, each event is a simple title with the information available at a glance, other systems or integrations are welcome to use the iCal data for other purposes with further parsing and adjustments.

## Original calendar sources

Gedling Borough Council produces the official calendars which are intended to be printed flyer documents. These are also available to be viewed as a PDF. The location where these documents are hosted is on the `apps.gedling.gov.uk` domain within the following path:

```
# Replace [DAY], [CODE] and [YEAR] with relevant data
https://apps.gedling.gov.uk/refuse/data/[DAY][CODE]-[YEAR].pdf

# Calendar PDF file
https://apps.gedling.gov.uk/refuse/data/MondayG2-2024.pdf
```

These files are the original source of data for the calendars produced.

## How are these calendars generated?

Nothing fancy, the original printed calendars are human translated into a repeated occurrence calendar events, with the exception of changed collection days which are then one-off instances. I use Google Calendar to create them and then download the public .ics calendar file to this repostiory.

## Disclaimer

The information and calendars published in this repository are not provided by Gedling Borough Council and are unofficial. While every effort has been made to ensure each calendar is accurate per the official printed calendar document provided by Gedling Borough Council, errors in translating this document into an iCal format are possible. If you spot an error or notice something wrong, please let me know.

Any bin day collection schedule may be subject to change by Gedling Borough Council and may not reflect the most up to date schedule.
