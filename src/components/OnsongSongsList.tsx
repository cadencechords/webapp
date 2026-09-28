import classNames from 'classnames';
import Button from './Button';
import Checkbox from './Checkbox';
import { LIST_ITEM, LIST_ITEM_INTERACTIVE } from './lists/listItem';
import type { OnsongFile } from '../types';

type OnsongsSongsListProps = {
  /** Nothing renders until the backup's songs are loaded. */
  songs?: OnsongFile[] | null;
  selectedSongs: OnsongFile[];
  onToggleSong: (selected: boolean, song: OnsongFile) => void;
  onSelectAll: () => void;
  onUnselectAll: () => void;
};

// The backup's songs: Select all and Clear text buttons, then a segmented
// list of checkable rows (a click anywhere on a row toggles it).
export default function OnsongsSongsList({
  songs,
  selectedSongs,
  onToggleSong,
  onSelectAll,
  onUnselectAll,
}: OnsongsSongsListProps) {
  if (!songs) return null;

  return (
    <>
      <div className="flex items-center justify-end gap-1 mb-2">
        <Button size="sm" variant="open" onClick={onSelectAll}>
          Select all
        </Button>
        <Button
          size="sm"
          variant="open"
          onClick={onUnselectAll}
          disabled={selectedSongs.length === 0}
        >
          Clear
        </Button>
      </div>
      <div className="list-segmented">
        {songs.map(song => {
          const selected = selectedSongs.includes(song);
          return (
            <label
              key={song.id}
              className={classNames(
                LIST_ITEM,
                LIST_ITEM_INTERACTIVE,
                'cursor-pointer select-none'
              )}
            >
              <Checkbox
                checked={selected}
                onChange={checked => onToggleSong(checked, song)}
                standAlone={false}
              />
              <span className="min-w-0 truncate">{song.name}</span>
            </label>
          );
        })}
      </div>
    </>
  );
}
