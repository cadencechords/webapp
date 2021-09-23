import * as Transposer from "chord-transposer";

import ReactDOMServer from "react-dom/server";

export function isChordLine(line) {
	if (line) {
		let parts = line.split(" ");
		parts = parts.map((part) => part.replace(/\s/g, ""));
		parts = parts.filter((part) => part !== "");
		let numChordMatches = 0;

		parts?.forEach((part) => {
			if (isChord(part)) {
				++numChordMatches;
			}
		});

		return numChordMatches >= parts.length / 2;
	} else {
		return false;
	}
}

function isChord(potentialChord) {
	try {
		Transposer.Chord.parse(potentialChord);
		return true;
	} catch {
		return false;
	}
}

export function isNewLine(line) {
	return line === "";
}

export function parseAlignment(alignment) {
	if (alignment === "left" || alignment === "center" || alignment === "right") {
		return "text-" + alignment;
	} else {
		return "text-left";
	}
}

export function toPdf(song, showChords) {}

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

export function toHtml(songText, formatOptions, whitespacePreWrap = true) {
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
				} else if (isChordLine(line)) {
					if (formatOptions.showChordsDisabled) {
						return null;
					} else {
						return (
							<p
								key={index}
								className={whitespacePreWrap ? "whitespace-pre-wrap" : "whitespace-pre"}
							>
								{line}
							</p>
						);
					}
				} else {
					return (
						<p key={index} className={whitespacePreWrap ? "whitespace-pre-wrap" : "whitespace-pre"}>
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
								<p
									key={index}
									className={whitespacePreWrap ? "whitespace-pre-wrap" : "whitespace-pre"}
								>
									<i>
										<strong>{line}</strong>
									</i>
								</p>
							);
						} else if (formatOptions.boldChords) {
							return (
								<p
									key={index}
									className={whitespacePreWrap ? "whitespace-pre-wrap" : "whitespace-pre"}
								>
									<strong>{line}</strong>
								</p>
							);
						} else {
							return (
								<p
									key={index}
									className={whitespacePreWrap ? "whitespace-pre-wrap" : "whitespace-pre"}
								>
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

	if (formatOptions.bold_chords || formatOptions.italic_chords) {
		let characterPosition = 0;
		linesOfSong.forEach((line) => {
			formats.push({
				start: characterPosition,
				length: line.length,
				format: "bold",
				value: isChordLine(line) && formatOptions.bold_chords,
			});

			formats.push({
				start: characterPosition,
				length: line.length,
				format: "italic",
				value: isChordLine(line) && formatOptions.italic_chords,
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
		return "";
	}
}

export function isMinor(key) {
	if (key) {
		let lastChar = key.charAt(key.length - 1);
		return lastChar === "m";
	} else {
		return key;
	}
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

export function transpose(song) {
	if (song?.original_key && song?.transposed_key && song?.content) {
		let linesOfSong = song.content.split(/\r\n|\r|\n/);

		let transposedContent = "";

		linesOfSong.forEach((line) => {
			if (isChordLine(line)) {
				let transposedLine = Transposer.transpose(line)
					.fromKey(song.original_key)
					.toKey(song.transposed_key)
					.toString();

				transposedContent += transposedLine + "\n";
			} else {
				transposedContent += line + "\n";
			}
		});

		return transposedContent;
	} else {
		return song?.content ? song.content : "";
	}
}

export function getHalfStepHigher(key) {
	return Transposer.transpose(key).up(1).toString();
}

export function getHalfStepLower(key) {
	return Transposer.transpose(key).down(1).toString();
}

export function hasAnyKeysSet(song) {
	return song.original_key || song.transposed_key;
}
