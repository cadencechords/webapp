import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import KeyBadge from './KeyBadge';
import Button from './Button';
import useRemoveSongFromBinder from '../hooks/api/useRemoveSongFromBinder';
import Icon from './Icon';
import { LIST_ITEM_INTERACTIVE } from './lists/listItem';
import type { Id, Song } from '../types';

type BinderSongRowProps = {
  song: Song;
  binderId: Id;
};

export default function BinderSongRow({ song, binderId }: BinderSongRowProps) {
  const router = useHistory();
  const { isLoading: isRemoving, run: removeSongFromBinder } =
    useRemoveSongFromBinder({
      onSuccess: () => router.replace(`/binders/${binderId}`, null),
    });

  return (
    // The link fills the row up to the remove button, so the whole row (bar
    // the button) opens the song. The link has the state layer and focus
    // ring; the button has its own.
    <div className="flex items-center gap-2 pr-2 font-plain text-body-large text-on-surface">
      <Link
        to={{ pathname: `/songs/${song.id}`, state: song }}
        className={`flex items-center flex-1 min-w-0 min-h-14 py-2 pl-4 rounded-[inherit] ${LIST_ITEM_INTERACTIVE}`}
      >
        <div className="min-w-0 truncate">{song.name} </div>
        <KeyBadge songKey={song.transposed_key || song.original_key} />
      </Link>
      <Button
        variant="icon"
        color="gray"
        onClick={() => removeSongFromBinder({ binderId, songId: song.id })}
        loading={isRemoving}
        className="whitespace-nowrap"
      >
        <Icon name="delete" className="w-4 h-4" />
      </Button>
    </div>
  );
}
