# Usage

## Importing to a calendar

Being iCal formatted calendars, you can import the calendar events or subscribe using the raw URLs, an example for the Wednesday G2 bin collection:

```
https://raw.githubusercontent.com/jamesmacwhite/gedling-borough-council-bin-calendars/main/ical/gedling_borough_council_wednesday_g2_bin_schedule.ics
```

The .ics files have been tested with mutiple calendar software applications to ensure compatibility. Ensure you are using the raw URL i.e. https://raw.githubusercontent.com if using the URL option.

[A GitHub pages site](https://jamesmacwhite.github.io/gedling-borough-council-bin-calendars/) exists to display all calendars in a logical order and to make it easier to display them all.

## HomeAssistant: Waste Collection Schedule integration

The [Waste Collection Schedule](https://github.com/mampfes/hacs_waste_collection_schedule) integration supports .ics formatted calendars and provides both a sensor and calendar entity for use in HomeAssistant.

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
        url: https://raw.githubusercontent.com/jamesmacwhite/gedling-borough-council-bin-calendars/main/ical/gedling_borough_council_wednesday_g2_bin_schedule.ics
```

Multiple sources are supported e.g. if you also use the Garden Waste Collection service, you can add another .ics source pointing to the garden bin collection for your area.

```yaml
waste_collection_schedule:
  # Wednesday G2 collection
  sources:
    - name: ics
      calendar_title: Gedling Borough Council bin collection
      args:
        url: https://raw.githubusercontent.com/jamesmacwhite/gedling-borough-council-bin-calendars/main/ical/gedling_borough_council_wednesday_g2_bin_schedule.ics
  # Friday E collection      
    - name: ics
      calendar_title: Gedling Borough Council garden waste colleciton
      args:
        url: https://raw.githubusercontent.com/jamesmacwhite/gedling-borough-council-bin-calendars/main/ical/gedling_borough_council_friday_e_garden_bin_schedule.ics
```

## Other software

The .ics files are available to use by other software. They are structured in a open format (iCal) and anyone is welcome to use them for any purpose desired.

