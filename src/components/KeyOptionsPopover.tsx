import React, { useState } from 'react';
import StyledPopover from './StyledPopover';
import Button from './Button';
import KeyOptionsSheet from './KeyOptionsSheet';
import classNames from 'classnames';
import TransposeKeySheet from './TransposeKeySheet';
import CapoKeySheet from './CapoKeySheet';
import { determineCapoNumber } from '../utils/capo';

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

  function getNonCapoKey() {
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
          className="gap-2 mr-2 h-9 flex-center"
          style={{ borderRadius: '12px', padding: '0 10px', minWidth: '40px' }}
        >
          {getDisplayKey()}
          {song.capo && song.show_capo && (
            <span className="text-xs">
              {determineCapoNumber(getNonCapoKey(), song.capo.capo_key)}
            </span>
          )}
        </Button>
      }
    >
      <div className={classNames(SHEET_WIDTHS[sheet])}>
        <KeyOptionsSheet
          song={song}
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
