import React from 'react';
import MobileMenuButton from './buttons/MobileMenuButton';
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
  const iconClasses = 'h-5 w-5 text-green-500 dark:text-dark-green ml-2';
  const currentNonCapoKey =
    (song.show_transposed && song.transposed_key) || song.original_key;

  return (
    <div className={classNames(className)}>
      <MobileMenuButton
        size="sm"
        full
        className="border-b rounded-t-md dark:border-dark-gray-400 flex-between"
        onClick={() => onChangeSheet('transpose')}
      >
        <span className="flex-center">
          Transpose
          {song.transposed_key && (
            <span className="ml-1 text-xs">({song.transposed_key})</span>
          )}
        </span>
        {song.show_transposed && song.transposed_key && (
          <Icon name="check" className={iconClasses} />
        )}
      </MobileMenuButton>
      <MobileMenuButton
        size="sm"
        full
        className="rounded-b-md flex-between"
        onClick={() => onChangeSheet('capo')}
      >
        <span className="flex-center">
          Capo
          {song.capo?.capo_key && (
            <span className="ml-1 flex-center">
              {determineCapoNumber(
                // As: kept as before, a song with only a capo passes its
                // unset key through (determineCapoNumber throws on it).
                currentNonCapoKey as string,
                song.capo.capo_key
              )}
              <span className="ml-2 text-xs">({song.capo.capo_key})</span>
            </span>
          )}
        </span>
        {song.capo?.capo_key && song.show_capo && (
          <Icon name="check" className={iconClasses} />
        )}
      </MobileMenuButton>
    </div>
  );
}
