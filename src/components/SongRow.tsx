import React from 'react';
import { Link } from 'react-router-dom';
import KeyBadge from './KeyBadge';
import { LIST_ITEM, LIST_ITEM_INTERACTIVE } from './lists/listItem';
import type { Song } from '../types';

type SongRowProps = {
  song: Song;
};

export default function SongRow({ song }: SongRowProps) {
  return (
    <Link
      to={{ pathname: `/songs/${song.id}`, state: song }}
      className={`${LIST_ITEM} ${LIST_ITEM_INTERACTIVE}`}
    >
      {/* Grouped so the row's gap doesn't widen the space before the key. */}
      <span className="flex items-center min-w-0">
        <span className="min-w-0 truncate">{song.name} </span>
        <KeyBadge songKey={song.transposed_key || song.original_key} />
      </span>
    </Link>
  );
}
