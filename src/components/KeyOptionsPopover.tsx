import React, { useState } from 'react';
import StyledPopover from './StyledPopover';
import KeyOptionsSheet from './KeyOptionsSheet';
import classNames from 'classnames';
import TransposeKeySheet from './TransposeKeySheet';
import CapoKeySheet from './CapoKeySheet';
import { determineCapoNumber } from '../utils/capo';
import type { Song } from '../types';

type KeyOptionsPopoverProps = {
  song: Song;
  onUpdateSong: (updates: Partial<Song>) => void;
};

export default function KeyOptionsPopover({
  song,
  onUpdateSong,
}: KeyOptionsPopoverProps) {
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

  const capoNumber =
    song.capo && song.show_capo
      ? determineCapoNumber(
          // As (both): kept as before, an unset key (a song with only a
          // capo, or a capo cleared in CapoKeySheet and shown again) is
          // passed through.
          getNonCapoKey() as string,
          song.capo.capo_key as string
        )
      : undefined;
  const displayKey = getDisplayKey();

  return (
    <StyledPopover
      position="bottom-end"
      // Transpose and Capo open their own sheets in the popover.
      closeOnSelect={false}
      // The popover's own button, styled as an M3 small filled button (a
      // Button inside it would nest buttons): 40dp, round, squaring off while
      // pressed.
      buttonClassName="flex-center gap-1.5 h-10 min-w-10 px-4 rounded-[20px] [--shape-morph-to:8px] bg-primary text-on-primary font-plain text-label-large state-layer-flat focus-ring shape-morph"
      buttonProps={{
        'aria-label': `Key ${displayKey ?? ''}${
          capoNumber != null ? `, capo ${capoNumber}` : ''
        }`.trim(),
      }}
      button={
        <>
          <span className="text-title-medium">{displayKey}</span>
          {capoNumber != null && (
            <span className="text-label-medium opacity-80">
              Capo {capoNumber}
            </span>
          )}
        </>
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
const SHEET_WIDTHS: Record<string, string> = {
  options: 'w-56',
  transpose: 'w-80',
  capo: 'w-80',
};
