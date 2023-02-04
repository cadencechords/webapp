import { Link, useParams } from 'react-router-dom';

import AdjustmentsIcon from '@heroicons/react/solid/AdjustmentsIcon';
import Button from './Button';
import KeyCapoOptionsPopover from './KeyCapoOptionsPopover';
import XIcon from '@heroicons/react/outline/XIcon';
import { hasAnyKeysSet } from '../utils/SongUtils';

export default function SetPresenterTopBar({
  song,
  onShowBottomSheet,
  onShowDrawer,
}) {
  const { id } = useParams();

  if (!song) return null;

  return (
    <nav className="px-1 py-2 border-b dark:border-0 bg-gray-50 dark:bg-dark-gray-800">
      <div className="max-w-3xl mx-auto flex-between">
        <Link to={`/sets/${id}`}>
          <Button variant="icon" size="md" color="gray">
            <XIcon className="w-5 h-5 sm:h-6 sm:w-6" />
          </Button>
        </Link>
        <h1 className="w-1/3 overflow-hidden font-semibold text-center overflow-ellipsis whitespace-nowrap">
          {song.name}
        </h1>
        <div className="flex items-center">
          {hasAnyKeysSet(song) && (
            <KeyCapoOptionsPopover
              song={song}
              onShowBottomSheet={onShowBottomSheet}
            />
          )}
          <Button variant="icon" size="md" color="gray" onClick={onShowDrawer}>
            <AdjustmentsIcon className="w-5 h-5 sm:h-6 sm:w-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
