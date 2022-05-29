// Test files can be found in './xm/'

const XM = require('../src/index');
const fs = require('fs');

let equinox = fs.readFileSync(__dirname + '/xm/equinox.xm');

let xm = new XM(equinox);

console.log(xm.toString());