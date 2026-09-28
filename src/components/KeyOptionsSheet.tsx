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
  // The same selected state as the song page's key menu: a tonal pill and a
  // check, in the pill's content color.
  const transposed = !!(song.show_transposed && song.transposed_key);
  const capo = !!(song.capo?.capo_key && song.show_capo);
  const check = <Icon name="check" className="w-5 h-5" />;
  const currentNonCapoKey =
    (song.show_transposed && song.transposed_key) || song.original_key;

  return (
    <MenuList className={classNames(className)}>
      <MenuItem
        onClick={() => onChangeSheet('transpose')}
        selected={transposed}
        trailing={transposed && check}
      >
        <span className="flex items-center">
          Transpose
          {song.transposed_key && (
            <span
              className={classNames(
                'ml-1 text-body-small',
                !transposed && 'text-on-surface-variant'
              )}
            >
              ({song.transposed_key})
            </span>
          )}
        </span>
      </MenuItem>
      <MenuItem
        onClick={() => onChangeSheet('capo')}
        selected={capo}
        trailing={capo && check}
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
              <span
                className={classNames(
                  'ml-2 text-body-small',
                  !capo && 'text-on-surface-variant'
                )}
              >
                ({song.capo.capo_key})
              </span>
            </span>
          )}
        </span>
      </MenuItem>
    </MenuList>
  );
}
