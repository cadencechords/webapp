import * as Transposer from 'chord-transposer';

import ChordSheetJS from 'chordsheetjs';
import TextAutosize from '../components/TextAutosize';

// const CHORD_REGEX = new RegExp(
//   /^([A-G]|[A-G]b|[A-G]#)(maj|min|[Mm+°])?6?(aug|d[io]m|ø)?7?(\/([A-G]|[A-G]b|[A-G]#))?$/
// );

const CHORD_PRO_REGEX = new RegExp(
  /[[]([A-G]|[A-G]b|[A-G]#)(maj|min|[Mm+°])?6?(aug|d[io]m|ø)?7?(\/([A-G]|[A-G]b|[A-G]#))?[\]]/
);
const LINES_REGEX = new RegExp(/\r\n|\r|\n/);
const SECTION_TITLE_REGEX = new RegExp(
  '^(\\[)?(verse|chorus|interlude|prechorus|vamp|tag|outro|intro|break|pre chorus|bridge)( )*([0-9])*(:|])?( )*$'
);

export function isChordLine(line) {
  if (line?.trim() === '') return false;

  if (line) {
    let parts = line.split(' ');
    parts = parts.map(part => part.replace(/\s/g, ''));
    parts = parts.filter(part => part !== '');
    let numChordMatches = 0;

    parts?.forEach(part => {
      if (isChord(part)) {
        ++numChordMatches;
      }
    });

    return numChordMatches >= parts.length / 2;
  } else {
    return false;
  }
}

export function isChord(potentialChord) {
  try {
    Transposer.Chord.parse(potentialChord);
    return true;
  } catch {
    return false;
  }
}

export function isNewLine(line) {
  return line === '';
}

export function parseQuality(key) {
  if (key?.length > 0) {
    return isMinor(key) ? 'm' : '';
  } else {
    return '';
  }
}

export function isMinor(key) {
  if (key) {
    let lastChar = key.charAt(key.length - 1);
    return lastChar === 'm';
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
  if (
    (song?.original_key && song?.transposed_key && song?.content) ||
    (song?.original_key && song?.capo && song?.content)
  ) {
    let linesOfSong = song.content.split(/\r\n|\r|\n/);
    let transposedContent = '';

    linesOfSong.forEach((line, index) => {
      let transposedLine;
      if (isChordLine(line)) {
        if (song.capo) {
          if (song.show_transposed && song.transposed_key) {
            transposedLine = Transposer.transpose(line)
              .fromKey(song.original_key)
              .toKey(song.transposed_key)
              .toString();
            transposedLine = Transposer.transpose(transposedLine)
              .fromKey(song.transposed_key)
              .toKey(song.capo.capo_key)
              .toString();
          } else {
            transposedLine = Transposer.transpose(line)
              .fromKey(song.original_key)
              .toKey(song.capo.capo_key)
              .toString();
          }
        } else {
          transposedLine = Transposer.transpose(line)
            .fromKey(song.original_key)
            .toKey(song.transposed_key)
            .toString();
        }

        transposedContent += transposedLine;
      } else {
        transposedContent += line;
      }

      if (index < linesOfSong.length - 1) {
        transposedContent += '\n';
      }
    });

    return transposedContent;
  } else {
    return song?.content ? song.content : '';
  }
}

export function getHalfStepHigher(key) {
  return Transposer.transpose(key).up(1).toString();
}

export function getHalfStepLower(key) {
  return Transposer.transpose(key).down(1).toString();
}

export function hasAnyKeysSet(song) {
  return song.original_key || song.transposed_key || song.capo?.capo_key;
}

export function html(song, onLineDoubleClick) {
  let content = song?.content;
  if (content && song?.format) {
    if (song.roadmap?.length > 0 && song.show_roadmap)
      content = fromRoadmap(song);

    if (isChordPro(content)) content = formatChordPro(content);

    if (!song.format.chords_hidden && (song.show_transposed || song.capo)) {
      content = transpose({ ...song, content: content });
    }

    let linesOfSong = content.split(/\r\n|\r|\n/);

    let htmlLines = linesOfSong.map((line, index) => {
      if (isNewLine(line))
        return (
          <br
            key={index}
            onDoubleClick={() => onLineDoubleClick?.(line, index)}
          />
        );
      else {
        let lineClasses = determineClassesForLine(line, song.format);

        if (isChordLine(line)) {
          let chordStyles = {};
          if (song.format.chord_color)
            chordStyles = { color: song.format.chord_color };

          let tokens = line.split(/(\s+)/);
          tokens = tokens.map((token, index) =>
            isChord(token) ? (
              <span key={index} style={chordStyles} className="relative">
                {token}
                {song.format.highlight_color && (
                  <span
                    style={{
                      position: 'absolute',
                      backgroundColor: song.format.highlight_color,
                      height: '100%',
                      top: '0px',
                      left: '-4px',
                      right: '-4px',
                      zIndex: '-1',
                    }}
                  ></span>
                )}
              </span>
            ) : (
              token
            )
          );

          line = tokens;
        }

        return (
          <p
            key={index}
            className={lineClasses}
            style={{ lineHeight: '1.5' }}
            onDoubleClick={() => onLineDoubleClick?.(line, index)}
          >
            {line}
          </p>
        );
      }
    });
    return (
      <div style={{ fontFamily: song.format.font }} className="font-normal">
        <TextAutosize
          autosize={song.format.autosize}
          fontSize={song.format.font_size}
        >
          {htmlLines}
        </TextAutosize>
      </div>
    );
  }

  return '';
}

export function isChordPro(content) {
  return CHORD_PRO_REGEX.test(content);
}

function determineClassesForLine(line, format) {
  let baseClasses = format.autosize ? 'whitespace-pre' : 'whitespace-pre-wrap';
  if (isChordLine(line)) {
    return `${baseClasses} ${determineClassesForChordLine(format)}`;
  } else {
    return `${baseClasses}`;
  }
}

function determineClassesForChordLine(format) {
  if (format.chords_hidden) {
    return 'hidden';
  }

  let classes = '';

  if (format.bold_chords) classes += ' font-bold';
  if (format.italic_chords) classes += ' italic';

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

function fromRoadmap(song) {
  let sections = breakIntoSections(song.content);
  let roadmap = song.roadmap;

  let expandedContent = '';
  let sectionTitles = Object.keys(sections);

  roadmap.forEach(roadmapSection => {
    let matchedSectionTitle = sectionTitles.find(sectionTitle =>
      sectionTitle.includes(roadmapSection)
    );
    if (matchedSectionTitle) {
      let sectionToAppend = `${roadmapSection}\n${sections[matchedSectionTitle]}`;
      if (!sectionToAppend.endsWith('\n\n')) sectionToAppend += '\n';
      expandedContent += sectionToAppend;
    }
  });

  return expandedContent;
}

function breakIntoSections(content = '') {
  let lines = content.split(LINES_REGEX);

  let sectionTitle = '';
  let sections = {};
  lines.forEach(line => {
    if (isSectionTitle(line)) {
      sectionTitle = line;
      sections[sectionTitle] = '';
    } else {
      sections[sectionTitle] += `${line}\n`;
    }
  });

  return sections;
}

function isSectionTitle(line) {
  let lowercasedLine = line.toLowerCase();
  return SECTION_TITLE_REGEX.test(lowercasedLine);
}
