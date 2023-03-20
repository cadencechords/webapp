import React, { useState } from 'react';
import Button from './Button';
import ArrowNarrowLeftIcon from '@heroicons/react/outline/ArrowNarrowLeftIcon';
import Toggle from './Toggle';
import classNames from 'classnames';
import { determineCapos } from '../utils/capo';
import XCircleIcon from '@heroicons/react/solid/XCircleIcon';
import {
  useCreateCapo,
  useDeleteCapo,
  useUpdateCapo,
} from '../hooks/api/capo.hooks';

export default function CapoKeySheet({
  onChangeSheet,
  song,
  onUpdateSong,
  className,
}) {
  const [updatedKey, setUpdatedKey] = useState();
  const { isLoading: isDeleting, run: deleteCapo } = useDeleteCapo({
    onSuccess: () => {
      setUpdatedKey(null);
      onUpdateSong({ capo: null });
    },
  });
  const { isLoading: isCreating, run: createCapo } = useCreateCapo({
    onSuccess: newCapo => {
      setUpdatedKey(null);
      onUpdateSong({ capo: newCapo });
    },
  });
  const { isLoading: isUpdating, run: updateCapo } = useUpdateCapo({
    onSuccess: updatedCapo => {
      setUpdatedKey(null);
      onUpdateSong({ capo: updatedCapo });
    },
  });
  const { commonKeys: commonCapos, uncommonKeys: otherCapos } = determineCapos(
    (song.show_transposed && song.transposed_key) || song.original_key
  );
  const keys = [...commonCapos, ...otherCapos];

  function handleKeyChange(newKey) {
    if (!newKey) {
      onUpdateSong({ show_capo: false });
    }
    const newCapo = { ...song.capo, capo_key: newKey };
    onUpdateSong({ capo: newCapo });
    setUpdatedKey(newCapo);
  }

  function handleSave() {
    const { id, capo_key } = updatedKey;

    // no capo previously, nothing to delete
    if (!id && !capo_key) {
      return;
    }
    // previously had a capo, delete it
    else if (id && !capo_key) {
      deleteCapo({ songId: song.id, capoId: id });
    }
    // updating previous capo
    else if (id && capo_key) {
      updateCapo({ songId: song.id, capoId: id, capo_key });
    }
    // creating new capo
    else {
      createCapo({ songId: song.id, capo_key });
    }
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
          Capo
        </div>
        <Toggle
          enabled={song.show_capo}
          onChange={newValue => onUpdateSong({ show_capo: newValue })}
        />
      </div>

      <div className="grid grid-cols-5 p-2 my-4 bg-gray-100 rounded-lg gap-y-2 gap-x-1 dark:bg-dark-gray-600">
        <button
          onClick={() => handleKeyChange(null)}
          className={classNames(
            'text-sm h-12 font-semibold flex-center flex-col rounded-lg',
            !song.capo?.capo_key
              ? 'bg-blue-600 dark:bg-dark-blue text-white'
              : 'dark:hover:bg-dark-gray-400 hover:bg-gray-200'
          )}
        >
          <XCircleIcon className={classNames('w-6 h-6')} />
        </button>
        {keys.map(key => (
          <button
            onClick={() => handleKeyChange(key.capoKey)}
            key={key.capoKey}
            className={classNames(
              'text-sm h-12 font-semibold flex-center flex-col rounded-lg',
              song.capo?.capo_key === key.capoKey
                ? 'bg-blue-600 dark:bg-dark-blue text-white'
                : 'dark:hover:bg-dark-gray-400 hover:bg-gray-200'
            )}
          >
            {key.capoKey}{' '}
            <span style={{ fontSize: 12 }}>
              {key.capoNumber === 12 ? '0' : key.capoNumber}
            </span>
          </button>
        ))}
      </div>

      {updatedKey && (
        <Button
          full={true}
          variant="accent"
          size="xs"
          onClick={handleSave}
          loading={isDeleting || isCreating || isUpdating}
        >
          Save changes
        </Button>
      )}
    </div>
  );
}
