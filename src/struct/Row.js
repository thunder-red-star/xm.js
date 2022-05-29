class Row {
	// A row of Note objects
	constructor(notes) {
		this.notes = notes;
	}

	getNotes() {
		return this.notes;
	}

	getNote(channel) {
		return this.notes[channel];
	}

	setNote(channel, note) {
		this.notes[channel] = note;
	}

	setNotes(notes) {
		this.notes = notes;
	}

	toString() {
		let returnString = '';
		for (let i = 0; i < this.notes.length; i++) {
			returnString += this.notes[i].toString() + '  ';
		}
		return returnString;
	}
}

module.exports = Row;