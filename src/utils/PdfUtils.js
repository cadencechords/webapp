import { Document, Font, Page, Text, View } from "@react-pdf/renderer";
import { formatChordPro, isChordLine, isNewLine } from "./SongUtils";

import OpenSansBold from "../fonts/OpenSans-Bold.ttf";
import OpenSansBoldItalic from "../fonts/OpenSans-BoldItalic.ttf";
import OpenSansItalic from "../fonts/OpenSans-Italic.ttf";
import OpenSansRegular from "../fonts/OpenSans-Regular.ttf";
import RobotoBold from "../fonts/RobotoMono-Bold.ttf";
import RobotoBoldItalic from "../fonts/RobotoMono-BoldItalic.ttf";
import RobotoItalic from "../fonts/RobotoMono-Italic.ttf";
import RobotoRegular from "../fonts/RobotoMono-Regular.ttf";

export function toPdf(song, showChords) {
	let pdfLines = "";
	if (song?.content) {
		registerFonts(song.format);
		pdfLines = constructPdfLines(song, showChords);
	} else {
		pdfLines = <Text></Text>;
	}

	let pdf = (
		<Document creator="Cadence" producer="Cadence" author="Cadence">
			<Page size="A4" style={PDF_STYLES}>
				<View style={{ fontFamily: song.format.font }}>
					<View style={{ marginBottom: ".25in", fontWeight: "bold" }}>
						<Text>{song.name}</Text>
					</View>
					<View
						style={{
							fontSize: song.format.font_size + "px",
							flexGrow: 1,
						}}
					>
						{pdfLines}
					</View>
				</View>
			</Page>
		</Document>
	);

	return pdf;
}

function registerFonts(format) {
	if (isAllowedFont(format.font)) {
		let fontStyles = constructFontStyles(format);
		Font.register({ family: format.font, fonts: fontStyles });
	}
}

function isAllowedFont(font) {
	return Boolean(ALLOWED_FONTS[font]);
}

function constructFontStyles(format) {
	let fontStyles = [];
	fontStyles.push(constructNormalFontStyle(format.font));

	if (format.bold_chords && format.italic_chords) {
		fontStyles.push(constructBoldItalicFontStyle(format.font));
	} else if (format.bold_chords) {
		fontStyles.push(constructBoldFontStyle(format.font));
	} else if (format.italic_chords) {
		fontStyles.push(constructItalicFontStyle(format.font));
	}

	return fontStyles;
}

function constructNormalFontStyle(font) {
	let importedFontSrc = FONT_IMPORTS[font].regular;
	return { src: importedFontSrc };
}

function constructBoldItalicFontStyle(font) {
	let importedFontSrc = FONT_IMPORTS[font].boldItalic;
	return { src: importedFontSrc, fontStyle: "italic", fontWeight: "bold" };
}

function constructBoldFontStyle(font) {
	let importedFontSrc = FONT_IMPORTS[font].bold;
	return { src: importedFontSrc, fontWeight: "bold" };
}

function constructItalicFontStyle(font) {
	let importedFontSrc = FONT_IMPORTS[font].italic;
	return { src: importedFontSrc, fontStyle: "italic" };
}

function constructChordStyles(format) {
	let chordStyles = {};

	if (format.bold_chords) {
		chordStyles.fontWeight = "bold";
	}

	if (format.italic_chords) {
		chordStyles.fontStyle = "italic";
	}

	return chordStyles;
}

function constructPdfLines(song, showChords) {
	let chordStyles = constructChordStyles(song.format);
	let linesOfSong = formatChordPro(song.content).split(/\r\n|\r|\n/);
	let pdfLines = linesOfSong.map((line, index) => {
		if (isNewLine(line)) {
			return <Text key={index}> &nbsp;</Text>;
		} else if (isChordLine(line) && showChords) {
			return (
				<View style={chordStyles} key={index}>
					<Text>
						&nbsp;
						{line}
					</Text>
				</View>
			);
		} else if (!isChordLine(line)) {
			return <Text key={index}>&nbsp;{line}</Text>;
		} else {
			return null;
		}
	});

	return pdfLines;
}

const ALLOWED_FONTS = { "Roboto Mono": "Roboto Mono", "Open Sans": "Open Sans" };

const FONT_IMPORTS = {
	"Roboto Mono": {
		regular: RobotoRegular,
		boldItalic: RobotoBoldItalic,
		bold: RobotoBold,
		italic: RobotoItalic,
	},
	"Open Sans": {
		regular: OpenSansRegular,
		boldItalic: OpenSansBoldItalic,
		bold: OpenSansBold,
		italic: OpenSansItalic,
	},
};

const PDF_STYLES = {
	paddingTop: ".75in",
	paddingBottom: ".75in",
	paddingLeft: "1in",
	paddingRight: "1in",
};
