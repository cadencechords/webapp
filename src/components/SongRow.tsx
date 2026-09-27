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
      <div className="min-w-0 truncate">{song.name} </div>
      <KeyBadge songKey={song.transposed_key || song.original_key} />
    </Link>
  );
}
