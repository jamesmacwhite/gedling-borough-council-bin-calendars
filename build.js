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

// Store weekdays in an array to use the index value
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Get the weekday from the calendar filename
 * and capitalise the first letter of the value
 * @param {string} filename Calendar filename 
 * @return {string} The weekday value with the first character capitalised.
 */
function getWeekdayFromFilename(filename) {
    const weekdayRegex = /(Monday|Tuesday|Wednesday|Thursday|Friday)/i;
    const match = filename.match(weekdayRegex);

    if (!match) {
        return null;
    }

    let weekday = match[0];

    return weekday.replace(/^\w/, c => c.toUpperCase());
}

/**
 * Map calender VEVENT summary to bin type value
 * @param {string} key Calendar event title
 * @return {string} The matched value, return "Unknown" if not matched for unit tests
 */
function getBinType(key) {
    return collectionKey[key.replace('(Changed Collection)', '').trim()] || 'Unknown';
}

/**
 * Modify the original VEVENT summary value for other purposes
 * @param {string} name Calendar VEVENT title
 * @return {string} The modified title value
 */
function formatAlternativeName(name) {
    return name
            .replace(/Day|\(Changed Collection\)/gi, '')
            .replace('Garden Waste Collection', 'Garden Bin')
            .trim();
}

/**
 * Determine the weekday of a collection date
 * @param {Date} date Collection date
 * @return {string} The weekday value from the daysOfWeek index
 */
function getWeekdayFromDate(date) {
    return daysOfWeek[new Date(date).getDay()];
}

/**
 * The usual collection date calculation
 * To map changed collection dates to their original scheduled
 * @param {Date} date The revised collection date from the calendar
 * @param {number} normalCollectionDay The normal collection day index
 * @return {Date} The usual collection date
 */
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

    const allChangedCollections = allEvents.filter(function(item) {
        return item.isChangedCollection;
    });

    jsonData['totalChangedCollections'] = allChangedCollections.length;

    jsonData['revisedCollectionDates'] = allChangedCollections.map(item => {
        const collectionDate = item.collectionDate.toString();
        const revisedCollectionDate = getUsualCollectionDate(
            new Date(item.collectionDate), 
            daysOfWeek.indexOf(collectionWeekday)
        ).toLocaleString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit'});

        if (item.type !== 'garden-bin') {
            return { 
                [revisedCollectionDate] : collectionDate
            };
        }

        return collectionDate;
    });

    jsonData['collectionDates'] = allEvents;

    // Write to JSON folder for public API
    jetpack.write(jsonPath, jsonData);
    console.log(`Output ${filename} to JSON directory.`);

    // Write to _data folder for internal use for schedule listing template
    jetpack.write(`${icaljsDest}/${filename}`, jsonData);
    console.log(`Output ${filename} to _data directory.`);
});