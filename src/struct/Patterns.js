class Patterns {
	// Stores multiple patterns and provides a toString method
	constructor(patterns = []) {
		this.patterns = patterns;
	}

	toString() {
		let returnString = '';
		for (let i = 0; i < this.patterns.length; i++) {
			returnString += this.patterns[i].toString() + '\n';
		}
		return returnString;
	}

	push(pattern) {
		this.patterns.push(pattern);
	}

	removePattern(index) {
		this.patterns.splice(index, 1);
	}

	getPattern(index) {
		return this.patterns[index];
	}

	setPattern(index, pattern) {
		this.patterns[index] = pattern;
	}

	addPattern(pattern, index) {
		this.patterns.splice(index, 0, pattern);
	}

	setPatterns(patterns) {
		this.patterns = patterns;
	}

	getPatterns() {
		return this.patterns;
	}
}

module.exports = Patterns;