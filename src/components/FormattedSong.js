import { isChordLine, isNewLine, parseAlignment } from "../utils/songUtils";

export default function FormattedSong({ song, formatOptions }) {
	let linesOfSong = song.split(/\r\n|\r|\n/);

	let formattedSong = linesOfSong.map((line, index) => {
		if (isChordLine(line))
			return (
				<ChordLine key={index} formatOptions={formatOptions}>
					{line}
				</ChordLine>
			);
		else if (isNewLine(line)) return <NewLine key={index} />;
		else
			return (
				<LyricLine key={index} formatOptions={formatOptions}>
					{line}
				</LyricLine>
			);
	});

	let songFormats = "";
	songFormats += parseAlignment(formatOptions?.alignment);
	return <div className={songFormats}>{formattedSong}</div>;
}

export function NewLine() {
	return <br />;
}

export function ChordLine({ children, formatOptions }) {
	let classes = "text-xl whitespace-pre-wrap ";

	if (formatOptions.boldChords) {
		classes += " font-semibold";
	}

	let styles = {
		fontFamily: formatOptions.font ? formatOptions.font : "monospace",
		fontSize: formatOptions.fontSize + "px",
	};

	return (
		<p className={classes} style={styles}>
			{children}
		</p>
	);
}

export function LyricLine({ children, formatOptions }) {
	let styles = {
		fontFamily: formatOptions.font ? formatOptions.font : "monospace",
		fontSize: formatOptions.fontSize + "px",
	};
	return (
		<p className="text-xl whitespace-pre-wrap" style={styles}>
			{children}
		</p>
	);
}
