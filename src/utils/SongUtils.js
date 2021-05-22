export function isChordLine(line) {
	if (line) {
		let parts = line.split(" ");
		parts = parts.map((part) => part.replace(/\s/g, ""));
		parts = parts.filter((part) => part !== "");
		let numChordMatches = 0;

		parts?.forEach((part) => {
			if (POSSIBLE_MAJOR_CHORDS[part] || POSSIBLE_MINOR_CHORDS[part]) {
				++numChordMatches;
			}
		});

		return numChordMatches >= parts.length / 2;
	} else {
		return false;
	}
}

export function isNewLine(line) {
	return line === "";
}

// prettier-ignore
export const POSSIBLE_MAJOR_CHORDS = {
	"A": 1,
    "A#": 2,
    "Bb": 2,
	"B": 3,
	"C": 4,
    "C#": 5,
    "Db": 5,
	"D": 6,
    "D#": 7,
    "Eb": 7,
	"E": 8,
	"F": 9,
    "F#": 10,
    "Gb": 10,
	"G": 11,
    "G#": 12,
    "Ab": 12
};

// prettier-ignore
export const POSSIBLE_MINOR_CHORDS = {
	"Am": 1,
	"A#m": 2,
	"Bm": 3,
	"Cm": 4,
	"C#m": 5,
	"Dm": 6,
	"D#m": 7,
	"Em": 8,
	"Fm": 9,
	"F#m": 10,
	"Gm": 11,
	"G#m": 12,
};

export function parseAlignment(alignment) {
	if (alignment === "left" || alignment === "center" || alignment === "right") {
		return "text-" + alignment;
	} else {
		return "text-left";
	}
}
