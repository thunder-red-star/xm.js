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
}


module.exports = Pattern;