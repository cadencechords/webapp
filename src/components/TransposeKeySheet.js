import React, { useState } from 'react';
import Button from './Button';
import ArrowNarrowLeftIcon from '@heroicons/react/outline/ArrowNarrowLeftIcon';
import PlusIcon from '@heroicons/react/outline/PlusIcon';
import MinusIcon from '@heroicons/react/outline/MinusIcon';
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

export default function TransposeKeySheet({
  onChangeSheet,
  song,
  onUpdateSong,
  className,
}) {
  const [updatedKey, setUpdatedKey] = useState();
  const { isLoading: isSaving, run: saveSongUpdates } = useUpdateSong({
    onSuccess: () => setUpdatedKey(null),
  });
  const keys = isMinor(song.transposed_key || song.original_key)
    ? MINOR_KEYS
    : MAJOR_KEYS;

  function handleKeyChange(newKey) {
    onUpdateSong({ transposed_key: newKey });
    setUpdatedKey(newKey);
  }

  function handleSave() {
    saveSongUpdates({ id: song.id, updates: { transposed_key: updatedKey } });
  }

  function handleTransposeUpHalfStep() {
    let halfStepHigher = getHalfStepHigher(
      song.transposed_key || song.original_key
    );

    onUpdateSong({ transposed_key: halfStepHigher });
    setUpdatedKey(halfStepHigher);
  }

  function handleTransposeDownHalfStep() {
    let halfStepLower = getHalfStepLower(
      song.transposed_key || song.original_key
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
            <ArrowNarrowLeftIcon className="w-5 h-5" />
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
          <PlusIcon className="w-5 h-5" />
        </Button>
        <Button variant="icon" onClick={handleTransposeDownHalfStep}>
          <MinusIcon className="w-5 h-5" />
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
