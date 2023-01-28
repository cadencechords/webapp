import AdjustmentsIcon from '@heroicons/react/solid/AdjustmentsIcon';
import ArrowNarrowLeftIcon from '@heroicons/react/outline/ArrowNarrowLeftIcon';
import Button from './Button';
import KeyCapoOptionsPopover from './KeyCapoOptionsPopover';
import { Link } from 'react-router-dom';
import { hasAnyKeysSet } from '../utils/SongUtils';
import { useParams } from 'react-router-dom';

export default function SongPresenterTopBar({
  song,
  onShowOptionsDrawer,
  onShowBottomSheet,
}) {
  const { id } = useParams();

  if (song) {
    return (
      <nav className="px-1 py-2 border-b dark:border-0 bg-gray-50 dark:bg-dark-gray-800">
        <div className="max-w-3xl mx-auto flex-between">
          <Link to={`/songs/${id}`}>
            <Button variant="open" color="gray">
              <ArrowNarrowLeftIcon className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="w-1/3 overflow-hidden font-semibold text-center overflow-ellipsis whitespace-nowrap">
            {song.name}
          </h1>
          <div className="flex items-center">
            {hasAnyKeysSet(song) && (
              <KeyCapoOptionsPopover
                onShowBottomSheet={onShowBottomSheet}
                song={song}
              />
            )}
            <Button variant="open" onClick={onShowOptionsDrawer} color="gray">
              <AdjustmentsIcon className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </nav>
    );
  } else {
    return (
      <nav className="px-1 py-2 border-b dark:border-0 bg-gray-50 dark:bg-dark-gray-800 flex-between"></nav>
    );
  }
}
