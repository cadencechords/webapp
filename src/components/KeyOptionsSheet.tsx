import React from 'react';
import { MenuItem, MenuList } from './Menu';
import classNames from 'classnames';
import { determineCapoNumber } from '../utils/capo';
import Icon from './Icon';
import type { Song } from '../types';

type KeyOptionsSheetProps = {
  onChangeSheet: (sheet: string) => void;
  /** `false` when the sheet is shown. */
  className?: string | false;
  song: Song;
};

export default function KeyOptionsSheet({
  onChangeSheet,
  className,
  song,
}: KeyOptionsSheetProps) {
  const iconClasses = 'h-5 w-5 text-primary';
  const currentNonCapoKey =
    (song.show_transposed && song.transposed_key) || song.original_key;

  return (
    <MenuList className={classNames(className)}>
      <MenuItem
        onClick={() => onChangeSheet('transpose')}
        trailing={
          song.show_transposed &&
          song.transposed_key && <Icon name="check" className={iconClasses} />
        }
      >
        <span className="flex items-center">
          Transpose
          {song.transposed_key && (
            <span className="ml-1 text-body-small text-on-surface-variant">
              ({song.transposed_key})
            </span>
          )}
        </span>
      </MenuItem>
      <MenuItem
        onClick={() => onChangeSheet('capo')}
        trailing={
          song.capo?.capo_key &&
          song.show_capo && <Icon name="check" className={iconClasses} />
        }
      >
        <span className="flex items-center">
          Capo
          {song.capo?.capo_key && (
            <span className="ml-1 flex-center">
              {determineCapoNumber(
                // As: kept as before, a song with only a capo passes its
                // unset key through (determineCapoNumber throws on it).
                currentNonCapoKey as string,
                song.capo.capo_key
              )}
              <span className="ml-2 text-body-small text-on-surface-variant">
                ({song.capo.capo_key})
              </span>
            </span>
          )}
        </span>
      </MenuItem>
    </MenuList>
  );
}
