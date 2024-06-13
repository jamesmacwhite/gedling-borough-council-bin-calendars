'use strict';

const path = require('path');
const ical2json = require("ical2json");
const jetpack = require("fs-jetpack");
const calendars = jetpack.find("ical", { matching: "*.ics" });
const jsonDest = './json';
const bootstrapJsBundle = './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

if(!jetpack.exists(bootstrapJsBundle)) {
    console.error('node_modules Bootstrap JS bundle does not exist.');
    process.exit(1);
}

console.log('Copying Bootstrap JS bundle from node_modules...');
jetpack.copy(bootstrapJsBundle, "./assets/js/bootstrap.bundle.min.js", { overwrite: true });

// Remove json folder if exists
jetpack.cwd(jsonDest).remove();

// Process each ical file and use ical2json to convert original data and output as JSON file in json folder
calendars.forEach(function(filepath) {
    var convertedJSON = ical2json.convert(jetpack.read(filepath));
    console.log(`Converted ${filepath} to JSON.`);
    jetpack.write(`${jsonDest}/${path.parse(filepath).name}.json`, convertedJSON);
});