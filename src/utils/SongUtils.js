import * as Transposer from "chord-transposer";

import ChordSheetJS from "chordsheetjs";
import TextAutosize from "../components/TextAutosize";

const CHORD_PRO_REGEX = new RegExp(/[[].*[\]]/);

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

		linesOfSong.forEach((line, index) => {
			if (isChordLine(line)) {
				let transposedLine = Transposer.transpose(line)
					.fromKey(song.original_key)
					.toKey(song.transposed_key)
					.toString();

				transposedContent += transposedLine;
			} else {
				transposedContent += line;
			}

			if (index < linesOfSong.length - 1) {
				transposedContent += "\n";
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

export function html(song, onLineDoubleClick) {
	let songCopy = { ...song };
	if (song?.content && song?.format) {
		if (isChordPro(songCopy.content)) {
			songCopy.content = formatChordPro(songCopy.content);
		}
		let content = songCopy.show_transposed ? transpose(songCopy) : songCopy.content;
		let linesOfSong = content.split(/\r\n|\r|\n/);

		let htmlLines = linesOfSong.map((line, index) => {
			if (isNewLine(line))
				return <br key={index} onDoubleClick={() => onLineDoubleClick?.(line, index)} />;
			else {
				let lineClasses = determineClassesForLine(line, song.format);

				return (
					<p
						key={index}
						className={lineClasses}
						onDoubleClick={() => onLineDoubleClick?.(line, index)}
					>
						{line}
					</p>
				);
			}
		});
		return (
			<div style={{ fontFamily: song.format.font }}>
				<TextAutosize autosize={song.format.autosize} fontSize={song.format.font_size}>
					{htmlLines}
				</TextAutosize>
			</div>
		);
	}

	return "";
}

function isChordPro(content) {
	return CHORD_PRO_REGEX.test(content);
}

function determineClassesForLine(line, format) {
	let baseClasses = format.autosize ? "whitespace-pre" : "whitespace-pre-wrap";
	if (isChordLine(line)) {
		return `${baseClasses} ${determineClassesForChordLine(format)}`;
	} else {
		return `${baseClasses}`;
	}
}

function determineClassesForChordLine(format) {
	if (format.chords_hidden) {
		return "hidden";
	}

	let classes = "";

	if (format.bold_chords) classes += " font-semibold";
	if (format.italic_chords) classes += " italic";

	return classes;
}

export function formatChordPro(content) {
	const parser = new ChordSheetJS.ChordProParser();
	try {
		const song = parser.parse(content);
		const formatter = new ChordSheetJS.TextFormatter();
		return formatter.format(song);
	} catch (error) {
		return content;
	}
}

export function countLines(content) {
	if (content) {
		return formatChordPro(content).split(/\r\n|\r|\n/).length;
	} else {
		return 0;
	}
}
