import { Link, useParams } from 'react-router-dom';

import AdjustmentsIcon from '@heroicons/react/outline/AdjustmentsIcon';
import Button from './Button';
import XIcon from '@heroicons/react/outline/XIcon';
import { hasAnyKeysSet } from '../utils/SongUtils';
import KeyOptionsPopover from './KeyOptionsPopover';
import { useSelector } from 'react-redux';
import { selectCurrentSubscription } from '../store/subscriptionSlice';
import MarkupPopover from './MarkupPopover';

export default function SetPresenterTopBar({
  song,
  onUpdateSong,
  onShowDrawer,
  onAddNote,
  onShowMarkingsModal,
}) {
  const currentSubscription = useSelector(selectCurrentSubscription);
  const { id } = useParams();

  if (!song) return null;

  function handleUpdateSong(updates) {
    Object.entries(updates).forEach(([field, value]) => {
      onUpdateSong(field, value);
    });
  }

  return (
    <nav className="relative z-30 px-1 py-2 border-b dark:border-0 bg-gray-50 dark:bg-dark-gray-800">
      <div className="max-w-3xl mx-auto flex-between">
        <Link to={`/sets/${id}`}>
          <Button variant="icon" size="md" color="gray">
            <XIcon className="w-5 h-5 sm:h-6 sm:w-6" />
          </Button>
        </Link>
        <h1 className="w-1/3 overflow-hidden font-semibold text-center overflow-ellipsis whitespace-nowrap">
          {song.name}
        </h1>
        <div className="flex items-center gap-2">
          {hasAnyKeysSet(song) && (
            <KeyOptionsPopover
              song={song}
              onUpdateSong={handleUpdateSong}
              key={song.id}
            />
          )}
          <Button variant="icon" size="md" color="gray" onClick={onShowDrawer}>
            <AdjustmentsIcon className="w-5 h-5 sm:h-6 sm:w-6" />
          </Button>
          {currentSubscription.isPro && (
            <MarkupPopover
              onAddNote={onAddNote}
              onShowMarkingsModal={onShowMarkingsModal}
            />
          )}
        </div>
      </div>
    </nav>
  );
}
