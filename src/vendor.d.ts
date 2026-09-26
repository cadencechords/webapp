// Types for the dependencies that ship without them. Only what the app calls
// is declared.

declare module 'chord-transposer' {
  /** Text with chords, transposed a step at a time. */
  export class Transposer {
    up(semitones: number): Transposer;
    down(semitones: number): Transposer;
    toKey(key: string): Transposer;
    /** The transposed text. */
    toString(): string;
  }

  /** Throws if `text` has no chords. */
  export function transpose(text: string): Transposer;
}

declare module 'chordsheetjs' {
  /** A parsed chord sheet. */
  export class Song {}

  export class ChordProParser {
    /** Throws on invalid ChordPro. */
    parse(chordProChordSheet: string): Song;
  }

  export class TextFormatter {
    format(song: Song): string;
  }

  /** The default export also holds the classes. */

  const ChordSheetJS: {
    ChordProParser: typeof ChordProParser;
    TextFormatter: typeof TextFormatter;
  };
  export default ChordSheetJS;
}
