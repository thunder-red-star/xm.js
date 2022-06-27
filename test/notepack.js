const Note = require("../src/struct/Note");

let note = new Note(null, null, null, 9, 50);

console.log(note.toString());
console.log("The packed size of this note is " + note.packedSize())
console.log("It should be 3 bytes");