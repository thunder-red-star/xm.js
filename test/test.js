// Testing xm.js

// Test file can be found in './xm/kuk.xm'

const fs = require('fs');
const XM = require('../src/index');
const assert = require("assert");

// Read file
const xm = fs.readFileSync(__dirname + '/xm/kuk.xm');

let xmObj = new XM(xm);

console.log("Name of module: " + xmObj.header.name);
let assertion = (xmObj.header.name === "kuk");
assert.equal(assertion, true);