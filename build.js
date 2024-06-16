'use strict';

const path = require('path');
const jetpack = require("fs-jetpack");
const _ = require('underscore');
const { exit } = require('process');
const calendars = jetpack.find("ical", { matching: "*.ics" });
const icaljsDest = './_data/icaljs';
const jsonDest = './json';
const bootstrapJsBundle = './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

if (!jetpack.exists(bootstrapJsBundle)) {
    console.error('node_modules Bootstrap JS bundle does not exist.');
    process.exit(1);
}

console.log('Copying Bootstrap JS bundle from node_modules...');
jetpack.copy(bootstrapJsBundle, "./assets/js/bootstrap.bundle.min.js", { overwrite: true });

console.log('Copy bootstrap web font files...');
jetpack.copy('./node_modules/bootstrap-icons/font/fonts', './assets/fonts', { overwrite: true });

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
        "Black Bin Day (Changed Collection)": "black-bin",
        "Green Bin Day": "green-bin",
        "Green Bin Day (Changed Collection)": "green-bin",
        "Green Bin + Glass Box Day": "green-glass-bin",
        "Green Bin + Glass Box Day (Changed Collection)": "green-glass-bin",
        "Garden Waste Collection": "garden-bin",
        "Garden Waste Collection (Changed Collection)": "garden-bin"
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

    const mappedEvents = events.events.map(e => ({ 
        name: e.summary,
        type: collectionKey[e.summary] || null,
        collectionDate: e.startDate.toString(),
        isChangedCollection: e.summary.includes("Changed Collection")
    }));

    const mappedOccurrences = events.occurrences.map(o => ({
        name: o.item.summary,
        type: collectionKey[o.item.summary] || null,
        collectionDate: o.startDate.toString(),
        isChangedCollection: o.item.summary.includes("Changed Collection")
    }));

    const allEvents = [].concat(mappedEvents, mappedOccurrences)
        .sort((a,b) => new Date(a.collectionDate) - new Date(b.collectionDate));

    // Workaround for same date appearing as both single and occurence after parsing
    jsonData['collectionDates'] = _.unique(allEvents, 'collectionDate');

    // Write to JSON folder for public API
    jetpack.write(`${jsonDest}/${filename}`, jsonData);

    // Write to _data folder for internal use for schedule listing template
    jetpack.write(`${icaljsDest}/${filename}`, jsonData);
});