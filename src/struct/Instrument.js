class Instrument {
	constructor (header, samples) {
		this.header = header;
		this.samples = samples;
	}

	getHeader() {
		return this.header;
	}

	getSamples() {
		return this.samples;
	}

	toString() {
		let returnString = (this.header.name !== "" ? this.header.name : "<no name>") + " (" + this.header.numSamples + " samples)" + "\n";
		for (let i = 0; i < this.samples.length; i++) {
			returnString += "    " + this.samples[i].toString() + (i < this.samples.length - 1 ? "\n" : "");
		}
		return returnString;
	}
}

module.exports = Instrument;