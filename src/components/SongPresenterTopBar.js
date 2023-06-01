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
import usePerformanceMode from '../hooks/usePerformanceMode';
import useAnnotationsToolbar from '../hooks/useAnnotationsToolbar';
import { useSongOnScreen } from '../hooks/songBeingPresented.hooks';
import { reportError } from '../utils/error';
import {
  useCreateBulkAnnotations,
  useDeleteBulkAnnotations,
} from '../hooks/api/annotations.hooks';

export default function SongPresenterTopBar({
  song,
  onShowOptionsDrawer,
  onUpdateSong,
  onAddNote,
  onShowMarkingsModal,
}) {
  const { isAnnotating } = usePerformanceMode();
  if (!song)
    return (
      <nav className="px-1 py-2 border-b dark:border-0 bg-gray-50 dark:bg-dark-gray-800 flex-between h-14"></nav>
    );

  return (
    <nav className="relative z-30 px-1 py-2 border-b dark:border-0 bg-gray-50 dark:bg-dark-gray-800 h-14">
      <div className="h-full max-w-3xl mx-auto flex-between">
        {isAnnotating ? (
          <AnnotationsTopBar />
        ) : (
          <DefaultTopBar
            song={song}
            onShowOptionsDrawer={onShowOptionsDrawer}
            onUpdateSong={onUpdateSong}
            onAddNote={onAddNote}
            onShowMarkingsModal={onShowMarkingsModal}
          />
        )}
      </div>
    </nav>
  );
}

function DefaultTopBar({
  song,
  onUpdateSong,
  onAddNote,
  onShowMarkingsModal,
  onShowOptionsDrawer,
}) {
  const { id } = useParams();
  const currentSubscription = useSelector(selectCurrentSubscription);
  return (
    <>
      <Link to={`/songs/${id}`}>
        <Button variant="icon" size="md" color="gray">
          <ArrowNarrowLeftIcon className="w-6 h-6" />
        </Button>
      </Link>
      <HeaderTitle>{song.name}</HeaderTitle>
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
    </>
  );
}

function AnnotationsTopBar() {
  const { song, updateSongOnScreen } = useSongOnScreen();
  const { beginPerforming } = usePerformanceMode();
  const { setAnnotationChanges, annotationChanges } = useAnnotationsToolbar();
  const { run: createBulkAnnotations, isLoading: isCreating } =
    useCreateBulkAnnotations();
  const { run: deleteBulkAnnotations, isLoading: isDeleting } =
    useDeleteBulkAnnotations();

  function handleCancel() {
    setAnnotationChanges([]);
    beginPerforming();
  }

  async function handleSaveAnnotations() {
    const { newAnnotations, deletedAnnotations } =
      determineChangesInAnnotations({
        updatedAnnotations: annotationChanges,
        previousAnnotations: song.annotations,
      });

    let finalAnnotations = song.annotations || [];

    try {
      if (newAnnotations.length > 0) {
        finalAnnotations = await createBulkAnnotations({
          annotations: newAnnotations,
          songId: song.id,
        });
      }

      if (deletedAnnotations.length > 0) {
        const annotationIds = deletedAnnotations.map(a => a.id);

        await deleteBulkAnnotations({
          annotationIds,
          songId: song.id,
        });

        finalAnnotations = finalAnnotations.filter(
          annotation => !annotationIds.includes(annotation.id)
        );
      }

      handleSuccess(finalAnnotations);
    } catch (error) {
      reportError(error);
    }
  }

  function handleSuccess(finalAnnotations) {
    updateSongOnScreen('annotations', finalAnnotations);
    setAnnotationChanges([]);
    beginPerforming();
  }

  return (
    <>
      <Button variant="open" className="ml-2" onClick={handleCancel}>
        Cancel
      </Button>
      <HeaderTitle>Annotate</HeaderTitle>
      <Button
        className="w-20 mr-2"
        onClick={handleSaveAnnotations}
        loading={isCreating || isDeleting}
      >
        Save
      </Button>
    </>
  );
}

function HeaderTitle({ children }) {
  return (
    <h1 className="w-1/3 overflow-hidden font-semibold text-center overflow-ellipsis whitespace-nowrap">
      {children}
    </h1>
  );
}

function determineChangesInAnnotations({
  updatedAnnotations,
  previousAnnotations,
}) {
  const newAnnotations = updatedAnnotations.filter(
    annotation => !annotation.id
  );

  const currentAnnotationIds = new Set(
    updatedAnnotations.map(annotation => annotation.id)
  );

  const deletedAnnotations = previousAnnotations.filter(
    annotation => !currentAnnotationIds.has(annotation.id)
  );

  return {
    newAnnotations,
    deletedAnnotations,
  };
}
