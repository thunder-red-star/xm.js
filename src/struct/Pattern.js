class Pattern {
	/*
	 * Pattern header:
	 * Bytes 00-04: Pattern Header Size
	 * Bytes 04-05: Packing Type
	 * Bytes 05-07: Number of rows
	 * Bytes 07-09: Packed Pattern Data Size
	 * Bytes 09-??: Packed Pattern Data
	 */
	constructor(pattern) {
		this.header = {
			size: pattern.readUInt16LE(0),
			packingType: pattern.readUInt16LE(2),
			numRows: pattern.readUInt16LE(4),
			dataSize: pattern.readUInt16LE(6),
		};

		this.data = pattern.slice(8, this.header.dataSize + 8);
	}

	/*
	 * XM patterns are stored as following:
	 *	A pattern is a sequence of lines.
	 *	A line is a sequence of notes.
	 */
	getLines() {
		const lines = [];
		for (let i = 0; i < this.header.numRows; i++) {
			lines.push(this.getLine(i));
		}
		return lines;
	}

	getLine(row) {
		const line = [];
		const offset = row * this.header.numChannels * 2;
		for (let i = 0; i < this.header.numChannels; i++) {
			line.push(this.getNote(offset + i * 2));
		}
		return line;
	}

	getNote(offset) {
		const note = {};
		note.note = this.data.readUInt8(offset);
		note.instrument = this.data.readUInt8(offset + 1);
		return note;
	}

	getInstrument(instrument) {
		const inst = {};
		inst.name = this.data.toString('ascii', instrument.nameOffset, instrument.nameOffset + instrument.nameLength);
		inst.type = this.data.readUInt8(instrument.typeOffset);
		inst.numSamples = this.data.readUInt8(instrument.numSamplesOffset);
		inst.samples = [];
		for (let i = 0; i < inst.numSamples; i++) {
			inst.samples.push(this.getSample(instrument.samplesOffset + i * instrument.sampleSize));
		}
		return inst;
	}


}


module.exports = Pattern;