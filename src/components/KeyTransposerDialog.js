import { isMinor, parseNote } from '../utils/SongUtils';
import { useEffect, useState } from 'react';

import ArrowNarrowRightIcon from '@heroicons/react/outline/ArrowNarrowRightIcon';
import Button from './Button';
import SongKeyButton from './buttons/SongKeyButton';
import StyledDialog from './StyledDialog';
import TrashIcon from '@heroicons/react/outline/TrashIcon';

export default function KeyTransposerDialog({
  open,
  onCloseDialog,
  originalKey,
  transposedKey,
  onChange,
  content,
}) {
  const [workingTransposedKey, setWorkingTransposedKey] = useState(() => {
    if (transposedKey) {
      return transposedKey;
    } else if (originalKey) {
      return originalKey;
    } else {
      return isMinor(originalKey) ? 'Gm' : 'G';
    }
  });

  useEffect(() => {
    if (open) {
      if (transposedKey) {
        setWorkingTransposedKey(transposedKey);
      } else if (originalKey) {
        setWorkingTransposedKey(originalKey);
      } else {
        setWorkingTransposedKey(isMinor(originalKey) ? 'Gm' : 'G');
      }
    }
  }, [open, originalKey, transposedKey]);

  const handleKeyChange = newKey => {
    setWorkingTransposedKey(newKey);
  };

  const keys = isMinor(originalKey) ? MINOR_KEYS : MAJOR_KEYS;

  const calculateTonesTransposed = () => {
    if (originalKey && workingTransposedKey) {
      let originalNote = parseNote(originalKey);
      let transposedNote = parseNote(workingTransposedKey);

      let originalSemitone = TONES[originalNote];
      let transposedSemitone = TONES[transposedNote];

      let numSemitonesTransposed = transposedSemitone - originalSemitone;

      if (numSemitonesTransposed > 0) {
        return '+' + numSemitonesTransposed;
      } else {
        return numSemitonesTransposed;
      }
    }
  };

  return (
    <StyledDialog
      borderedTop={false}
      open={open}
      onCloseDialog={onCloseDialog}
      title={
        originalKey ? 'Original key:  ' + originalKey : 'None selected yet'
      }
      fullscreen={false}
    >
      <div className="gap-8 mb-4 flex-center">
        <div className="flex-col flex-center">
          <h1 className="mb-2 text-3xl font-bold text-center">{originalKey}</h1>
          <div className="text-sm">Original</div>
        </div>
        {workingTransposedKey && workingTransposedKey !== originalKey && (
          <>
            <div className="flex-col text-xs flex-center">
              {calculateTonesTransposed()}
              <ArrowNarrowRightIcon className="w-6 h-6 mt-1 transform -translate-y-2" />
            </div>
            <div className="relative flex-col flex-center">
              <button
                className="absolute outline-none -top-1 -right-1 focus:outline-none"
                onClick={() => handleKeyChange(null)}
              >
                <TrashIcon className="w-4 h-4 text-red-600 dark:text-dark-red" />
              </button>
              <h1 className="mb-2 text-3xl font-bold text-center">
                {workingTransposedKey}
              </h1>
              <div className="text-sm">Transposed</div>
            </div>
          </>
        )}
      </div>

      <h4>Choose a key</h4>
      <div className="grid grid-cols-3 gap-2 my-4">
        {keys.map((noteName, index) => (
          <SongKeyButton
            key={index}
            songKey={noteName}
            selected={workingTransposedKey === noteName}
            onClick={() => handleKeyChange(noteName)}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <Button full variant="open" onClick={onCloseDialog}>
          Cancel
        </Button>
        <Button full onClick={() => onChange(workingTransposedKey)}>
          Confirm
        </Button>
      </div>
    </StyledDialog>
  );
}

const MAJOR_KEYS = [
  'Ab',
  'A',
  'A#',
  'Bb',
  'B',
  '',
  '',
  'C',
  'C#',
  'Db',
  'D',
  '',
  'Eb',
  'E',
  '',
  '',
  'F',
  'F#',
  'Gb',
  'G',
  '',
];

const MINOR_KEYS = [
  '',
  'Am',
  'A#m',
  'Bbm',
  'Bm',
  '',
  '',
  'Cm',
  'C#m',
  'Dbm',
  'Dm',
  'D#m',
  'Ebm',
  'Em',
  '',
  '',
  'Fm',
  'F#m',
  '',
  'Gm',
  'G#m',
];

const TONES = {
  A: -3,
  'A#': -2,
  Bb: -2,
  B: -1,
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: -4,
};
