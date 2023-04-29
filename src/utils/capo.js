import {
  MAJOR_KEYS,
  MINOR_KEYS,
  buildChromaticScale,
  semitonesAway,
} from './music';
import { isMinor, parseNote } from './SongUtils';

export function determineCapos(currentKey) {
  let keys = isMinor(currentKey) ? MINOR_KEYS : MAJOR_KEYS;

  let capoedKeys = keys.map(key => ({
    capoKey: key,
    capoNumber: determineCapoNumber(currentKey, key),
  }));

  return splitByCommonKeys(capoedKeys);
}

export function determineCapoNumber(currentKey, capoKey) {
  let chromaticScale = buildChromaticScale(parseNote(currentKey));
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

function splitByCommonKeys(capoOptions) {
  let commonKeys = [];
  let uncommonKeys = [];

  capoOptions.forEach(capoOption => {
    isCommonCapoedKey(capoOption.capoKey)
      ? commonKeys.push(capoOption)
      : uncommonKeys.push(capoOption);
  });

  uncommonKeys.sort((a, b) => a.capoNumber - b.capoNumber);

  commonKeys = sortCommonKeys(commonKeys);

  return { commonKeys, uncommonKeys };
}

function isCommonCapoedKey(key) {
  return COMMON_CAPOED_KEYS[key];
}

function sortCommonKeys(capoOptions) {
  let sorted = [];

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

const COMMON_CAPOED_KEYS = {
  G: 'G',
  Em: 'Em',
  D: 'D',
  Bm: 'Bm',
  C: 'C',
  Am: 'Am',
  A: 'A',
  'F#m': 'F#m',
};

export function determineFret(regularKey, capoKey) {
  return semitonesAway(parseNote(regularKey), parseNote(capoKey));
}
