'use strict';

const path = require('path');
const jetpack = require('fs-jetpack');
const calendars = jetpack.find("ical", { matching: "*.ics" });
const icaljsDest = './_data/icaljs';
const jsonDest = './json';

console.log("Copying Bootstrap JS bundle and fonts for build.");

// Bootstrap JS and fonts
jetpack.copy('./node_modules/bootstrap/dist/js', './assets/js', { 
    matching: 'bootstrap.bundle.min.js*', 
    overwrite: true 
});
jetpack.copy('./node_modules/bootstrap-icons/font/fonts', './assets/fonts', { 
    matching: ['*.woff', '*.woff2'],
    overwrite: true
});

// Remove json folder if exists
jetpack.cwd(icaljsDest).remove();
jetpack.cwd(jsonDest).remove();

// Assign a specific key for the calendar summary values for a consistent identifier
const collectionKey = {
    "Black Bin Day": "black-bin",
    "Green Bin Day": "green-bin",
    "Green Bin + Glass Box Day": "green-glass-bin",
    "Garden Waste Collection": "garden-bin",
};

const daysOfWeek = ['Sunday', "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getWeekdayFromFilename(filename) {
    const weekdayRegex = /(monday|tuesday|wednesday|thursday|friday)/i;
    const match = filename.match(weekdayRegex);

    if (!match) {
        return null;
    }

    let weekday = match[0];

    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
}

function getBinType(key) {
    const keyParsed = key.replace('(Changed Collection)', '').trim();
    return collectionKey[keyParsed] || 'Unknown';
}

function formatAlternativeName(name) {
    return name.replace(/Day|\(Changed Collection\)/gi, '').replace('Garden Waste Collection', 'Garden Bin').trim();
}

function getWeekdayFromDate(date) {
    return daysOfWeek[new Date(date).getDay()];
}

function getUsualCollectionDate(date, normalCollectionDay) {
    const revisedCollectionDay = date.getDay();
    const distance = (revisedCollectionDay - normalCollectionDay + 7) % 7;

    // If the revised date is one day after the usual collection date
    if (distance === 1) {
        date.setDate(date.getDate() - distance);
        return date;
    }

    // Revised date is before the usual collection date
    date.setDate(date.getDate() + (normalCollectionDay + 7 - revisedCollectionDay) % 7);
    return date;
}

// Process each ical file to convert to JSON format
calendars.forEach(function(filepath) {

    const icalJs = require('ical.js');
    const IcalExpander = require('ical-expander');
    const ics = jetpack.read(filepath);
    const icalExpander = new IcalExpander({ ics, maxIterations: 55 });
    const events = icalExpander.all();
    const filename = `${path.parse(filepath).name}.json`;
    const jcalData = icalJs.parse(ics);
    const comp = new icalJs.Component(jcalData);
    const fileProperties = jetpack.inspect(`./${filepath}`, { times: true });
    const jsonPath = `${jsonDest}/${filename}`;
    const collectionWeekday = getWeekdayFromFilename(filename);

    // Create JSON header
    const jsonData = {
        "filename": filename,
        "name": comp.getFirstPropertyValue('x-wr-calname'),
        "description": comp.getFirstPropertyValue('x-wr-caldesc'),
        "collectionWeekday": collectionWeekday,
        "collectionType": filename.includes('garden') ? 'Garden' : 'Refuse',
        "icalPath": filepath,
        "jsonPath": jsonPath.substring(2),
        "lastGenerated": new Date().toJSON(),
        "lastModified": fileProperties.modifyTime,
        "totalCollections": 0,
        "totalChangedCollections": 0,
        "revisedCollectionDates": [],
        "collectionDates": []
    };

    const mappedEvents = events.events.map(e => ({ 
        name: e.summary,
        alternativeName: formatAlternativeName(e.summary),
        weekday: getWeekdayFromDate(e.startDate),
        isOccurrence: false,
        type: getBinType(e.summary),
        collectionDate: e.startDate.toString(),
        isChangedCollection: true
    }));

    const mappedOccurrences = events.occurrences.map(o => ({
        name: o.item.summary,
        alternativeName: formatAlternativeName(o.item.summary),
        weekday: getWeekdayFromDate(o.item.startDate),
        isOccurrence: true,
        type: getBinType(o.item.summary),
        collectionDate: o.startDate.toString(),
        isChangedCollection: false
    }));

    const allEvents = [].concat(mappedEvents, mappedOccurrences)
        .sort((a,b) => new Date(a.collectionDate) - new Date(b.collectionDate));

    jsonData['totalCollections'] = allEvents.length;

    const allChangedCollections = allEvents.filter(function(item){
        return item.isChangedCollection;
    });

    jsonData['totalChangedCollections'] = allChangedCollections.length;

    jsonData['revisedCollectionDates'] = allChangedCollections.map(date => ({
        [
            getUsualCollectionDate(
                new Date(date.collectionDate), 
                daysOfWeek.indexOf(collectionWeekday)
            ).toLocaleString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit'})
        ]
        : date.collectionDate.toString()
    }));

    jsonData['collectionDates'] = allEvents;

    // Write to JSON folder for public API
    jetpack.write(jsonPath, jsonData);
    console.log(`Output ${filename} to JSON directory.`);

    // Write to _data folder for internal use for schedule listing template
    jetpack.write(`${icaljsDest}/${filename}`, jsonData);
    console.log(`Output ${filename} to _data directory.`);
});