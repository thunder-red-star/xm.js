class Pattern {
	constructor(xm) {
		/*

		 */
	}

	getRow(row) {
		return this.data.slice(row * 64, (row + 1) * 64);
	}
}

module.exports = Pattern;