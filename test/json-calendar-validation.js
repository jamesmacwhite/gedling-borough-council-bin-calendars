import fs from 'fs';
import jetpack from 'fs-jetpack';
import groupBy from 'lodash-es/groupBy.js'
import { assert } from 'chai';
const jsonFolder = './json';

// Valid event summary values to check against
const validSummaryTitles = [
  'Black Bin Day', 
  'Green Bin Day', 
  'Green Bin + Glass Box Day',
  'Glass Box Day',
  'Garden Waste Collection',
  'Black Bin Day (Changed Collection)',
  'Green Bin Day (Changed Collection)', 
  'Green Bin + Glass Box Day (Changed Collection)', 
  'Garden Waste Collection (Changed Collection)',
];

let jsonData = [];

describe('Directory test', function() {
  it('Check to see if JSON folder exists', function() {
    assert.isOk(jetpack.exists(jsonFolder));
  });
});

// Get all JSON data to validate
fs.readdirSync(jsonFolder).forEach(file => {
    const filepath = `${jsonFolder}/${file}`;
    const size = jetpack.inspect(filepath).size / 1024;

    describe('JSON filesize', function() {
      it(`Check filesize of ${file} is below 14 KB`, function() {
        assert.isAtMost(parseFloat(size.toFixed(2)), 14, 'JSON filesize exceeds 14 KB.');
      });
    });

    let jsonFile = jetpack.read(filepath, 'json');
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

    let calendarType = calendar.collectionType;
    let isGardenCollectionType = calendarType === 'Garden';
    // Total collection dates should always be 21 for garden bin but can be 52 or 53 for refuse
    let expectedCollectionsMin = isGardenCollectionType ? 21 : 52;
    // Maximum collection dates is always 21, but could be 53 for some collection calendars
    let expectedCollectionsMax = expectedCollectionsMin + 1;
    // Minimum collection dates in a month is 1 for garden bin but 4 for refuse
    let expectedCollectionsInMonthMin = isGardenCollectionType ? 1 : 4;
    // Maximum collection dates in a month is 3 for garden bin but 6 for refuse
    let expectedCollectionsInMonthMax = expectedCollectionsInMonthMin + 2;
    let collectionDates = calendar.collectionDates;
    let totalCalendarCollections = calendar.totalCollections;

    // Check for calendar name value
    it(`${calendar.filename} name is not null`, function() {
      assert.isNotNull(calendar.name, 'Calendar is missing name value.');
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

      let collectionDatesByMonth = groupBy(collectionDates, (item) => item.collectionDate.substring(0, 7));
      
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
          assert.isNotTrue(item.isChangedCollection && !item.name.includes('Changed Collection') && !item.name.includes('Glass Box Day'), 'A single event does not identify as a changed collection in the summary value.');
        });
      });
    });
  });
});

