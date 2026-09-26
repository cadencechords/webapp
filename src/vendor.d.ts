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
  /** `func`, called once calls stop for `wait` ms. */
  export type DebouncedFunc<F> = F extends (...args: infer A) => infer R
    ? {
        /** Returns the last call's result, `undefined` before the first. */
        (...args: A): R | undefined;
        cancel(): void;
        flush(): R | undefined;
      }
    : never;

  /**
   * `F` is constrained to `object`, not a function type, so an untyped
   * callback's parameters aren't given types from the constraint (in the
   * JavaScript that calls this, they stay implicitly `any`). TypeScript
   * callers annotate them.
   */
  export function debounce<F extends object>(
    func: F,
    /** Coerced with lodash's toNumber, so Note.js's `[1200]` is 1200 ms. */
    wait?: unknown
  ): DebouncedFunc<F>;
  /** Deep equality. */
  export function isEqual(value: unknown, other: unknown): boolean;
  /**
   * True for anything without entries: null, undefined, a number, and an
   * empty array, object, string, map or set.
   */
  export function isEmpty(value: unknown): boolean;

  /** The default export also holds the functions. */
  const _: {
    debounce: typeof debounce;
    isEqual: typeof isEqual;
    isEmpty: typeof isEmpty;
  };
  export default _;
}
