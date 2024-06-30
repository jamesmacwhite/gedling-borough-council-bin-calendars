'use strict';

const fs = require('fs');
const jsonFolder = './json';
const assert = require('chai').assert
let jsonData = [];

// Get all JSON data to validate
fs.readdirSync(jsonFolder).forEach(file => {
    let jsonFile = JSON.parse(fs.readFileSync(`${jsonFolder}/${file}`));
    jsonData.push(jsonFile);
});

// Total calendars should be 30. 20 refuse and 10 garden calendars
describe('JSON files output check', function() {
  it('Check correct amount of JSON files have been written.', function() {
    assert.equal(jsonData.length, 30);
  });
});

// Validate the data present in each calendar
describe('ical2js calendar validation', function() {
  jsonData.forEach((calendar) => {

    let expectedCollectionsMin = 52;

    if (calendar.collectionType === 'Garden') {
      expectedCollectionsMin = 21;
    }

    it(`Validate calendar ${calendar.filename}`, function() {
      assert.isNotNull(calendar.name, 'Calendar is missing name value.');
      assert.isNotNull(calendar.description, 'Calendar is missing description value');
      assert.isAtLeast(calendar.totalCollections, expectedCollectionsMin, 'Total collection dates is lower than the expected minimum.');
    });

  });
});

