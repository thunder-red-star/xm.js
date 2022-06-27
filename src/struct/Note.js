class Note {
	static NOTES = [
		'...', 'C-1', 'C#1', 'D-1', 'D#1', 'E-1', 'F-1', 'F#1', 'G-1', 'G#1', 'A-1', 'A#1', 'B-1',
		'C-2', 'C#2', 'D-2', 'D#2', 'E-2', 'F-2', 'F#2', 'G-2', 'G#2', 'A-2', 'A#2', 'B-2',
		'C-3', 'C#3', 'D-3', 'D#3', 'E-3', 'F-3', 'F#3', 'G-3', 'G#3', 'A-3', 'A#3', 'B-3',
		'C-4', 'C#4', 'D-4', 'D#4', 'E-4', 'F-4', 'F#4', 'G-4', 'G#4', 'A-4', 'A#4', 'B-4',
		'C-5', 'C#5', 'D-5', 'D#5', 'E-5', 'F-5', 'F#5', 'G-5', 'G#5', 'A-5', 'A#5', 'B-5',
		'C-6', 'C#6', 'D-6', 'D#6', 'E-6', 'F-6', 'F#6', 'G-6', 'G#6', 'A-6', 'A#6', 'B-6',
		'C-7', 'C#7', 'D-7', 'D#7', 'E-7', 'F-7', 'F#7', 'G-7', 'G#7', 'A-7', 'A#7', 'B-7',
		'C-8', 'C#8', 'D-8', 'D#8', 'E-8', 'F-8', 'F#8', 'G-8', 'G#8', 'A-8', 'A#8', 'B-8',
		'==='
	];

	static VOLUME_EFFECTS = [
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
		'00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '0A', '0B', '0C', '0D', '0E', '0F',
		'10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '1A', '1B', '1C', '1D', '1E', '1F',
		'20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '2A', '2B', '2C', '2D', '2E', '2F',
		'30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '3A', '3B', '3C', '3D', '3E', '3F',
		'40', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
		undefined, '-1', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-A', '-B', '-C', '-D', '-E', '-F',
		undefined, '+1', '+2', '+3', '+4', '+5', '+6', '+7', '+8', '+9', '+A', '+B', '+C', '+D', '+E', '+F',
		undefined, '▼1', '▼2', '▼3', '▼4', '▼5', '▼6', '▼7', '▼8', '▼9', '▼A', '▼B', '▼C', '▼D', '▼E', '▼F',
		undefined, '▲1', '▲2', '▲3', '▲4', '▲5', '▲6', '▲7', '▲8', '▲9', '▲A', '▲B', '▲C', '▲D', '▲E', '▲F',
		undefined, 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'SA', 'SB', 'SC', 'SD', 'SE', 'SF',
		undefined, 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'VA', 'VB', 'VC', 'VD', 'VE', 'VF',
		'P0', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'PA', 'PB', 'PC', 'PD', 'PE', 'PF',
		undefined, '<1', '<2', '<3', '<4', '<5', '<6', '<7', '<8', '<9', '<A', '<B', '<C', '<D', '<E', '<F',
		undefined, '>1', '>2', '>3', '>4', '>5', '>6', '>7', '>8', '>9', '>A', '>B', '>C', '>D', '>E', '>F',
		'M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'MA', 'MB', 'MC', 'MD', 'ME', 'MF',
	]

	static EFFECT_MAP = {
		"10": "G",
		"11": "H",
		"15": "L",
		"19": "P",
		"1B": "R",
		"21": "X",
	}

	/*
	 * Note class:
	 * Bytes 00-01: Note
	 * Bytes 01-02: Instrument
	 * Bytes 02-03: Volume
	 * Bytes 03-04: Effect
	 * Bytes 04-05: Effect Parameter
	 */
	constructor(note, instrument, volume, effect, effectParam) {
		if (note === null) {
			note = null;
		} else if (note < 0 || note > Note.NOTES.length) {
			note = null;
		}
		if (instrument === null) {
			instrument = null;
		} else {
			instrument = Math.min(Math.max(instrument, 0), 255);
		}
		if (volume === null) {
			volume = null
		} else {
			volume = volume;
		}
		if (effect === null) {
			effect = null;
		} else {
			effect = effect;
		}
		if (effectParam === null) {
			effectParam = null;
		} else {
			effectParam = effectParam;
		}

		this.note = note;
		this.instrument = instrument;
		this.volume = volume;
		this.effect = effect;
		this.effectParam = effectParam;
	}

	getNote() {
		return this.note;
	}

	getInstrument() {
		return this.instrument;
	}

	getVolume() {
		return this.volume;
	}

	getEffect() {
		return this.effect;
	}

	getEffectParam() {
		return this.effectParam;
	}

	setNote(note) {
		if (note < 0 || note > Note.NOTES.length) {
			throw new Error('Invalid note: ' + note);
		}
	}

	setInstrument(instrument) {
		this.instrument = instrument;
	}

	setVolume(volume) {
		this.volume = volume;
	}

	setEffect(effect) {
		this.effect = effect;
	}

	setEffectParam(effectParam) {
		this.effectParam = effectParam;
	}

	convertVolumeEffect(volume) {
		if (volume === null) {
			return "..";
		} else {
			// Find volume representation in VOLUME_EFFECTS
			return Note.VOLUME_EFFECTS[volume] || '..';
		}
	}


	toString() {
		return `${this.convertNote(this.note)} ${this.convertInstrument(this.instrument)} ${this.convertVolumeEffect(this.volume)} ${this.convertEffect(this.effect)}${this.convertEffectParam(this.effectParam)}`;
	}

	convertNote(note) {
		return Note.NOTES[note] || '...';
	}

	convertInstrument(instrument) {
		if (instrument === 0 || instrument === null) {
			return '..';
		} else {
			if (instrument <= 0x0F) {
				return '0' + instrument.toString(16).toUpperCase()
			} else {
				return instrument.toString(16).toUpperCase();
			}
		}
	}

	convertEffect(effect) {
		if (effect === null) {
			return '.';
		}
		if (Object.keys(Note.EFFECT_MAP).includes(effect.toString(16))) {
			return Note.EFFECT_MAP[effect.toString(16)].toUpperCase();
		} else {
			return effect.toString(16).toUpperCase();
		}
	}

	convertEffectParam(effectParam) {
		if (effectParam === null && this.effect === null) {
			return '..';
		} else if (effectParam === null) {
			return '00';
		}
		if (effectParam === 0x00) {
			return '00';
		} else {
			if (effectParam <= 0x0F) {
				return '0' + effectParam.toString(16).toUpperCase();
			} else {
				return effectParam.toString(16).toUpperCase();
			}
		}
	}

	toBuffer () {
		// Compress note such that the first byte represents the existence of note, instrument, volume, effect, and effectParam, if at least one of these is missing, else, just return the bytes for each
		/*
		  I.e. reversing the following:
		  let firstByte = xm.readUInt8(offset);
		offset++;
		if (firstByte & 0x80) {
			if (firstByte & 0x01) {
				note = xm.readUInt8(offset);
				offset++;
			}
			if (firstByte & 0x02) {
				instrument = xm.readUInt8(offset);
				offset++;
			}
			if (firstByte & 0x04) {
				volume = xm.readUInt8(offset);
				offset++;
			}
			if (firstByte & 0x08) {
				effect = xm.readUInt8(offset);
				offset++;
			}
			if (firstByte & 0x10) {
				effectParameter = xm.readUInt8(offset);
				offset++;
			}
		} else {
			note = firstByte;
			instrument = xm.readUInt8(offset);
			offset++;
			volume = xm.readUInt8(offset);
			offset++;
			effect = xm.readUInt8(offset);
			offset++;
			effectParameter = xm.readUInt8(offset);
			offset++;
		}

		 */

		let firstByte = 0x00;
		if (this.note !== null) {
			firstByte |= 0x01;
		}
		if (this.instrument !== null) {
			firstByte |= 0x02;
		}
		if (this.volume !== null) {
			firstByte |= 0x04;
		}
		if (this.effect !== null) {
			firstByte |= 0x08;
		}
		if (this.effectParam !== null) {
			firstByte |= 0x10;
		}

		if (firstByte !== 0) {
			firstByte |= 0x80
		}

		// Allocate enough to hold the first byte and the rest of the data
		let buffer;

		if (firstByte & 0x80) {
			buffer = Buffer.alloc(this.packedSize());

			buffer.writeUInt8(firstByte, 0)
			let offset = 1
			if (this.note !== null) {
				buffer.writeUInt8(this.note, offset);
				offset++;
			}
			if (this.instrument !== null) {
				buffer.writeUInt8(this.instrument, offset);
				offset++;
			}
			if (this.volume !== null) {
				buffer.writeUInt8(this.volume, offset);
				offset++;
			}
			if (this.effect !== null) {
				buffer.writeUInt8(this.effect, offset);
				offset++;
			}
			if (this.effectParam !== null) {
				buffer.writeUInt8(this.effectParam, offset);
				offset++;
			}
		} else {
			buffer = Buffer.alloc(5);
			buffer.writeUInt8(this.note, 0);
			buffer.writeUInt8(this.instrument, 1);
			buffer.writeUInt8(this.volume, 2);
			buffer.writeUInt8(this.effect, 3);
			buffer.writeUInt8(this.effectParam, 4);
		}

		return buffer;
	}

	packedSize () {
		let firstByte = 0x00;
		if (this.note !== null) {
			firstByte |= 0x01;
		}
		if (this.instrument !== null) {
			firstByte |= 0x02;
		}
		if (this.volume !== null) {
			firstByte |= 0x04;
		}
		if (this.effect !== null) {
			firstByte |= 0x08;
		}
		if (this.effectParam !== null) {
			firstByte |= 0x10;
		}

		if (firstByte !== 0) {
			firstByte |= 0x80
		}

		if (firstByte & 0x80) {
			return 1 + (firstByte & 0x01 ? 1 : 0) + (firstByte & 0x02 ? 1 : 0) + (firstByte & 0x04 ? 1 : 0) + (firstByte & 0x08 ? 1 : 0) + (firstByte & 0x10 ? 1 : 0);
		} else {
			return 5;
		}
	}
}

module.exports = Note;