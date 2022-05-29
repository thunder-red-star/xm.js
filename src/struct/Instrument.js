class Instrument {
	constructor (xm) {
		// Assume xm is a buffer or a string
		if (typeof xm === 'string') {
			xm = Buffer.from(xm, 'binary');
		} else if (xm instanceof ArrayBuffer) {
			xm = Buffer.from(xm);
		}

		// Read header
		this.header = {
			size: xm.readUInt16LE(0)
		};
		this.name = xm.toString('ascii', 2, 22);
		this.sample = xm.slice(22, this.header.size);
	}
}