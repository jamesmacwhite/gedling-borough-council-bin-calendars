'use strict';

const _ = require('lodash');
const fs = require('fs');
const jsonFolder = './json';
const assert = require('chai').assert;

// Valid event summary values to check against
const validSummaryTitles = [
  'Black Bin Day', 
  'Green Bin Day', 
  'Green Bin + Glass Box Day', 
  'Garden Waste Collection',
  'Black Bin Day (Changed Collection)',
  'Green Bin Day (Changed Collection)', 
  'Green Bin + Glass Box Day (Changed Collection)', 
  'Garden Waste Collection (Changed Collection)',
];

let jsonData = [];

describe('Directory test', function() {
  it('Check to see if JSON folder exists', function() {
    assert.isOk(fs.existsSync(jsonFolder));
  });
});

// Get all JSON data to validate
fs.readdirSync(jsonFolder).forEach(file => {
    let jsonFile = JSON.parse(fs.readFileSync(`${jsonFolder}/${file}`));
    jsonData.push(jsonFile);
});

// Total calendars should be 30. 20 refuse and 10 garden calendars
describe('JSON files output check', function() {
  it('Check correct amount of JSON files have been written.', function() {
    assert.strictEqual(jsonData.length, 30);
  });
});

// Validate the data present in each calendar
describe('JSON calendar validation', function() {
  jsonData.forEach((calendar) => {

    let totalCalendarCollections = calendar.totalCollections;
    let expectedCollectionsMin = 52;
    let expectedCollectionsMax = expectedCollectionsMin + 1;
    let expectedCollectionsInMonthMin = 4;
    let expectedCollectionsInMonthMax = expectedCollectionsInMonthMin + 1;
    let collectionDates = calendar.collectionDates;
    let calendarType = calendar.collectionType;

    // Set test values to be different for garden calendars
    if (calendarType === 'Garden') {
      expectedCollectionsMin = 21;
      expectedCollectionsMax = expectedCollectionsMin;
      expectedCollectionsInMonthMin = 1;
      expectedCollectionsInMonthMax = expectedCollectionsInMonthMin + 2;
    }

    // Check for calendar name value
    it(`${calendar.filename} name is not null`, function() {
      assert.isNotNull(calendar.name, 'Calendar is missing name value.');
    });

    // Check for calendar description value
    it(`${calendar.name} description is not null`, function() {
      assert.isNotNull(calendar.description, 'Calendar is missing description value.');
    });

    // Check the total amount of collection dates does not exceed the expected minimum
    it(`${calendar.name} total ${calendarType.toLowerCase()} collection dates matches minimum expected count`, function() {
      assert.isAtLeast(totalCalendarCollections, expectedCollectionsMin, 'Total collection dates is lower than the expected minimum.');
    });

    // Check the total amount of collections dates does not exceed the expected maximum
    it(`${calendar.name} total ${calendarType.toLowerCase()} collection dates does not exceed maximum`, function() {
      assert.isAtMost(totalCalendarCollections, expectedCollectionsMax, 'Total collection dates exceeds expected count.');
    });

    // Validate collection dates
    describe(`${calendar.name} collection dates validation`, function() {

      let collectionDatesByMonth = _.groupBy(collectionDates, (item) => item.collectionDate.substring(0, 7));
      
      for (const month in collectionDatesByMonth) {

        const datesInMonth = collectionDatesByMonth[month];

        it(`${calendar.name} check ${month} contains minimum amount of dates expected`, function() {
          assert.isAtLeast(datesInMonth.length, expectedCollectionsInMonthMin, `${month} did not contain minimum amount of collections expected.`);
        });

        it(`${calendar.name} check ${month} contains maximum amount of dates expected`, function() {
          assert.isAtMost(datesInMonth.length, expectedCollectionsInMonthMax, `${month} contains more than the maximum amount of collections expected.`);
        });
      }

      collectionDates.forEach((item) => {
        // Check summary value to ensure consistency
        it(`${calendar.name} check collection date: ${item.collectionDate} summary value is valid`, function() {
          assert.include(validSummaryTitles, item.name, 'An invalid summary value has been used.');
        });

        // Check any changed collection is a single occurrence, not part of a repeating schedule
        it(`${calendar.name} check collection date: ${item.collectionDate} for occurrence mismatch`, function() {
          assert.isNotTrue(item.isOccurrence && item.isChangedCollection, 'A single occurrence is part of a recurring rule.');
        });

        // Ensure the weekday only differs when the collection is a changed collection date
        it(`${calendar.name} check collection date: ${item.collectionDate} for weekday conflict`, function() {
          assert.isNotTrue(calendar.weekday === item.weekday && item.isChangedCollection, 'The same weekday is set for an event which is a changed collection.');
        });

        // Ensure type key is not "Unknown"
        it(`${calendar.name} check collection date: ${item.collectionDate} type is not unknown`, function() {
          assert.notStrictEqual(item.type, 'Unknown', 'Bin type collection key is "Unknown".');
        });

        // Ensure any single event is a changed collection
        it(`${calendar.name} check collection date: ${item.collectionDate} has changed collection identifier in summary value if not an occurrence.`, function() {
          assert.isNotTrue(item.isChangedCollection && !item.name.includes('Changed Collection'), 'A single event does not identify as a changed collection in the summary value.');
        });
      });
    });
  });
});

