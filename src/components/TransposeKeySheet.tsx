import React, { useState } from 'react';
import Button from './Button';
import Toggle from './Toggle';
import { isMinor } from '../utils/SongUtils';
import {
  MAJOR_KEYS,
  MINOR_KEYS,
  getHalfStepHigher,
  getHalfStepLower,
} from '../utils/music';
import classNames from 'classnames';
import useUpdateSong from '../hooks/api/songs.hooks';
import Icon from './Icon';
import type { Song } from '../types';

type TransposeKeySheetProps = {
  onChangeSheet: (sheet: string) => void;
  song: Song;
  onUpdateSong: (updates: Partial<Song>) => void;
  /** `false` when the sheet is shown. */
  className?: string | false;
};

export default function TransposeKeySheet({
  onChangeSheet,
  song,
  onUpdateSong,
  className,
}: TransposeKeySheetProps) {
  /** The picked key, until it's saved; null once saved. */
  const [updatedKey, setUpdatedKey] = useState<string | null | undefined>(
    undefined
  );
  const { isLoading: isSaving, run: saveSongUpdates } = useUpdateSong({
    onSuccess: () => setUpdatedKey(null),
  });
  const keys = isMinor(song.transposed_key || song.original_key)
    ? MINOR_KEYS
    : MAJOR_KEYS;

  function handleKeyChange(newKey: string) {
    onUpdateSong({ transposed_key: newKey });
    setUpdatedKey(newKey);
  }

  function handleSave() {
    saveSongUpdates({ id: song.id, updates: { transposed_key: updatedKey } });
  }

  function handleTransposeUpHalfStep() {
    const halfStepHigher = getHalfStepHigher(
      // As: kept as before, a song with no key passes undefined, which
      // getHalfStepHigher returns unchanged.
      (song.transposed_key || song.original_key) as string
    );

    onUpdateSong({ transposed_key: halfStepHigher });
    setUpdatedKey(halfStepHigher);
  }

  function handleTransposeDownHalfStep() {
    const halfStepLower = getHalfStepLower(
      // As: as in handleTransposeUpHalfStep.
      (song.transposed_key || song.original_key) as string
    );

    onUpdateSong({ transposed_key: halfStepLower });
    setUpdatedKey(halfStepLower);
  }

  return (
    <div className={classNames('p-3', className)}>
      <div className="flex-between">
        <div className="flex items-center gap-2 font-semibold">
          <Button
            variant="icon"
            color="gray"
            size="md"
            onClick={() => onChangeSheet('options')}
          >
            <Icon name="arrow_back" className="w-5 h-5" />
          </Button>
          Transpose
        </div>
        <Toggle
          enabled={song.show_transposed}
          onChange={newValue => onUpdateSong({ show_transposed: newValue })}
        />
      </div>

      <div className="grid grid-cols-7 p-2 my-4 bg-gray-100 rounded-lg dark:bg-dark-gray-600 ">
        {keys.map(key => (
          <button
            onClick={() => handleKeyChange(key)}
            key={key}
            className={classNames(
              'text-sm h-10 font-semibold flex-center rounded-lg',
              song.transposed_key === key
                ? 'bg-blue-600 dark:bg-dark-blue text-white'
                : 'dark:hover:bg-dark-gray-400 hover:bg-gray-200'
            )}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-end gap-4 my-4">
        <Button variant="icon" onClick={handleTransposeUpHalfStep}>
          <Icon name="add" className="w-5 h-5" />
        </Button>
        <Button variant="icon" onClick={handleTransposeDownHalfStep}>
          <Icon name="remove" className="w-5 h-5" />
        </Button>
      </div>

      {updatedKey && (
        <Button
          full={true}
          variant="accent"
          size="xs"
          loading={isSaving}
          onClick={handleSave}
        >
          Save changes
        </Button>
      )}
    </div>
  );
}
