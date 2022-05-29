class Sample {
	constructor(xm) {
		// Get sample header
		this.header = {
			length: xm.readUInt16LE(0),
			loopStart: xm.readUInt16LE(2),
			loopLength: xm.readUInt16LE(4),
		};
	}
}
