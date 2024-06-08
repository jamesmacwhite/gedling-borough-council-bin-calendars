'use strict';
const path = require('path');
const ical2json = require("ical2json");
const jetpack = require("fs-jetpack");
const calendars = jetpack.find("ical", { matching: "*.ics" });
const dest = './json';

jetpack.cwd(dest).remove();

calendars.forEach(function(filepath) {
    console.log(`Converting ${filepath} to JSON.`)
    var convertedJSON = ical2json.convert(jetpack.read(filepath));
    jetpack.write(`./json/${path.parse(filepath).name}.json`, convertedJSON);
});