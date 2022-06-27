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

	toBuffer () {
		let buffer = Buffer.alloc(this.rowDataSize());
		let offset = 0;
		for (let i = 0; i < this.notes.length; i++) {
			this.notes[i].toBuffer().copy(buffer, offset)
			offset += this.notes[i].packedSize()
		}
		return buffer;
	}

	toHex () {
		let buffer = Buffer.alloc(this.rowDataSize());
		let offset = 0;
		for (let i = 0; i < this.notes.length; i++) {
			this.notes[i].toBuffer().copy(buffer, offset)
			offset += this.notes[i].packedSize()
		}
		return buffer.toString("hex")
	}


	rowDataSize() {
		let size = 0;
		for (let x = 0; x < this.notes.length; x++) {
			size += this.notes[x].packedSize();
		}
		return size;
	}
}


module.exports = Row;