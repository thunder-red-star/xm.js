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

console.log("Checking if name of module is correct");
assert.equal(xmObj.header.name, "kuk");
if (xmObj.header.name === "kuk") {
	console.log("Name of module is correct");
}