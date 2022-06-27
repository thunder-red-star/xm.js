const XM = require('../src/index');
const fs = require('fs');

const XMFile = fs.readFileSync(__dirname + '/xm/kuk.xm');

let song = new XM(XMFile);

fs.writeFileSync(__dirname + '/new.xm', song.toBuffer());