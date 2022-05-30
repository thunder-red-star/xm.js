const Patterns = require('./struct/Patterns');
const Pattern = require('./struct/Pattern');
const Row = require('./struct/Row');
const Note = require("./struct/Note");
const Instrument = require('./struct/Instrument');
const Sample = require('./struct/Sample');
const Instruments = require('./struct/Instruments');

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

				/*
		 * Instrument header:
		 * Bytes 00-04: Instrument size
		 * Bytes 04-26: Instrument name
		 * Bytes 26-27: Instrument type
		 * Bytes 27-29: Number of samples
		 *
		 * If the number of samples is >0, the following headers are present:
		 * Bytes 29-33: Sample Header Size
		 * Bytes 33-129: Sample Keymap Assignments
		 * Bytes 129-177: Points for volume envelope
		 * Bytes 177-225: Points for panning envelope
		 * Bytes 225-226: Number of volume points
		 * Bytes 226-227: Number of panning points
		 * Bytes 227-228: Volume sustain point
		 * Bytes 228-229: Volume loop start point
		 * Bytes 229-230: Volume loop end point
		 * Bytes 230-231: Panning sustain point
		 * Bytes 231-232: Panning loop start point
		 * Bytes 232-233: Panning loop end point
		 * Bytes 233-234: Volume type
		 * Bytes 234-235: Panning type
		 * Bytes 235-236: Vibrato type
		 * Bytes 236-237: Vibrato sweep
		 * Bytes 237-238: Vibrato depth
		 * Bytes 238-239: Vibrato rate
		 * Bytes 239-241: Volume fadeout
		 * Bytes 241-263: Reserved
		 */
		let instruments = [];
		for (let i = 0; i < this.header.numInstruments; i++) {
			let instrumentHeader = {
				size: xm.readUInt32LE(offset),
				name: xm.slice(offset + 4, offset + 26).toString("ascii").replace(/[^\x20-\x7F]/g, '').trim(),
				type: xm.readUInt8(offset + 26),
				numSamples: xm.readUInt16LE(offset + 27),
			}

			let instrumentSamples = [];
			if (instrumentHeader.numSamples > 0) {
				// Read the rest of the instrument header
				instrumentHeader.sampleHeaderSize = xm.readUInt32LE(offset + 29);
				instrumentHeader.sampleKeymapAssignments = xm.slice(offset + 33, offset + 129).toCharCodes().removeEndingZeros();
				instrumentHeader.volumeEnvelopePoints = xm.slice(offset + 129, offset + 177).toCharCodes().removeEndingZeros();
				instrumentHeader.panningEnvelopePoints = xm.slice(offset + 177, offset + 225).toCharCodes().removeEndingZeros();
				instrumentHeader.numVolumePoints = xm.readUInt8(offset + 225);
				instrumentHeader.numPanningPoints = xm.readUInt8(offset + 226);
				instrumentHeader.volumeSustainPoint = xm.readUInt8(offset + 227);
				instrumentHeader.volumeLoopStartPoint = xm.readUInt8(offset + 228);
				instrumentHeader.volumeLoopEndPoint = xm.readUInt8(offset + 229);
				instrumentHeader.panningSustainPoint = xm.readUInt8(offset + 230);
				instrumentHeader.panningLoopStartPoint = xm.readUInt8(offset + 231);
				instrumentHeader.panningLoopEndPoint = xm.readUInt8(offset + 232);
				instrumentHeader.volumeType = xm.readUInt8(offset + 233);
				instrumentHeader.panningType = xm.readUInt8(offset + 234);
				instrumentHeader.vibratoType = xm.readUInt8(offset + 235);
				instrumentHeader.vibratoSweep = xm.readUInt8(offset + 236);
				instrumentHeader.vibratoDepth = xm.readUInt8(offset + 237);
				instrumentHeader.vibratoRate = xm.readUInt8(offset + 238);
				instrumentHeader.volumeFadeout = xm.readUInt16LE(offset + 239);
				instrumentHeader.reserved = xm.slice(offset + 241, offset + 263).toCharCodes().removeEndingZeros();

				offset += 263;

				let samples = [];
				let sampleHeaders = [];
				let sampleDataArr = [];

				// Read the samples
				for (let j = 0; j < instrumentHeader.numSamples; j++) {
					/*
					 * Sample header:
					 * Bytes 00-04: Sample length
					 * Bytes 04-08: Sample loop start
					 * Bytes 08-12: Sample loop length
					 * Bytes 12-13: Sample volume
					 * Bytes 13-14: Sample finetune
					 * Bytes 14-15: Sample type
					 * Bytes 15-16: Sample panning
					 * Bytes 16-17: Sample relative note number
					 * Bytes 17-18: Sample packing type
					 * Bytes 18-40: Sample name
					 */

					let sampleHeader = {
						length: xm.readUInt32LE(offset),
						loopStart: xm.readUInt32LE(offset + 4),
						loopLength: xm.readUInt32LE(offset + 8),
						volume: xm.readUInt8(offset + 12),
						finetune: xm.readUInt8(offset + 13),
						type: xm.readUInt8(offset + 14),
						panning: xm.readUInt8(offset + 15),
						relativeNoteNumber: xm.readUInt8(offset + 16),
						packingType: xm.readUInt8(offset + 17),
						name: xm.slice(offset + 18, offset + 40).toString("ascii").replace(/[^\x20-\x7F]/g, '').trim(),
					}

					offset += 40;

					sampleHeaders.push(sampleHeader);
				}

				for (let j = 0; j < instrumentHeader.numSamples; j++) {
					let sampleHeader = sampleHeaders[j];
					// Read the sample data
					let sampleData = [];
					if (sampleHeader.packingType === 0x00) {
						// Normal Delta-Packed
						let old = 0;
						// Get sample bits (in sampleHeader.type, bit 4). If it's 0, then the sample is 8-bit, otherwise it's 16-bit.
						let sampleBits = (sampleHeader.type & 0x10) ? 16 : 8;
						if (sampleBits === 8) {
							// 8-bit sample
							for (let j = 0; j < sampleHeader.length; j++) {
								let value = xm.readUInt8(offset);
								offset++;
								sampleData.push(value - old);
								old = value;
							}
						} else {
							// 16-bit sample
							for (let j = 0; j < sampleHeader.length; j++) {
								let value = xm.readUInt16LE(offset);
								offset += 2;
								sampleData.push(value - old);
								old = value;
							}
						}
					} else if (sampleHeader.packingType === 0xAD) {
						// ADPCM packed, get compression table (compression table is 16 bytes long)
						let compressionTable = xm.slice(offset, offset + 16);
						offset += 16;

						// Decompress the sample data
						let old = 0;
						for (let j = 0; j < sampleHeader.length; j++) {
							let compressionTableIndex = xm.readUInt8(offset);
							old += compressionTable[compressionTableIndex];
							sampleData.push(old);
							offset++;
						}
					} else {
						// Unknown packing type
						throw new Error('Unknown sample packing type: ' + sampleHeader.packingType);
					}

					sampleDataArr.push(sampleData);
				}

				// Add the samples to the instrument
				for (let j = 0; j < instrumentHeader.numSamples; j++) {
					let sampleHeader = sampleHeaders[j];
					let sampleData = sampleDataArr[j];
					let sample = new Sample(
						sampleHeader,
						sampleData
					);
					samples.push(sample);
				}

				console.log("Pushed instrument " + i + " with name " + instrumentHeader.name);
				instruments.push(new Instrument(instrumentHeader, samples));
			} else {
				offset += 29;

				// Push a dummy instrument
				console.log('Pushing dummy instrument');
				instruments.push(
					new Instrument(
						instrumentHeader,
						[]
					)
				);
			}
		}

		this.instruments = new Instruments(instruments);
	}

	toString() {
		return this.patterns.toString();
	}
}