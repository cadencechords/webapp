import { isMinor, parseNote } from '../utils/SongUtils';
import { useState } from 'react';

import Button from './Button';
import SongKeyButton from './buttons/SongKeyButton';
import StyledDialog from './StyledDialog';
import Icon from './Icon';

type KeyTransposerDialogProps = {
  open: boolean;
  onCloseDialog: () => void;
  originalKey?: string;
  transposedKey?: string;
  /** Called with the picked key, or null when the transposed key is cleared. */
  onChange: (key: string | null) => void;
  /** Unused. */
  content?: string;
};

export default function KeyTransposerDialog({
  open,
  onCloseDialog,
  originalKey,
  transposedKey,
  onChange,
  content,
}: KeyTransposerDialogProps) {
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
      {/* StyledDialog unmounts its contents while closed, so each opening
          starts from the current keys. */}
      <KeyTransposer
        onCloseDialog={onCloseDialog}
        originalKey={originalKey}
        transposedKey={transposedKey}
        onChange={onChange}
      />
    </StyledDialog>
  );
}

function KeyTransposer({
  onCloseDialog,
  originalKey,
  transposedKey,
  onChange,
}: Omit<KeyTransposerDialogProps, 'open' | 'content'>) {
  const [workingTransposedKey, setWorkingTransposedKey] = useState<
    string | null
  >(() => {
    if (transposedKey) {
      return transposedKey;
    } else if (originalKey) {
      return originalKey;
    } else {
      return isMinor(originalKey) ? 'Gm' : 'G';
    }
  });

  const handleKeyChange = (newKey: string | null) => {
    setWorkingTransposedKey(newKey);
  };

  const keys = isMinor(originalKey) ? MINOR_KEYS : MAJOR_KEYS;

  const calculateTonesTransposed = () => {
    if (originalKey && workingTransposedKey) {
      const originalNote = parseNote(originalKey);
      const transposedNote = parseNote(workingTransposedKey);

      const originalSemitone = TONES[originalNote];
      const transposedSemitone = TONES[transposedNote];

      const numSemitonesTransposed = transposedSemitone - originalSemitone;

      if (numSemitonesTransposed > 0) {
        return '+' + numSemitonesTransposed;
      } else {
        return numSemitonesTransposed;
      }
    }
  };

  return (
    <>
      <div className="gap-8 mb-4 flex-center">
        <div className="flex-col flex-center">
          <h1 className="mb-2 text-3xl font-bold text-center">{originalKey}</h1>
          <div className="text-sm">Original</div>
        </div>
        {workingTransposedKey && workingTransposedKey !== originalKey && (
          <>
            <div className="flex-col text-xs flex-center">
              {calculateTonesTransposed()}
              <Icon
                name="arrow_forward"
                className="w-6 h-6 mt-1 transform -translate-y-2"
              />
            </div>
            <div className="relative flex-col flex-center">
              <button
                className="absolute outline-hidden -top-1 -right-1 focus:outline-hidden"
                onClick={() => handleKeyChange(null)}
              >
                <Icon name="delete" className="w-4 h-4 text-error" />
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
    </>
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

const TONES: Record<string, number> = {
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
