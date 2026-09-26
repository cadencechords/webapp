import {
  MAJOR_KEYS,
  MINOR_KEYS,
  buildChromaticScale,
  semitonesAway,
} from './music';
import { isMinor, parseNote } from './SongUtils';

/** A key to play in with a capo, and the fret the capo goes on. */
export interface CapoOption {
  capoKey: string;
  capoNumber: number;
}

export function determineCapos(currentKey: string | undefined) {
  const keys = isMinor(currentKey) ? MINOR_KEYS : MAJOR_KEYS;

  const capoedKeys = keys.map(key => ({
    capoKey: key,
    // `as`: CapoKeySheet passes the song's key, which is undefined for a song
    // with only a capo set. buildChromaticScale then throws, as it always
    // has; the type doesn't hide a new case.
    capoNumber: determineCapoNumber(currentKey as string, key),
  }));

  return splitByCommonKeys(capoedKeys);
}

export function determineCapoNumber(currentKey: string, capoKey: string) {
  const chromaticScale = buildChromaticScale(parseNote(currentKey));
  return (
    (12 -
      semitonesAway(
        parseNote(currentKey),
        parseNote(capoKey),
        chromaticScale
      )) %
    12
  );
}

function splitByCommonKeys(capoOptions: CapoOption[]) {
  let commonKeys: CapoOption[] = [];
  const uncommonKeys: CapoOption[] = [];

  capoOptions.forEach(capoOption => {
    if (isCommonCapoedKey(capoOption.capoKey)) {
      commonKeys.push(capoOption);
    } else {
      uncommonKeys.push(capoOption);
    }
  });

  uncommonKeys.sort((a, b) => a.capoNumber - b.capoNumber);

  commonKeys = sortCommonKeys(commonKeys);

  return { commonKeys, uncommonKeys };
}

function isCommonCapoedKey(key: string) {
  return COMMON_CAPOED_KEYS[key];
}

function sortCommonKeys(capoOptions: CapoOption[]) {
  // Sparse until filtered: a slot stays empty when its key isn't an option.
  const sorted: CapoOption[] = [];

  capoOptions.forEach(capoOption => {
    if (capoOption.capoKey === 'G' || capoOption.capoKey === 'Em') {
      sorted[0] = capoOption;
    } else if (capoOption.capoKey === 'C' || capoOption.capoKey === 'Am') {
      sorted[1] = capoOption;
    } else if (capoOption.capoKey === 'D' || capoOption.capoKey === 'Bm') {
      sorted[2] = capoOption;
    } else if (capoOption.capoKey === 'A' || capoOption.capoKey === 'F#m') {
      sorted[3] = capoOption;
    }
  });

  return sorted.filter(key => key !== null);
}

const COMMON_CAPOED_KEYS: Record<string, string> = {
  G: 'G',
  Em: 'Em',
  D: 'D',
  Bm: 'Bm',
  C: 'C',
  Am: 'Am',
  A: 'A',
  'F#m': 'F#m',
};

export function determineFret(regularKey: string, capoKey: string) {
  return semitonesAway(parseNote(regularKey), parseNote(capoKey));
}
