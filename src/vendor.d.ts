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
  /** A debounced function, with lodash's `cancel` and `flush`. */
  export interface DebouncedFunc<Args extends unknown[]> {
    (...args: Args): void;
    cancel(): void;
    flush(): void;
  }

  type Debounced<F> = F extends (...args: infer Args) => unknown
    ? DebouncedFunc<Args>
    : never;

  /**
   * Calls `func` `wait` ms after the last call, with that call's arguments.
   * `F` is constrained to `object`, not a function type, so it gives an
   * unannotated callback no parameter types: they stay implicitly `any` in
   * the JavaScript, as they were before lodash had types, and must be
   * annotated in TypeScript.
   */
  export function debounce<F extends object>(
    func: F,
    wait?: number
  ): Debounced<F>;
  /**
   * @deprecated Pass `wait` as a number. lodash converts it with `toNumber`,
   * so `[1200]` (Note.js) waits 1200 ms.
   */
  export function debounce<F extends object>(
    func: F,
    wait: [number]
  ): Debounced<F>;

  /** Whether `value` has no own enumerable keys (or no length or size). */
  export function isEmpty(value: unknown): boolean;

  /** A deep comparison. */
  export function isEqual(value: unknown, other: unknown): boolean;

  const _: {
    debounce: typeof debounce;
    isEmpty: typeof isEmpty;
    isEqual: typeof isEqual;
  };
  export default _;
}
