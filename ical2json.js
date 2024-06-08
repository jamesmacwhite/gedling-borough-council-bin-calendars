'use strict';

const path = require('path');
const ical2json = require("ical2json");
const jetpack = require("fs-jetpack");
const calendars = jetpack.find("ical", { matching: "*.ics" });
const dest = './json';

// Remove json folder if exists
jetpack.cwd(dest).remove();

// Process each ical file and use ical2json to convert original data and output as JSON file in json folder
calendars.forEach(function(filepath) {
    var convertedJSON = ical2json.convert(jetpack.read(filepath));
    console.log(`Converted ${filepath} to JSON.`);
    jetpack.write(`${dest}/${path.parse(filepath).name}.json`, convertedJSON);
});