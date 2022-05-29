const Patterns = require('./struct/Patterns');
const Pattern = require('./struct/Pattern');
const Row = require('./struct/Row');
const Note = require("./struct/Note");

Buffer.prototype.toCharCodes = function() {
	let charCodes = [];
	for (let i = 0; i < this.length; i++) {
		charCodes.push(this.readUInt8(i));
	}
	return charCodes;
}

Array.prototype.removeEndingZeros = function() {
	while (this[this.length - 1] === 0) {
		this.pop();
	}
	return this;
}

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
	 * bit 0 set: Note follows
 	 *	1 set: Instrument follows
 	 *	2 set: Volume column byte follows
 	 *	3 set: Effect type follows
 	 *	4 set: Effect parameter follows

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
			// Remove non-ascii characters from name
			name: xm.toString('ascii', 17, 37).replace(/[^\x20-\x7E]/g, '').trim(),
			tracker: xm.toString('ascii', 38, 58).replace(/[^\x20-\x7E]/g, '').trim(),
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
			patternOrder: xm.slice(80, 80 + 256).toCharCodes().removeEndingZeros(),
		}

		// Read patterns
		this.patterns = new Patterns();
		let offset = 80 + 256;
		for (let i = 0; i < this.header.numPatterns; i++) {
			let patternHeader = {
				size: xm.readUInt32LE(offset),
				packingType: xm.readUInt8(offset + 4),
				numRows: xm.readUInt16LE(offset + 5),
				packedPatternDataSize: xm.readUInt16LE(offset + 7),
			}

			offset += 9;

			let patternRows = [];

			for (let j = 0; j < patternHeader.numRows; j++) {
				let row = [];
				for (let k = 0; k < this.header.numChannels; k++) {
					let noteObj;

					// Initial values
					let note = -1;
					let instrument = -1;
					let volume = -1;
					let effect = 0;
					let effectParameter = 0;

					let firstByte = xm.readUInt8(offset);
					offset++;
					// Decompress pattern data if necessary
					if (firstByte & 0x80) {
						if (firstByte & 0x01) {
							note = xm.readUInt8(offset);
							offset++;
						}
						if (firstByte & 0x02) {
							instrument = xm.readUInt8(offset);
							offset++;
						}
						if (firstByte & 0x04) {
							volume = xm.readUInt8(offset);
							offset++;
						}
						if (firstByte & 0x08) {
							effect = xm.readUInt8(offset);
							offset++;
						}
						if (firstByte & 0x10) {
							effectParameter = xm.readUInt8(offset);
							offset++;
						}
					} else {
						note = firstByte;
						instrument = xm.readUInt8(offset);
						offset++;
						volume = xm.readUInt8(offset);
						offset++;
						effect = xm.readUInt8(offset);
						offset++;
						effectParameter = xm.readUInt8(offset);
						offset++;
					}

					// Convert note values to note objects
					noteObj = new Note(
						note = note === -1 ? null : note,
						instrument = instrument === -1 ? null : instrument,
						volume = volume === -1 ? null : volume,
						effect = effect === 0 ? null : effect,
						effectParameter = effectParameter === 0 ? null : effectParameter
					);
					// Add note object to row
					row.push(noteObj);
				}
				// Convert row array to row object
				row = new Row(row);
				patternRows.push(row);
			}

			// Convert pattern array to pattern object
			this.patterns.push(
				new Pattern(patternHeader, patternRows)
			);
		}


		// Read instruments
		this.instruments = [];
		for (let i = 0; i < this.header.numInstruments; i++) {
			this.instruments.push(xm.slice(xm.readUInt16LE(60) + this.header.numPatterns * 2 + i * 4, xm.readUInt16LE(60) + this.header.numPatterns * 2 + (i + 1) * 4));
		}
	}

	toString() {
		return this.patterns.toString();
	}
}