const WavEncoder = require('../util/WavEncoder');

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

	compress() {
		// Get the sample compression type (this.header.type, bit 4). If it's 0x00, then the sample is compressed with delta-packing. If it's 0xAD, then the sample is compressed with ADPCM.

		if (this.header.packingType === 0x00) {
			// Delta-Packing
			if (this.header.type & 0x10) {
				// 16-bit sample
				let delta = 0x00
				for (let i = 0; i < this.data.length; (i += 2)) {
					delta += this.data[i];
					dataBuffer.writeUInt16LE(delta + 0x8000, i);
				}
			} else {
				// 8-bit sample
				let delta = 0x00
				for (let i = 0; i < this.data.length; i++) {
					delta += this.data[i];
					dataBuffer.writeUInt8(delta + 0x80, i);
				}
			}
		}
	}

	getRaw() {
		// Will output binary data that represents the sample in wav format.

		let waveformPrepared = [];
		for (let i = 0; i < this.data.length; i++) {
			waveformPrepared.push(this.data[i] / 128);
		}

		// Encode the sample to wav format
		const waveform = {
			sampleRate: 44100,
			channelData: [
				waveformPrepared, waveformPrepared
			]
		}

		// Encode the sample to wav format
		const wa = WavEncoder.encodeSync(waveform);

		// Return the encoded sample
		return new Buffer(wa)
	}

	/*
	 * Sample header:
	 * Bytes 00-04: Sample length
	 * Bytes 04-08: Sample loop start
	 * Bytes 08-12: Sample loop length
	 * Bytes 12-13: Sample volume
	 * Bytes 13-14: Sample finetune
	 * Bytes 14-15: Sample type
	 * Bytes 15-16: Sample panning
	 * Bytes 16-17: Sample relative note number
	 * Bytes 17-18: Sample packing type
	 * Bytes 18-40: Sample name
	 */

	toHeaderBuffer() {
		let buffer = Buffer.alloc(40);
		buffer.writeUInt32LE(this.header.length, 0);
		buffer.writeUInt32LE(this.header.loopStart, 4);
		buffer.writeUInt32LE(this.header.loopLength, 8);
		buffer.writeUInt8(this.header.volume, 12);
		buffer.writeUInt8(this.header.finetune, 13);
		buffer.writeUInt8(this.header.type, 14);
		buffer.writeUInt8(this.header.panning, 15);
		buffer.writeUInt8(this.header.relativeNoteNumber, 16);
		buffer.writeUInt8(this.header.packingType, 17);
		buffer.write(this.header.name, 18, 40, "ascii");

		return buffer
	}

	toDataBuffer() {
		// Encode the sample data
		let sampleBits = (this.header.type & 0x10) ? 16 : 8;
		let dataBuffer = Buffer.alloc((this.data.length * sampleBits) / 8);
		if (this.header.packingType === 0x00) {
			// Convert to signed delta values
			let lastValue = this.data[0];
			for (let i = 1; i < this.data.length; i++) {
				let delta = (this.data[i] - lastValue);
				if (delta < -128) {
					// Go the other way
					delta = 256 + delta;
				} else if (delta > 127) {
					// Go the other way
					delta = -(256 - delta);
				}
				lastValue = this.data[i];
				// If the delta is negative, then it's a signed value
				if (sampleBits === 8) {
					dataBuffer.writeInt8(delta, i - 1);
				} else {
					dataBuffer.writeInt16LE(delta, i - 1);
				}
			}
		} else if (this.header.packingType === 0xAD) {
			// ADPCM, not implemented yet
			console.log("ADPCM packing not implemented yet");
		} else {
			// Unknown packing type
			console.log("Unknown packing type");
		}
		// Return the header and data
		return dataBuffer;
	}
}

module.exports = Sample;