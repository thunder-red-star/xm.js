// Testing xm.js

// Test file can be found in './xm/kuk.xm'

const fs = require('fs');
const XM = require('../src/index');
const assert = require("assert");

// Read file
const xm = fs.readFileSync(__dirname + '/xm/kuk.xm');

let xmObj = new XM(xm);

console.log("Name of module: " + xmObj.header.name);
console.log("Number of patterns: " + xmObj.header.numPatterns);
console.log("Number of instruments: " + xmObj.header.numInstruments);
console.log("Number of channels: " + xmObj.header.numChannels);
console.log("Version: " + xmObj.header.version);


console.log("Getting pattern order");
let patternOrder = xmObj.header.patternOrder;
console.log(patternOrder);

console.log("\n\n")

const xm2 = fs.readFileSync(__dirname + '/new.xm');

let xmObj2 = new XM(xm2);

console.log("Name of module: " + xmObj2.header.name);
console.log("Number of patterns: " + xmObj2.header.numPatterns);
console.log("Number of instruments: " + xmObj2.header.numInstruments);
console.log("Number of channels: " + xmObj2.header.numChannels);
console.log("Version: " + xmObj2.header.version);


console.log("Getting pattern order");
let patternOrder2 = xmObj2.header.patternOrder;
console.log(patternOrder2);

console.log(xmObj2.toString())