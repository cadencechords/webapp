import * as Transposer from 'chord-transposer';

import ChordSheetJS from 'chordsheetjs';
import TextAutosize from '../components/TextAutosize';
import { build, isChord, isChordLine } from '@cadencechords/chord-kit';

const LINES_REGEX = new RegExp(/\r\n|\r|\n/);
const SECTION_TITLE_REGEX = new RegExp(
  '^(\\[)?(verse|chorus|interlude|prechorus|vamp|tag|outro|intro|break|pre chorus|bridge)( )*([0-9])*(:|])?( )*$'
);

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

    content = build({ ...song, content });

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
