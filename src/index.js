const Pattern = require('./struct/Pattern');

module.exports = class {
	/*
	 * XM file header:
	 * Bytes 0-17: "Extended Module: "
	 * Bytes 18-37: Module name
	 * Bytes 37-38: 0x1A
	 * Bytes 38-58: Tracker name
	 * Bytes 58-60: Version number
	 * Bytes 60-64: Header size
	 * Bytes 64-66: Song length
	 * Bytes 66-68: Restart position
	 * Bytes 68-70: Number of channels
	 * Bytes 70-72: Number of patterns
	 * Bytes 72-74: Number of instruments
	 * Bytes 74-76: Flags
	 * Bytes 76-78: Default tempo
	 * Bytes 78-80: Default BPM
	 * Bytes 80-??: Pattern order list
	 */

	/*
	 * Pattern header:
	 * Bytes 00-??: Pattern Header Size
	 * Bytes ??-?+4: Number of rows
	 *
	 */
	constructor (xm) {
		// Assume xm is a buffer or a string
		if (typeof xm === 'string') {
			xm = Buffer.from(xm, 'binary');
		} else if (xm instanceof ArrayBuffer) {
			xm = Buffer.from(xm);
		}

		// Read header
		this.header = {
			name: xm.toString('ascii', 18, 38),
			tracker: xm.toString('ascii', 38, 58),
			version: xm.readUInt16LE(58),
			headerSize: xm.readUInt16LE(60),
			songLength: xm.readUInt16LE(64),
			restartPosition: xm.readUInt16LE(66),
			numChannels: xm.readUInt16LE(68),
			numPatterns: xm.readUInt16LE(70),
			numInstruments: xm.readUInt16LE(72),
			flags: xm.readUInt16LE(74),
			defaultTempo: xm.readUInt16LE(76),
			defaultBPM: xm.readUInt16LE(78),
			patternOrder: xm.slice(80, xm.readUInt16LE(60) - 2)
		}

		// Read patterns
		this.patterns = [];
		for (let i = 0; i < this.header.numPatterns; i++) {
			this.patterns.push(new Pattern(xm.slice(xm.readUInt16LE(60) + i * 2, xm.readUInt16LE(60) + (i + 1) * 2)));
		}

		// Read instruments
		this.instruments = [];
		for (let i = 0; i < this.header.numInstruments; i++) {
			this.instruments.push(xm.slice(xm.readUInt16LE(60) + this.header.numPatterns * 2 + i * 4, xm.readUInt16LE(60) + this.header.numPatterns * 2 + (i + 1) * 4));
		}


	}
}