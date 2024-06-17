'use strict';

const path = require('path');
const jetpack = require("fs-jetpack");
const _ = require('underscore');
const { exit } = require('process');
const calendars = jetpack.find("ical", { matching: "*.ics" });
const icaljsDest = './_data/icaljs';
const jsonDest = './json';
const bootstrapJsBundle = './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
const bootstrapIconFonts = './node_modules/bootstrap-icons/font/fonts';

if (!jetpack.exists(bootstrapJsBundle) || !jetpack.exists(bootstrapIconFonts)) {
    console.error('Missing node_module dependency. Could not complete build.');
    process.exit(1);
}

console.log('Copying Bootstrap JS bundle from node_modules...');
jetpack.copy(bootstrapJsBundle, './assets/js/bootstrap.bundle.min.js', { overwrite: true });

console.log('Copying bootstrap web font files...');
jetpack.copy(bootstrapIconFonts, './assets/fonts', { overwrite: true });

// Remove json folder if exists
jetpack.cwd(icaljsDest).remove();
jetpack.cwd(jsonDest).remove();

// Process each ical file to convert to JSON format
calendars.forEach(function(filepath) {

    const icalJs = require('ical.js');
    const IcalExpander = require('ical-expander');
    const ics = jetpack.read(filepath);
    const icalExpander = new IcalExpander({ ics, maxIterations: 50 });
    const events = icalExpander.all();
    const filename = `${path.parse(filepath).name}.json`;

    // Assign a specific key for the calendar summary values for a consistent identifier
    const collectionKey = {
        "Black Bin Day": "black-bin",
        "Green Bin Day": "green-bin",
        "Green Bin + Glass Box Day": "green-glass-bin",
        "Garden Waste Collection": "garden-bin",
    };

    const jcalData = icalJs.parse(ics);
    const comp = new icalJs.Component(jcalData);
    const fileProperties = jetpack.inspect(`./${filepath}`, { times: true });

    // Create JSON header
    const jsonData = {
        "filename": filename,
        "name": comp.getFirstPropertyValue('x-wr-calname'),
        "lastModified": fileProperties.modifyTime,
        "description": comp.getFirstPropertyValue('x-wr-caldesc'),
        "collectionDates": []
    };

    function getBinType(key) {
        var keyParsed = key.replace('(Changed Collection)', '').trim();
        return collectionKey[keyParsed] || 'Unknown';
    }

    function isChangedCollection(eventTitle) {
        return eventTitle.toLowerCase().includes('changed collection');
    }

    const mappedEvents = events.events.map(e => ({ 
        name: e.summary,
        type: getBinType(e.summary),
        collectionDate: e.startDate.toString(),
        isChangedCollection: isChangedCollection(e.summary)
    }));

    const mappedOccurrences = events.occurrences.map(o => ({
        name: o.item.summary,
        type: getBinType(o.item.summary),
        collectionDate: o.startDate.toString(),
        isChangedCollection: isChangedCollection(o.item.summary)
    }));

    const allEvents = [].concat(mappedEvents, mappedOccurrences)
        .sort((a,b) => new Date(a.collectionDate) - new Date(b.collectionDate));

    // Workaround for same date appearing as both single and occurence after parsing
    jsonData['collectionDates'] = _.unique(allEvents, 'collectionDate');

    // Write to JSON folder for public API
    jetpack.write(`${jsonDest}/${filename}`, jsonData);
    console.log(`Output ${filename} to JSON directory.`)

    // Write to _data folder for internal use for schedule listing template
    jetpack.write(`${icaljsDest}/${filename}`, jsonData);
    console.log(`Output ${filename} to _data directory.`);
});