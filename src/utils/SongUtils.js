export function format(song, formatOptions) {
	let linesOfSong = song.split(/\r\n|\r|\n/);

	let formattedSong = linesOfSong.map((line) => {
		console.log(line);
		if (isChordLine(line)) {
			return <p className="text-xl text-blue-500 font-semibold whitespace-pre-wrap">{line}</p>;
		} else if (isNewLine(line)) {
			return <br />;
		} else {
			return <p className="text-xl text-black font-semibold whitespace-pre-wrap">{line}</p>;
		}
	});

	let songFormats = "";
	songFormats += parseAlignment(formatOptions?.alignment);
	return <div className={songFormats}>{formattedSong}</div>;
}

export function isChordLine(line) {
	if (line) {
		let parts = line.split(" ");
		parts = parts.map((part) => part.replace(/\s/g, ""));
		parts = parts.filter((part) => part !== "");
		console.log(parts);
		let numChordMatches = 0;

		parts?.forEach((part) => {
			if (POSSIBLE_MAJOR_CHORDS[part] || POSSIBLE_MINOR_CHORDS[part]) {
				++numChordMatches;
			}
		});

		return numChordMatches > parts.length / 2;
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

function parseAlignment(alignment) {
	if (alignment === "left" || alignment === "center" || alignment === "right") {
		return "text-" + alignment;
	} else {
		return "text-left";
	}
}
