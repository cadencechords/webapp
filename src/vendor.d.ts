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
  /** `func`, run `wait` ms after the last call. */
  export type DebouncedFunc<F> = (F extends (...args: infer Args) => unknown
    ? (...args: Args) => void
    : never) & { cancel(): void; flush(): void };

  // `F extends CallableFunction`, not a call signature: a signature would
  // contextually type the unannotated callbacks in the JavaScript that still
  // calls debounce, making their parameters unknown.
  export function debounce<F extends CallableFunction>(
    func: F,
    wait?: number
  ): DebouncedFunc<F>;
  export function isEmpty(value: unknown): boolean;
  export function isEqual(value: unknown, other: unknown): boolean;

  /** The default export also holds the functions. */
  const _: {
    debounce: typeof debounce;
    isEmpty: typeof isEmpty;
    isEqual: typeof isEqual;
  };
  export default _;
}
