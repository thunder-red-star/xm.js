class Pattern {
	constructor(xm) {
		this.header = {
			size: xm.readUInt16LE(0)
		};
		this.rows = xm.readUInt16LE(2);
		this.data = xm.slice(4);
	}

	getRow(row) {
		return this.data.slice(row * 64, (row + 1) * 64);
	}
}

module.exports = Pattern;