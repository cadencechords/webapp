import { parseNote, parseQuality } from '../utils/SongUtils';
import { useState } from 'react';

import Button from './Button';
import DialogActions from './DialogActions';
import ButtonSwitch from './buttons/ButtonSwitch';
import SongKeyButton from './buttons/SongKeyButton';
import StyledDialog from './StyledDialog';

type KeyChooserDialogProps = {
  open: boolean;
  onCloseDialog: () => void;
  currentSongKey?: string;
  /** Called with the chosen key, e.g. `'Am'`. */
  onChange: (key: string) => void;
};

export default function KeyChooserDialog({
  open,
  onCloseDialog,
  currentSongKey,
  onChange,
}: KeyChooserDialogProps) {
  return (
    <StyledDialog
      open={open}
      onCloseDialog={onCloseDialog}
      title={
        currentSongKey
          ? 'Original key: ' + currentSongKey
          : 'Original key: none'
      }
      fullscreen={false}
    >
      {/* StyledDialog unmounts its contents while closed, so each opening
          starts from the current key. */}
      <KeyChooser
        onCloseDialog={onCloseDialog}
        currentSongKey={currentSongKey}
        onChange={onChange}
      />
    </StyledDialog>
  );
}

function KeyChooser({
  onCloseDialog,
  currentSongKey,
  onChange,
}: Omit<KeyChooserDialogProps, 'open'>) {
  const [keyNote, setKeyNote] = useState(() => {
    if (currentSongKey) {
      return parseNote(currentSongKey);
    } else {
      return 'G';
    }
  });

  const [keyQuality, setKeyQuality] = useState(() => {
    return parseQuality(currentSongKey);
  });

  const handleKeyChange = (newKey: string) => {
    setKeyNote(newKey);
  };

  const handleQualityChange = (newQuality: string) => {
    const shortQuality = newQuality === 'Major' ? '' : 'm';
    setKeyQuality(shortQuality);
  };

  const isMajor = () => {
    return keyQuality === '';
  };

  return (
    <>
      {/* The key being picked; the title keeps the key it has now. */}
      <h1 className="mb-6 font-plain text-display-medium text-primary text-center">
        {keyNote + keyQuality}
      </h1>
      <ButtonSwitch
        size="s"
        buttonLabels={['Major', 'Minor']}
        activeButtonLabel={isMajor() ? 'Major' : 'Minor'}
        onClick={handleQualityChange}
      />
      {/* Flats, naturals and sharps in three columns. */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {NOTE_NAMES.map((noteName, index) => (
          <SongKeyButton
            key={index}
            songKey={noteName}
            selected={keyNote === noteName}
            onClick={() => handleKeyChange(noteName)}
          />
        ))}
      </div>
      <DialogActions>
        <Button variant="open" color="gray" size="sm" onClick={onCloseDialog}>
          Cancel
        </Button>
        <Button
          variant="open"
          size="sm"
          onClick={() => onChange(keyNote + keyQuality)}
        >
          Confirm
        </Button>
      </DialogActions>
    </>
  );
}

const NOTE_NAMES = [
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
  'D#',
  'Eb',
  'E',
  'E#',
  '',
  'F',
  'F#',
  'Gb',
  'G',
  'G#',
];
