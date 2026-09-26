import * as Transposer from 'chord-transposer';

import ChordSheetJS from 'chordsheetjs';
import TextAutosize from '../components/TextAutosize';
import { build, isChord, isChordLine } from '@cadencechords/chord-kit';
import type { CSSProperties, ReactNode } from 'react';
import type { Song, SongFormat } from '../types';

/** What `html` renders: a song's content in its format, keyed and capoed. */
export type RenderableSong = Pick<Song, 'content' | 'format'> &
  Partial<
    Pick<
      Song,
      | 'roadmap'
      | 'show_roadmap'
      | 'original_key'
      | 'transposed_key'
      | 'show_transposed'
      | 'capo'
      | 'show_capo'
    >
  >;

const LINES_REGEX = new RegExp(/\r\n|\r|\n/);
const SECTION_TITLE_REGEX = new RegExp(
  '^(\\[)?(verse|chorus|interlude|refrain|prechorus|vamp|tag|outro|intro|break|pre chorus|bridge)( )*([0-9])*(:|])?( )*$'
);

export function isNewLine(line: string) {
  return line === '';
}

export function parseQuality(key: string | null | undefined) {
  if (key && key.length > 0) {
    return isMinor(key) ? 'm' : '';
  } else {
    return '';
  }
}

export function isMinor(key: string | null | undefined) {
  if (key) {
    const lastChar = key.charAt(key.length - 1);
    return lastChar === 'm';
  } else {
    return key;
  }
}

export function parseNote<K extends string | null | undefined>(
  key: K
): K | string {
  if (key && key.length > 0) {
    if (isMinor(key)) {
      const notePart = key.substring(0, key.length - 1);
      return notePart;
    } else {
      return key;
    }
  } else {
    return key;
  }
}

export function getHalfStepHigher(key: string) {
  return Transposer.transpose(key).up(1).toString();
}

export function getHalfStepLower(key: string) {
  return Transposer.transpose(key).down(1).toString();
}

export function hasAnyKeysSet(
  song: Pick<Song, 'original_key' | 'transposed_key' | 'capo'>
) {
  return song.original_key || song.transposed_key || song.capo?.capo_key;
}

export function html(song: RenderableSong | null | undefined) {
  let content = song?.content;
  if (content && song?.format) {
    if (song.roadmap && song.roadmap.length > 0 && song.show_roadmap)
      content = fromRoadmap(song);

    // chord-kit's build checks `capo == null`, so a null capo works like a
    // missing one; its types just leave out null.
    content = build({ ...song, content } as Parameters<typeof build>[0]);

    const linesOfSong = content.split(/\r\n|\r|\n/);

    const htmlLines = linesOfSong.map((line, index) => {
      if (isNewLine(line)) return <br key={index} />;
      else {
        const lineClasses = determineClassesForLine(line, song.format);
        // The line, or its tokens with the chords wrapped.
        let lineContent: ReactNode = line;

        if (isChordLine(line)) {
          let chordStyles: CSSProperties = {};
          if (song.format.chord_color) {
            chordStyles = {
              color: determineChordColor(song.format),
            };
          }

          const tokens = line.split(/(\s+)/);
          lineContent = tokens.map((token, index) =>
            isChord(token) ? (
              <span key={index} style={chordStyles} className="relative z-10">
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
        }

        return (
          <p key={index} className={lineClasses} style={{ lineHeight: '1.5' }}>
            {lineContent}
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

function determineClassesForLine(line: string, format: SongFormat) {
  const baseClasses = format.autosize
    ? 'whitespace-pre'
    : 'whitespace-pre-wrap';
  if (isChordLine(line)) {
    return `${baseClasses} ${determineClassesForChordLine(format)}`;
  } else {
    return `${baseClasses}`;
  }
}

function determineClassesForChordLine(format: SongFormat) {
  if (format.chords_hidden) {
    return 'hidden';
  }

  let classes = '';

  if (format.bold_chords) classes += ' font-bold';
  if (format.italic_chords) classes += ' italic';

  return classes;
}

export function formatChordPro(content: string) {
  const parser = new ChordSheetJS.ChordProParser();
  try {
    const song = parser.parse(content);
    const formatter = new ChordSheetJS.TextFormatter();
    return formatter.format(song);
  } catch {
    return content;
  }
}

export function countLines(content: string | null | undefined) {
  if (content) {
    return formatChordPro(content).split(/\r\n|\r|\n/).length;
  } else {
    return 0;
  }
}

function fromRoadmap(song: Pick<Song, 'content' | 'roadmap'>) {
  const sections = breakIntoSections(song.content);
  // Non-null: html only calls this for a song with a roadmap.
  const roadmap = song.roadmap!;

  let expandedContent = '';
  const sectionTitles = Object.keys(sections);

  roadmap.forEach(roadmapSection => {
    const matchedSectionTitle = sectionTitles.find(sectionTitle =>
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
  const lines = content.split(LINES_REGEX);

  let sectionTitle = '';
  const sections: Record<string, string> = {};
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

function isSectionTitle(line: string) {
  const lowercasedLine = line.toLowerCase();
  return SECTION_TITLE_REGEX.test(lowercasedLine);
}

function determineChordColor({ chord_color, highlight_color }: SongFormat) {
  const isDarkTheme = localStorage.getItem('theme') === 'dark';
  // Non-null: html only calls this when the format has a chord color.
  const normalizedChordColor = chord_color!.replace(/ /g, '');

  let highlightColor = highlight_color;
  if (!highlightColor) {
    highlightColor = transparent;
  }

  if (
    (normalizedChordColor === white || normalizedChordColor === black) &&
    isHighlightTransparent(highlightColor)
  ) {
    return isDarkTheme ? white : black;
  }

  // Non-null: see above.
  return chord_color!;
}

function isHighlightTransparent(highlight_color: string) {
  return highlight_color.charAt(highlight_color.length - 2) === '0';
}

const white = 'rgba(255,255,255,1)';
const black = 'rgba(0,0,0,1)';
const transparent = 'rgba(255,255,255,0)';
