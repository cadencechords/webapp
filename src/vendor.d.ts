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

  /**
   * Wraps `text` for transposing. `up`, `down` and `toKey` throw if it has no
   * chords (there's no key to start from).
   */
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

declare module 'react-textfit' {
  import type { CSSProperties, ComponentType, ReactNode } from 'react';

  export interface TextfitProps {
    /** 'single' fits one line to the width, 'multi' wraps. */
    mode?: 'single' | 'multi';
    style?: CSSProperties;
    children?: ReactNode;
  }

  /** Scales its text to fit its box. */
  export const Textfit: ComponentType<TextfitProps>;
  export default Textfit;
}

declare module 'lodash' {
  /**
   * `func`, called once calls stop for `wait` milliseconds. F is `func`'s
   * type: `object` rather than a function type, so that the unannotated
   * parameters of JavaScript callers stay untyped. lodash converts `wait` to
   * a number, so Note's `[1200]` waits 1200 ms.
   */
  export function debounce<F extends object>(
    func: F,
    wait?: number | [number]
  ): F & { cancel(): void; flush(): void };

  /** True for `{}`, `[]`, `''`, null and undefined, among others. */
  export function isEmpty(value?: unknown): boolean;

  /** Deep equality. */
  export function isEqual(value: unknown, other: unknown): boolean;

  /** The default export also holds the functions. */
  const _: {
    debounce: typeof debounce;
    isEmpty: typeof isEmpty;
    isEqual: typeof isEqual;
  };
  export default _;
}
