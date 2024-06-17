# Usage

The bin calendars are published in several formats, designed to be more accessible and in open data formats for wider usage.

## HTML calendars

All calendars are [available to be viewed as HTML](https://www.gbcbincalendars.co.uk) using the "View calendar" button for each schedule, each schedule has its own permalink to bookmark or refer to as required.

## Importing to a calendar

You can import the calendar events locally or subscribe using the calendar endpoint URLs, an example for the Wednesday G2 bin collection:

```
https://www.gbcbincalendars.co.uk/ical/gedling_borough_council_wednesday_g2_bin_schedule.ics
```

The .ics files have been tested with multiple calendar software applications to ensure compatibility.

[A GitHub pages site](https://www.gbcbincalendars.co.uk) exists to display all calendars in a logical order offering the .ics calendar for each schedule available to download and the iCal subscribe URL to use in any calendar software to automatically receive updates.

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

Multiple sources are supported e.g. if you also use the Garden Waste Collection service, you can add another .ics source pointing to the garden bin collection for your area.

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

## JSON

Using the [ical.js library](https://github.com/kewisch/ical.js) all calendars are also available as JSON endpoints, published under: `https://www.gbcbincalendars.co.uk/json/`, with the filename being the same as ical path with the exception of being `.json` instead of `.ical`. E.g. `https://www.gbcbincalendars.co.uk/json/gedling_borough_council_wednesday_g2_bin_schedule.json`.

The HTML calendars are derived from the same JSON data.

## Other

Everything within this project is open source and published under the [General Public License GPLv3](LICENSE). You are more than welcome to use any of the data and contents in other software for any purpose.

