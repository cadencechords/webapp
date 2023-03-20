import React, { useState } from 'react';
import StyledPopover from './StyledPopover';
import Button from './Button';
import KeyOptionsSheet from './KeyOptionsSheet';
import classNames from 'classnames';
import TransposeKeySheet from './TransposeKeySheet';
import CapoKeySheet from './CapoKeySheet';

export default function KeyOptionsPopover({ song, onUpdateSong }) {
  const [sheet, setSheet] = useState('options');

  function getDisplayKey() {
    if (song.show_capo && song.capo?.capo_key) {
      return song.capo.capo_key;
    }

    if (song.show_transposed && song.transposed_key) {
      return song.transposed_key;
    }

    return song.original_key;
  }

  return (
    <StyledPopover
      position="bottom-end"
      button={
        <Button
          className="w-10 mr-2 h-9"
          style={{ borderRadius: '10px', padding: 0 }}
        >
          {getDisplayKey()}
        </Button>
      }
    >
      <div className={classNames(SHEET_WIDTHS[sheet])}>
        <KeyOptionsSheet
          onChangeSheet={setSheet}
          className={sheet !== 'options' && 'hidden'}
        />
        <TransposeKeySheet
          onChangeSheet={setSheet}
          song={song}
          onUpdateSong={onUpdateSong}
          className={sheet !== 'transpose' && 'hidden'}
        />
        <CapoKeySheet
          onChangeSheet={setSheet}
          song={song}
          onUpdateSong={onUpdateSong}
          className={sheet !== 'capo' && 'hidden'}
        />
      </div>
    </StyledPopover>
  );
}
const SHEET_WIDTHS = {
  options: 'w-48',
  transpose: 'w-80',
  capo: 'w-80',
};
