import { isMinor, parseNote } from '../utils/SongUtils';
import { useState } from 'react';

import Button from './Button';
import DialogActions from './DialogActions';
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
      open={open}
      onCloseDialog={onCloseDialog}
      title="Transpose"
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

  const isTransposed =
    !!workingTransposedKey && workingTransposedKey !== originalKey;

  return (
    <>
      {/* The original key, and the key it's transposed to with the
          semitones between them. */}
      <div className="flex items-center justify-center gap-6 mb-6 font-plain">
        <KeySummary label="Original" songKey={originalKey ?? 'None'} />
        {isTransposed && (
          <>
            <div className="flex flex-col items-center text-on-surface-variant">
              <span className="text-label-large">
                {calculateTonesTransposed()}
              </span>
              <Icon name="arrow_forward" className="w-6 h-6" />
            </div>
            <KeySummary
              label="Transposed"
              songKey={workingTransposedKey}
              primary
            />
          </>
        )}
      </div>

      {/* Flats, naturals and sharps in three columns. */}
      <div className="grid grid-cols-3 gap-2">
        {keys.map((noteName, index) => (
          <SongKeyButton
            key={index}
            songKey={noteName}
            selected={workingTransposedKey === noteName}
            onClick={() => handleKeyChange(noteName)}
          />
        ))}
      </div>

      <DialogActions>
        {workingTransposedKey && (
          // Back to the original key, at the start apart from the others.
          <Button
            variant="open"
            color="gray"
            size="sm"
            className="mr-auto"
            onClick={() => handleKeyChange(null)}
          >
            Remove transposition
          </Button>
        )}
        <Button variant="open" color="gray" size="sm" onClick={onCloseDialog}>
          Cancel
        </Button>
        <Button
          variant="open"
          size="sm"
          onClick={() => onChange(workingTransposedKey)}
        >
          Confirm
        </Button>
      </DialogActions>
    </>
  );
}

// A key over its label: display-small, primary for the transposed one.
function KeySummary({
  label,
  songKey,
  primary = false,
}: {
  label: string;
  songKey: string;
  primary?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <span
        className={
          primary
            ? 'text-display-small text-primary'
            : 'text-display-small text-on-surface'
        }
      >
        {songKey}
      </span>
      <span className="text-label-medium text-on-surface-variant">{label}</span>
    </div>
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
