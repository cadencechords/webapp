import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import KeyBadge from './KeyBadge';
import Button from './Button';
import TrashIcon from '@heroicons/react/outline/TrashIcon';
import useRemoveSongFromBinder from '../hooks/api/useRemoveSongFromBinder';

export default function BinderSongRow({ song, binderId }) {
  const router = useHistory();
  const { isLoading: isRemoving, run: removeSongFromBinder } =
    useRemoveSongFromBinder({
      onSuccess: () => router.replace(`/binders/${binderId}`, null),
    });

  return (
    <div className="flex items-center justify-between h-12 px-3 border-b sm:h-10 sm:rounded-lg sm:hover:bg-gray-100 sm:dark:hover:bg-dark-gray-800 dark:border-dark-gray-600 last:border-0 sm:border-0">
      <Link
        to={{ pathname: `/songs/${song.id}`, state: song }}
        className="flex items-center w-full h-full mr-5 overflow-hidden"
      >
        <div className="inline-block overflow-hidden whitespace-nowrap overflow-ellipsis hover:underline">
          {song.name}{' '}
        </div>
        <KeyBadge songKey={song.transposed_key || song.original_key} />
      </Link>
      <Button
        variant="icon"
        color="gray"
        onClick={() => removeSongFromBinder({ binderId, songId: song.id })}
        loading={isRemoving}
        className="whitespace-nowrap"
      >
        <TrashIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}
