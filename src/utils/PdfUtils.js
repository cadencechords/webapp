import { Document, Font, Page, Text, View } from '@react-pdf/renderer';
import { isNewLine } from './SongUtils';
import { build, isChord, isChordLine } from '@cadencechords/chord-kit';

import OpenSansBold from '../fonts/OpenSans-Bold.ttf';
import OpenSansBoldItalic from '../fonts/OpenSans-BoldItalic.ttf';
import OpenSansItalic from '../fonts/OpenSans-Italic.ttf';
import OpenSansRegular from '../fonts/OpenSans-Regular.ttf';
import LiberationSansBold from '../fonts/LiberationSans-Bold.ttf';
import LiberationSansBoldItalic from '../fonts/LiberationSans-BoldItalic.ttf';
import LiberationSansItalic from '../fonts/LiberationSans-Italic.ttf';
import LiberationSansRegular from '../fonts/LiberationSans-Regular.ttf';
import RobotoBold from '../fonts/RobotoMono-Bold.ttf';
import RobotoBoldItalic from '../fonts/RobotoMono-BoldItalic.ttf';
import RobotoItalic from '../fonts/RobotoMono-Italic.ttf';
import RobotoRegular from '../fonts/RobotoMono-Regular.ttf';
import HighlightedText from '../components/pdf/HighlightedText';

export function toPdf(song, showChords) {
  let pdfLines = '';
  registerFonts(song.format);
  if (song?.content) {
    pdfLines = constructPdfLines(song, showChords);
  } else {
    pdfLines = <Text></Text>;
  }

  function getFontName(font) {
    return isAllowedFont(font) ? font : 'Liberation Sans';
  }

  let pdf = (
    <Document creator="Mezzo" producer="Mezzo" author="Mezzo">
      <Page size="A4" style={PDF_STYLES}>
        <View style={{ fontFamily: getFontName(song.format.font) }}>
          <View style={{ marginBottom: '.25in', fontWeight: 'bold' }}>
            <Text>{song.name}</Text>
          </View>
          <View
            style={{
              fontSize: song.format.font_size + 'px',
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
  const fontStyles = isAllowedFont(format.font)
    ? constructFontStyles(format)
    : constructFontStyles({ ...format, font: 'Liberation Sans' });

  Font.register({ family: format.font, fonts: fontStyles });
}

function isAllowedFont(font) {
  return ALLOWED_FONTS.includes(font);
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
  let importedFontSrc = FONT_IMPORTS[font]?.regular;
  return { src: importedFontSrc };
}

function constructBoldItalicFontStyle(font) {
  let importedFontSrc = FONT_IMPORTS[font].boldItalic;
  return { src: importedFontSrc, fontStyle: 'italic', fontWeight: 'bold' };
}

function constructBoldFontStyle(font) {
  let importedFontSrc = FONT_IMPORTS[font].bold;
  return { src: importedFontSrc, fontWeight: 'bold' };
}

function constructItalicFontStyle(font) {
  let importedFontSrc = FONT_IMPORTS[font].italic;
  return { src: importedFontSrc, fontStyle: 'italic' };
}

function constructChordStyles(format) {
  let chordStyles = {};

  if (format.bold_chords) {
    chordStyles.fontWeight = 'bold';
  }

  if (format.italic_chords) {
    chordStyles.fontStyle = 'italic';
  }

  if (format.chord_color) {
    chordStyles.color = format.chord_color;
  }

  return chordStyles;
}

function constructPdfLines(song, showChords) {
  let chordStyles = constructChordStyles(song.format);
  let content = build({
    ...song,
    format: { ...song.format, chords_hidden: !showChords },
  });

  let linesOfSong = content.split(/\r\n|\r|\n/);
  let pdfLines = linesOfSong.map((line, index) => {
    if (isNewLine(line)) {
      return <Text key={index}> &nbsp;</Text>;
    } else if (isChordLine(line) && showChords) {
      if (song.format.highlight_color) {
        const highlightedLine = buildHighlightedLine(line, {
          backgroundColor: song.format.highlight_color,
        });

        return (
          <View
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'row',
              position: 'relative',
              ...chordStyles,
            }}
          >
            {highlightedLine}
          </View>
        );
      } else {
        return (
          <View style={chordStyles} key={index}>
            <Text>{line}</Text>
          </View>
        );
      }
    } else if (!isChordLine(line)) {
      return <Text key={index}>{line}</Text>;
    } else {
      return null;
    }
  });

  return pdfLines;
}

function buildHighlightedLine(line, { backgroundColor } = {}) {
  let tokens = line.split(/(\s+)/);

  tokens = tokens.map((token, index) => {
    if (isChord(token)) {
      return (
        <HighlightedText
          key={`token-${index}`}
          backgroundColor={backgroundColor}
        >
          {token}
        </HighlightedText>
      );
    } else {
      return <Text key={`token-${index}`}>{token}</Text>;
    }
  });

  return tokens;
}

const ALLOWED_FONTS = ['Roboto Mono', 'Open Sans', 'Liberation Sans'];

const FONT_IMPORTS = {
  'Roboto Mono': {
    regular: RobotoRegular,
    boldItalic: RobotoBoldItalic,
    bold: RobotoBold,
    italic: RobotoItalic,
  },
  'Open Sans': {
    regular: OpenSansRegular,
    boldItalic: OpenSansBoldItalic,
    bold: OpenSansBold,
    italic: OpenSansItalic,
  },
  'Liberation Sans': {
    regular: LiberationSansRegular,
    boldItalic: LiberationSansBoldItalic,
    bold: LiberationSansBold,
    italic: LiberationSansItalic,
  },
};

const PDF_STYLES = {
  paddingTop: '.75in',
  paddingBottom: '.75in',
  paddingLeft: '1in',
  paddingRight: '1in',
};
