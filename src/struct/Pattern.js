const Note = require('./Note');
const Row = require('./Row');
class Pattern {
	/*
	 * Pattern header:
	 * Bytes 00-04: Pattern Header Size
	 * Bytes 04-05: Packing Type
	 * Bytes 05-07: Number of rows
	 * Bytes 07-09: Packed Pattern Data Size
	 * Bytes 09-??: Packed Pattern Data
	 */

	/*
	 * Note decompression (read MSB first):
	 * bit 0 set: Note follows
	 *  1 set: Instrument follows
	 *  2 set: Volume column byte follows
	 *  3 set: Effect type follows
	 *  4 set: Effect parameter follows
	 */
	constructor(patternHeader, patternRows) {
		this.header = patternHeader;
		this.rows = patternRows;
	}

	toString () {
		let returnString = '';
		for (let i = 0; i < this.rows.length; i++) {
			returnString += this.rows[i].toString() + '\n';
		}
		return returnString;
	}

	toBuffer () {
		// Write pattern header
		let headerBuffer = Buffer.alloc(9);
		headerBuffer.writeUInt32LE(9, 0);
		headerBuffer.writeUInt8(this.header.packingType, 4);
		headerBuffer.writeUInt16LE(this.rows.length, 5);
		headerBuffer.writeUInt16LE(this.packedPatternDataSize(), 7);
		Buffer.concat([headerBuffer, Buffer.from(this.header.numRows.toString(16), 'hex')]);

		// Write pattern rows
		let rowBuffer = Buffer.alloc(this.packedPatternDataSize())

		// Write
		let offset = 0;
		for (let x = 0; x < this.rows.length; x++) {
			this.rows[x].toBuffer().copy(rowBuffer, offset)
			offset += this.rows[x].rowDataSize();
		}
		return Buffer.concat([headerBuffer, rowBuffer]);

	}

	packedPatternDataSize() {
		let size = 0;
		for (let x = 0; x < this.rows.length; x++) {
			size += this.rows[x].rowDataSize();
		}
		return size
	}
}


module.exports = Pattern;