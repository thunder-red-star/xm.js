class Note {
	/*
	 * Note class:
	 * Bytes 00-01: Note
	 * Bytes 01-02: Instrument
	 * Bytes 02-03: Volume
	 * Bytes 03-04: Effect
	 * Bytes 04-05: Effect Parameter
	 */
	constructor(note) {
		/*
		 * Note decompression (read MSB first):
		 * bit 0 set: Note follows
		 *  1 set: Instrument follows
		 *  2 set: Volume column byte follows
		 *  3 set: Effect type follows
		 *  4 set: Effect parameter follows
		 */
		// Decompress note
		let decompressed = 0;
		let mask = 1;
		for (let i = 0; i < 4; i++) {
			if (note.readUInt8(i) & mask) {
				decompressed |= mask;
			}
			mask <<= 1;
		}

		// Decode note
		this.note = note.readUInt8(0) & decompressed;
		this.instrument = note.readUInt8(1) & decompressed;
		this.volume = note.readUInt8(2) & decompressed;
		this.effect = note.readUInt8(3) & decompressed;
		this.effectParam = note.readUInt8(4) & decompressed;
	}
}