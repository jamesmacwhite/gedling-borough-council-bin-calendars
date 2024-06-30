'use strict';

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
    let collectionDates = calendar.collectionDates;
    let calendarType = calendar.collectionType;

    // Set the minimum collection to lower as garden bin has less collections
    if (calendarType === 'Garden') {
      expectedCollectionsMin = 21;
      expectedCollectionsMax = expectedCollectionsMin;
    }

    // Check for calendar name value
    it(`${calendar.filename} name is not null`, function() {
      assert.isNotNull(calendar.name, 'Calendar is missing name value.');
    });

    // Check for calendar description value
    it(`${calendar.filename} description is not null`, function() {
      assert.isNotNull(calendar.description, 'Calendar is missing description value.');
    });

    // Check the total amount of collection dates does not exceed the expected minimum
    it(`${calendar.filename} total ${calendarType.toLowerCase()} collection dates matches minimum expected count`, function() {
      assert.isAtLeast(totalCalendarCollections, expectedCollectionsMin, 'Total collection dates is lower than the expected minimum.');
    });

    // Check the total amoint of collections dates does not exceed the expected maximum
    it(`${calendar.filename} total ${calendarType.toLowerCase()} collection dates does not exceed maximum`, function() {
      assert.isAtMost(totalCalendarCollections, expectedCollectionsMax, 'Total collection dates exceeds expected count.');
    });

    // Validate collection dates
    describe(`${calendar.filename} collection dates validation`, function() {
      collectionDates.forEach((item) => {
        // Check summary value to ensure consistency
        it(`${calendar.filename} check ${item.collectionDate} name is valid`, function() {
          assert.include(validSummaryTitles, item.name, 'An invalid summary value has been used.');
        });

        // Check any changed collection is a single occurrence, not part of a repeating schedule
        it(`${calendar.filename} check ${item.collectionDate} for occurrence mismatch`, function() {
          assert.isNotTrue(item.isOccurrence && item.isChangedCollection, 'A single occurrence is part of a recurring rule.');
        });

        // Ensure the weekday only differs when the collection is a changed collection date
        it(`${calendar.filename} check ${item.collectionDate} for weekday conflict`, function() {
          assert.isNotTrue(calendar.weekday === item.weekday && item.isChangedCollection, 'The same weekday is set for an event which is a changed collection.');
        });

        // Ensure type key is not "Unknown"
        it(`${calendar.filename} check ${item.collectionDate} type is not unknown`, function() {
          assert.notStrictEqual(item.type, 'Unknown', 'Bin type collection key is "Unknown".');
        });
      });
    });
  });
});

