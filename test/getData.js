// Test files can be found in './xm/'

const XM = require('../src/index');
const fs = require('fs');


let xmfile = fs.readFileSync(__dirname + '/xm/kuk.xm');

let xm = new XM(xmfile);

fs.writeFileSync("e.wav", xm.instruments.get(2).samples[0].getRaw());