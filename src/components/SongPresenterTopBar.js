import ArrowNarrowLeftIcon from '@heroicons/react/outline/ArrowNarrowLeftIcon';
import Button from './Button';
import { Link } from 'react-router-dom';
import { hasAnyKeysSet } from '../utils/SongUtils';
import { useParams } from 'react-router-dom';
import KeyOptionsPopover from './KeyOptionsPopover';
import AdjustmentsIcon from '@heroicons/react/outline/AdjustmentsIcon';
import { selectCurrentSubscription } from '../store/subscriptionSlice';
import { useSelector } from 'react-redux';
import MarkupPopover from './MarkupPopover';

export default function SongPresenterTopBar({
  song,
  onShowOptionsDrawer,
  onUpdateSong,
  onAddNote,
  onShowMarkingsModal,
}) {
  const { id } = useParams();
  const currentSubscription = useSelector(selectCurrentSubscription);

  if (song) {
    return (
      <nav className="px-1 py-2 border-b dark:border-0 bg-gray-50 dark:bg-dark-gray-800">
        <div className="max-w-3xl mx-auto flex-between">
          <Link to={`/songs/${id}`}>
            <Button variant="icon" size="md" color="gray">
              <ArrowNarrowLeftIcon className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="w-1/3 overflow-hidden font-semibold text-center overflow-ellipsis whitespace-nowrap">
            {song.name}
          </h1>
          <div className="flex items-center gap-2">
            {hasAnyKeysSet(song) && (
              <KeyOptionsPopover song={song} onUpdateSong={onUpdateSong} />
            )}
            <Button
              variant="icon"
              size="md"
              onClick={onShowOptionsDrawer}
              color="gray"
            >
              <AdjustmentsIcon className="w-6 h-6" />
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
  } else {
    return (
      <nav className="px-1 py-2 border-b dark:border-0 bg-gray-50 dark:bg-dark-gray-800 flex-between"></nav>
    );
  }
}
