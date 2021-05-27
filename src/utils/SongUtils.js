import { Page, Text, View, Document, Font } from "@react-pdf/renderer";

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

export function toPdf(song, showChords) {
	let pdfLines = "";

	if (song.content) {
		Font.register({
			family: "",
		});
		let linesOfSong = song.content.split(/\r\n|\r|\n/);

		pdfLines = linesOfSong.map((line, index) => {
			if (isNewLine(line)) {
				return <Text key={index}> &nbsp;</Text>;
			} else if (isChordLine(line) && showChords) {
				return <Text key={index}>{line}</Text>;
			} else if (!isChordLine(line)) {
				return (
					<Text key={index} style={{ marginBottom: 4 }}>
						{line}
					</Text>
				);
			}
		});

		// Font.register({ family: song.font });
	} else {
		pdfLines = <Text></Text>;
	}

	let pdf = (
		<Document creator="Cadence" producer="Cadence" author="Cadence">
			<Page size="A4">
				<View style={{ marginTop: ".75in", marginLeft: "1in", marginBottom: ".25in" }}>
					<Text>{song.name}</Text>
				</View>
				<View
					style={{
						fontSize: song.font_size + "px",
						marginLeft: "1in",
						marginRight: "1in",
						flexGrow: 1,
					}}
				>
					{pdfLines}
				</View>
			</Page>
		</Document>
	);

	return pdf;
}
