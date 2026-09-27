import { parseNote, parseQuality } from '../utils/SongUtils';
import { useState } from 'react';

import Button from './Button';
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
      borderedTop={false}
      open={open}
      onCloseDialog={onCloseDialog}
      title={
        currentSongKey
          ? 'Original key:  ' + currentSongKey
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
      <h1 className="text-center text-3xl font-bold mb-4">
        {keyNote + keyQuality}
      </h1>
      <h4>Choose a new key</h4>
      <div className="grid grid-cols-3 gap-2 my-4">
        {NOTE_NAMES.map((noteName, index) => (
          <SongKeyButton
            key={index}
            songKey={noteName}
            selected={keyNote === noteName}
            onClick={() => handleKeyChange(noteName)}
          />
        ))}
      </div>
      <div className="mb-10">
        <h4 className="mb-3">Choose major or minor</h4>
        <ButtonSwitch
          buttonLabels={['Major', 'Minor']}
          activeButtonLabel={isMajor() ? 'Major' : 'Minor'}
          onClick={handleQualityChange}
        />
      </div>
      <div className="flex gap-2">
        <Button full variant="open" onClick={onCloseDialog}>
          Cancel
        </Button>
        <Button full onClick={() => onChange(keyNote + keyQuality)}>
          Confirm
        </Button>
      </div>
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
