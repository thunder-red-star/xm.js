class Pattern {
	constructor(xm) {
		// Placeholder while I get tests working
	}

	getRow(row) {
		return this.data.slice(row * 64, (row + 1) * 64);
	}
}

module.exports = Pattern;