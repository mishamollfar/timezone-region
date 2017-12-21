#!/usr/bin/env node

let nameSaveFile = process.argv[2];

let fs = require('fs');
let timezone = require('./timezone.js');

formatingFile();

function formatingFile() {
    let region = formatingRegion(timezone.timezones);
    let timez = formatTimezone(timezone.timezones, region);

    saveFile(timez);
};

function saveFile(dataToFile) {
    let dataField =  loopVerifyField(dataToFile);
    let data = JSON.stringify(dataField, "", 4);  
   
    fs.writeFile(nameSaveFile, `export const timezone = ${data}`, (err) => {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    });
}

function formatTimezone(data, region) {
    let regionWithTimeZone = {};

    data.forEach(key => {
        let regionTimeZone = createFullTimezone(key, region)
        
        regionTimeZone.forEach(timez => {
            let findRegion = region.find(item => timez.match(item));
            regionWithTimeZone[findRegion] = (regionWithTimeZone[findRegion] || []).concat(timez);
        })  
    });
    
    return regionWithTimeZone
}

function createFullTimezone(timeZone) {
    let objkey = timeZone.text.match(/(\(\w+\)|\(\w+[\-\+]\w+\:\w+\))+/)[0]
    let fullTimezone = timeZone.utc.map(item => {return item.match(/(\w+\/\w+|[A-Z\d]+)/)[0]});
    let full = [];

    fullTimezone.forEach(req => {
        full.push(objkey + req);
    })
   
    return full;
}

function formatingRegion(data) {
    let region = [];

     data.forEach(key => {
        let utc = key.utc.map(item => {return item.match(/(\w)+\/|[A-Z\d]{7}/)[0].replace('/', '')});

        region = region.concat(utc);
    });

    // return Array.from(new Set(region.map(JSON.stringify))).map(JSON.parse);
    return uniqField(region);
}

function uniqField(field) {
    return Array.from(new Set(field.map(JSON.stringify))).map(JSON.parse);
}

function loopVerifyField(fieldArray) {
    let uniqObjectField = {}
    let keysArray = Object.keys(fieldArray);

    keysArray.forEach(key => {
        uniqObjectField[key] = uniqField(fieldArray[key]);
    })

    return uniqObjectField;
}