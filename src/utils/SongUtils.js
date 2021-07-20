import { Page, Text, View, Document, Font } from "@react-pdf/renderer";
import ReactDOMServer from "react-dom/server";

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
			} else {
				return "";
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

export function toHtmlString(songText) {
	if (songText) {
		let linesOfSong = songText.split(/\r\n|\r|\n/);
		let html = linesOfSong.map((line, index) => {
			if (isNewLine(line)) {
				return (
					<p key={index}>
						<br />
					</p>
				);
			} else {
				return <p key={index}>{line}</p>;
			}
		});

		return ReactDOMServer.renderToStaticMarkup(html);
	}
}

export function toHtml(songText, formatOptions) {
	if (songText) {
		let linesOfSong = songText.split(/\r\n|\r|\n/);

		if (!formatOptions.boldChords && !formatOptions.italicChords) {
			return linesOfSong.map((line, index) => {
				if (isNewLine(line)) {
					return (
						<p key={index}>
							<br />
						</p>
					);
				} else {
					return (
						<p key={index} className="whitespace-pre">
							{line}
						</p>
					);
				}
			});
		} else {
			return linesOfSong.map((line, index) => {
				if (isChordLine(line)) {
					if (formatOptions.showChordsDisabled) {
						return null;
					} else {
						if (formatOptions.boldChords && formatOptions.italicChords) {
							return (
								<p key={index} className="whitespace-pre">
									<i>
										<strong>{line}</strong>
									</i>
								</p>
							);
						} else if (formatOptions.boldChords) {
							return (
								<p key={index} className="whitespace-pre">
									<strong>{line}</strong>
								</p>
							);
						} else {
							return (
								<p key={index} className="whitespace-pre">
									<i>{line}</i>
								</p>
							);
						}
					}
				} else if (isNewLine(line)) {
					return (
						<p key={index}>
							<br />
						</p>
					);
				} else {
					return <p key={index}>{line}</p>;
				}
			});
		}
	} else {
		return <i>No content yet</i>;
	}
}

export function getFormats(songText, formatOptions) {
	let linesOfSong = songText.split(/\r\n|\r|\n/);
	let formats = [];

	if (formatOptions.boldChords || formatOptions.italicChords) {
		let characterPosition = 0;
		linesOfSong.forEach((line) => {
			formats.push({
				start: characterPosition,
				length: line.length,
				format: "bold",
				value: isChordLine(line) && formatOptions.boldChords,
			});

			formats.push({
				start: characterPosition,
				length: line.length,
				format: "italic",
				value: isChordLine(line) && formatOptions.italicChords,
			});

			characterPosition += line.length + 1;
		});
	} else {
		let format = { start: 0, length: songText.length, format: "bold", value: false };
		formats.push(format);
		format = { start: 0, length: songText.length, format: "italic", value: false };
		formats.push(format);
	}

	formats.push({ start: 0, length: songText.length, format: "font", value: formatOptions.font });

	return formats;
}

export function parseQuality(key) {
	if (key?.length > 0) {
		return isMinor(key) ? "m" : "";
	} else {
		return key;
	}
}

function isMinor(key) {
	let lastChar = key.charAt(key.length - 1);
	return lastChar === "m";
}

export function parseNote(key) {
	if (key?.length > 0) {
		if (isMinor(key)) {
			let notePart = key.substring(0, key.length - 1);
			return notePart;
		} else {
			return key;
		}
	} else {
		return key;
	}
}
