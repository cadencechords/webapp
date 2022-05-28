import KeyBadge from './KeyBadge';
import { Link } from 'react-router-dom';
import TableHead from './TableHead';
import TableRow from './TableRow';
import Checkbox from './Checkbox';

export default function SongsList({
  songs,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}) {
  return (
    <>
      <div className="hidden sm:block">
        <table className="w-full">
          <TableHead
            columns={[
              <Checkbox
                checked={
                  selectedIds.length === songs.length && songs.length > 0
                }
                onChange={onToggleSelectAll}
              />,
              'NAME',
              'BINDERS',
              'CREATED',
            ]}
            editable
          />
          <tbody>
            {songs?.map(song => {
              let binders =
                song.binders?.length > 0
                  ? concatBinderNames(song.binders)
                  : '-';
              let songNameAndKey = (
                <Link to={`/songs/${song.id}`} className="flex items-center">
                  {song.name}
                  <KeyBadge
                    songKey={song.transposed_key || song.original_key}
                  />
                </Link>
              );
              return (
                <TableRow
                  columns={[
                    <Checkbox
                      checked={selectedIds.includes(song.id)}
                      onChange={checked => onToggleSelect(checked, song.id)}
                    />,
                    songNameAndKey,
                    binders,
                    new Date(song.created_at).toDateString(),
                  ]}
                  key={song.id}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="sm:hidden">
        {songs.map(song => (
          <div
            key={song.id}
            className="border-b dark:border-dark-gray-700 py-2.5 flex items-center px-2 last:border-0 cursor-pointer bg-white dark:bg-dark-gray-900 transition-colors hover:bg-gray-50 dark:hover:bg-dark-gray-800 focus:bg-gray-50 dark:focus:bg-dark-gray-800"
          >
            <Link
              className="overflow-hidden overflow-ellipsis whitespace-nowrap flex items-center gap-2"
              to={`/songs/${song.id}`}
            >
              {song.name}
              <KeyBadge songKey={song.transposed_key || song.original_key} />
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

function concatBinderNames(binders) {
  let names = binders.map(binder => binder.name);
  return names.join(', ');
}
