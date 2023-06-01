import { Link, useParams } from 'react-router-dom';

import AdjustmentsIcon from '@heroicons/react/outline/AdjustmentsIcon';
import Button from './Button';
import XIcon from '@heroicons/react/outline/XIcon';
import { hasAnyKeysSet } from '../utils/SongUtils';
import KeyOptionsPopover from './KeyOptionsPopover';
import { useSelector } from 'react-redux';
import { selectCurrentSubscription } from '../store/subscriptionSlice';
import MarkupPopover from './MarkupPopover';
import usePerformanceMode from '../hooks/usePerformanceMode';
import { reportError } from '../utils/error';
import {
  useCreateBulkAnnotations,
  useDeleteBulkAnnotations,
} from '../hooks/api/annotations.hooks';
import useAnnotationsToolbar from '../hooks/useAnnotationsToolbar';

export default function SetPresenterTopBar({
  song,
  onUpdateSong,
  onShowDrawer,
  onAddNote,
  onShowMarkingsModal,
}) {
  const { isAnnotating } = usePerformanceMode();
  if (!song) return null;

  return (
    <nav className="relative z-30 px-1 py-2 border-b dark:border-0 bg-gray-50 dark:bg-dark-gray-800">
      <div className="max-w-3xl mx-auto flex-between">
        {isAnnotating ? (
          <AnnotationsTopBar song={song} onUpdateSong={onUpdateSong} />
        ) : (
          <DefaultTopBar
            song={song}
            onUpdateSong={onUpdateSong}
            onAddNote={onAddNote}
            onShowMarkingsModal={onShowMarkingsModal}
            onShowDrawer={onShowDrawer}
          />
        )}
      </div>
    </nav>
  );
}

function DefaultTopBar({
  song,
  onUpdateSong,
  onShowDrawer,
  onAddNote,
  onShowMarkingsModal,
}) {
  const currentSubscription = useSelector(selectCurrentSubscription);
  const { id } = useParams();

  function handleUpdateSong(updates) {
    Object.entries(updates).forEach(([field, value]) => {
      onUpdateSong(field, value);
    });
  }
  return (
    <>
      <Link to={`/sets/${id}`}>
        <Button variant="icon" size="md" color="gray">
          <XIcon className="w-5 h-5 sm:h-6 sm:w-6" />
        </Button>
      </Link>
      <HeaderTitle>{song.name}</HeaderTitle>
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
    </>
  );
}

function AnnotationsTopBar({ song, onUpdateSong }) {
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
    onUpdateSong('annotations', finalAnnotations);
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
