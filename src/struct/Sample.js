class Sample {
	constructor(header, data) {
		this.header = header;
		this.data = data;
	}

	getHeader() {
		return this.header;
	}

	getData() {
		return this.data;
	}

	toString() {
		return (this.header.name !== "" ? this.header.name : "<no name>") + " (" + this.header.length + " bytes)";
	}
}

module.exports = Sample;