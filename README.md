# Gedling Borough Council bin collection calendars

As a resident in the Gedling, Nottingham area I like to have the bin collection day in my calendar which can be used by multiple devices as well as home automation. 

It is somewhat annoying that Gedling Borough Council does not provide either a iCal calendar or provide a web interface to view the bin schedule dates in full that can be parsed easily. Instead they offer either a PDF (horrible for accessibility) or the option to subscribe to email alerts which notifies you the day before.

I decided that I would create unofficial calendars of the bin schedule for others to use. I already do this for my own bin schedule (Wednesday G2) but for any other Gedling residents, the others have been converted from the PDF calendar they provide. I have hosted them on GitHub for possible use by others as well as applications.

## Bin schedules

The bin schedules Gedling Borough Council operate are labelled G1 - G4 and occur Monday to Friday. Depending on where you are in the Gedling Borough area, you will have a bin day schedule on a specific weekday.

Gedling Borough Council [have a search tool](https://apps.gedling.gov.uk/refuse/search.aspx) where by you enter your street name and it will provide the correct schedule where you'll also be able to see the day and code being either G1, G2, G3 or G4.

## Calendars

The calendars hosted are labelled in the format of `gedling_borough_council_[DAY]_[G1-4]_[YEAR]_bin_schedule.ics`. The calendars use a repeating occurrence schedule and end on the last occurrence per the PDF calendar. When a collection day falls on a national holiday, the revised date and time is added as a single occurrence with (Changed Collection) in the title.

The calendar entries are labelled as:

* Black Bin day (also known as grey bin) - For general/domestic waste
* Green Bin day - Recycling
* Green Bin + Glass Box day - Recycling and glass
