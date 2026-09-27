import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import KeyBadge from './KeyBadge';
import Button from './Button';
import useRemoveSongFromBinder from '../hooks/api/useRemoveSongFromBinder';
import Icon from './Icon';
import { LIST_ITEM, LIST_ITEM_INTERACTIVE } from './lists/listItem';
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
    <div
      className={`${LIST_ITEM} ${LIST_ITEM_INTERACTIVE} justify-between py-0 pr-2`}
    >
      <Link
        to={{ pathname: `/songs/${song.id}`, state: song }}
        className="flex items-center self-stretch w-full min-w-0 outline-none"
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
