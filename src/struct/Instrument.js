class Instrument {
	constructor (header, samples) {
		this.header = header;
		this.samples = samples;
	}

	getHeader() {
		return this.header;
	}

	getSamples() {
		return this.samples;
	}

	toString() {
		let returnString = (this.header.name !== "" ? this.header.name : "<no name>") + " (" + this.header.numSamples + " samples)" + "\n";
		for (let i = 0; i < this.samples.length; i++) {
			returnString += "    " + this.samples[i].toString() + (i < this.samples.length - 1 ? "\n" : "");
		}
		return returnString;
	}

	countBytes() {
		let total = (this.header.numSamples === 0) ? 29 : 263
		for (let i = 0; i < this.samples.length; i++) {
			total += this.samples[i].countBytes();
		}
		return total;
	}

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

	toBuffer() {
		let buffer;
		if (this.samples.length === 0) {
			buffer = Buffer.alloc(29);
			buffer.writeUInt32LE(29, 0);
			buffer.write(this.header.name, 4, 26, 'ascii');
			buffer.writeUInt8(this.header.type, 26);
			buffer.writeUInt8(0, 27);
		}
		else {
			buffer = Buffer.alloc(263);
			buffer.writeUInt8(this.samples.length, 27);
			buffer.writeUInt32LE(263, 0);
			let offset = 29 + 4;
			for (let i = 0; i < this.header.sampleKeymapAssignments.length; i++) {
				buffer.writeUInt8(this.header.sampleKeymapAssignments[i], offset);
				offset++;
			}
			for (let i = 0; i < this.header.volumeEnvelopePoints.length; i++) {
				buffer.writeUInt8(this.header.volumeEnvelopePoints[i], offset);
				offset++;
			}
			for (let i = 0; i < this.header.panningEnvelopePoints.length; i++) {
				buffer.writeUInt8(this.header.panningEnvelopePoints[i], offset);
				offset++;
			}
			buffer.writeUInt8(this.header.numVolumePoints, offset);
			offset++;
			buffer.writeUInt8(this.header.numPanningPoints, offset);
			offset++;
			buffer.writeUInt8(this.header.volumeSustainPoint, offset);
			offset++;
			buffer.writeUInt8(this.header.volumeLoopStartPoint, offset);
			offset++;
			buffer.writeUInt8(this.header.volumeLoopEndPoint, offset);
			offset++;
			buffer.writeUInt8(this.header.panningSustainPoint, offset);
			offset++;
			buffer.writeUInt8(this.header.panningLoopStartPoint, offset);
			offset++;
			buffer.writeUInt8(this.header.panningLoopEndPoint, offset);
			offset++;
			buffer.writeUInt8(this.header.volumeType, offset);
			offset++;
			buffer.writeUInt8(this.header.panningType, offset);
			offset++;
			buffer.writeUInt8(this.header.vibratoType, offset);
			offset++;
			buffer.writeUInt8(this.header.vibratoSweep, offset);
			offset++;
			buffer.writeUInt8(this.header.vibratoDepth, offset);
			offset++;
			buffer.writeUInt8(this.header.vibratoRate, offset);
			offset++;
			buffer.writeUInt16LE(this.header.volumeFadeout, offset);
			offset++;
			for (let i = 0; i < this.header.reserved.length; i++) {
				buffer.writeUInt8(this.header.reserved[i], offset);
				offset++;
			}

			// Write the sample headers
			for (let i = 0; i < this.samples.length; i++) {
				buffer = Buffer.concat([buffer, this.samples[i].toHeaderBuffer()]);
			}

			// Write the sample data
			for (let i = 0; i < this.samples.length; i++) {
				buffer = Buffer.concat([buffer, this.samples[i].toDataBuffer()]);
			}
		}

		return buffer;
	}
}

module.exports = Instrument;