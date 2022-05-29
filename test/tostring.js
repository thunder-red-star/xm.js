// Test files can be found in './xm/'

const XM = require('../src/index');
const fs = require('fs');

let kuk = fs.readFileSync(__dirname + '/xm/kuk.xm');

let kukXM = new XM(kuk);

console.log(kukXM.toString());