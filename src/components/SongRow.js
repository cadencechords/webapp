import React from 'react';
import { Link } from 'react-router-dom';
import KeyBadge from './KeyBadge';

export default function SongRow({ song }) {
  return (
    <Link
      to={{ pathname: `/songs/${song.id}`, state: song }}
      className="flex items-center h-12 px-3 border-b sm:rounded-lg sm:h-10 sm:hover:bg-gray-100 sm:dark:hover:bg-dark-gray-800 dark:border-dark-gray-600 last:border-0 sm:border-0"
    >
      <div className="inline-block overflow-hidden whitespace-nowrap overflow-ellipsis">
        {song.name}{' '}
      </div>
      <KeyBadge songKey={song.transposed_key || song.original_key} />
    </Link>
  );
}
