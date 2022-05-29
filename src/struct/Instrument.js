class Instrument {

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
	constructor (xm) {
		// Get instrument header
		this.header = {
			size: xm.readUInt32LE(0),
			name: xm.toString('ascii', 4, 26).replace(/[^\x20-\x7E]/g, ''),
			type: xm.readUInt16LE(26),
			numSamples: xm.readUInt16LE(28),
		};

		if (this.header.numSamples > 0) {
			// Get sample headers
			this.samples = [];
			for (let i = 0; i < this.header.numSamples; i++) {
				this.samples.push(this.getSample(xm.readUInt32LE(29 + i * 4)));
			}
		}
	}
}