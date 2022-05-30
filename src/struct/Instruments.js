class Instruments {
	// Store an array of instruments
	constructor(instrumentArray = []) {
		this.instruments = instrumentArray;
	}

	// Add an instrument to the array
	add(instrument) {
		this.instruments.push(instrument);
	}

	push(instrument) {
		this.instruments.push(instrument);
	}

	// Get an instrument by index
	get(index) {
		return this.instruments[index];
	}

	// Get the number of instruments
	length() {
		return this.instruments.length;
	}

	size() {
		return this.instruments.length;
	}

	set(index, instrument) {
		this.instruments[index] = instrument;
	}

	// Convert the instruments to a string
	toString() {
		let returnString = "";
		for (let i = 0; i < this.instruments.length; i++) {
			returnString += this.instruments[i].toString() + "\n";
		}
		return returnString;
	}
}

module.exports = Instruments;