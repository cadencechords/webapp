import Button from './Button';
import { Link } from 'react-router-dom';
import { hasAnyKeysSet } from '../utils/SongUtils';
import { useParams } from 'react-router-dom';
import KeyOptionsPopover from './KeyOptionsPopover';
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
import Icon from './Icon';
import PresenterTopAppBar, {
  PRESENTER_ICON_BUTTON,
} from './PresenterTopAppBar';
import type { PresentedSong } from '../store/presenterSlice';
import type { AnnotationPath } from '../types';

type SongPresenterTopBarProps = {
  song: PresentedSong;
  onShowOptionsDrawer: () => void;
  /** KeyOptionsPopover passes the song's changed fields. */
  onUpdateSong: (updates: Partial<PresentedSong>) => void;
  onAddNote: () => void;
  onShowMarkingsModal: () => void;
};

export default function SongPresenterTopBar({
  song,
  onShowOptionsDrawer,
  onUpdateSong,
  onAddNote,
  onShowMarkingsModal,
}: SongPresenterTopBarProps) {
  const { isAnnotating } = usePerformanceMode();
  if (!song) return <PresenterTopAppBar />;

  return isAnnotating ? (
    <AnnotationsTopBar />
  ) : (
    <DefaultTopBar
      song={song}
      onShowOptionsDrawer={onShowOptionsDrawer}
      onUpdateSong={onUpdateSong}
      onAddNote={onAddNote}
      onShowMarkingsModal={onShowMarkingsModal}
    />
  );
}

function DefaultTopBar({
  song,
  onUpdateSong,
  onAddNote,
  onShowMarkingsModal,
  onShowOptionsDrawer,
}: SongPresenterTopBarProps) {
  const { id } = useParams<{ id: string }>();
  // Non-null: kept as before. SecuredRoutes renders pages once the team is
  // set, and the subscription is dispatched right after it.
  const currentSubscription = useSelector(selectCurrentSubscription)!;
  return (
    <PresenterTopAppBar
      leading={
        <Link
          to={`/songs/${id}`}
          aria-label="Back to song"
          className={PRESENTER_ICON_BUTTON}
        >
          <Icon name="arrow_back" className="w-6 h-6" />
        </Link>
      }
      title={song.name}
      actions={
        <>
          {hasAnyKeysSet(song) && (
            <KeyOptionsPopover song={song} onUpdateSong={onUpdateSong} />
          )}
          <button
            type="button"
            aria-label="Adjust song"
            onClick={onShowOptionsDrawer}
            className={PRESENTER_ICON_BUTTON}
          >
            <Icon name="tune" className="w-6 h-6" />
          </button>
          {currentSubscription.isPro && (
            <MarkupPopover
              onAddNote={onAddNote}
              onShowMarkingsModal={onShowMarkingsModal}
            />
          )}
        </>
      }
    />
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
        // Non-null: kept as before, this throws for a song without
        // annotations.
        previousAnnotations: song.annotations!,
      });

    let finalAnnotations = song.annotations || [];

    try {
      if (newAnnotations.length > 0) {
        finalAnnotations = await createBulkAnnotations({
          annotations: newAnnotations,
          // Non-null (here and below): this top bar renders only once
          // SongPresenterPage has a whole song on screen.
          songId: song.id!,
        });
      }

      if (deletedAnnotations.length > 0) {
        // Non-null: these came from the song, and saved annotations have ids.
        const annotationIds = deletedAnnotations.map(a => a.id!);

        await deleteBulkAnnotations({
          annotationIds,
          songId: song.id!,
        });

        finalAnnotations = finalAnnotations.filter(
          // Non-null: the song's annotations and the ones the API just
          // created are all saved, so they have ids.
          annotation => !annotationIds.includes(annotation.id!)
        );
      }

      handleSuccess(finalAnnotations);
    } catch (error) {
      reportError(error);
    }
  }

  function handleSuccess(finalAnnotations: AnnotationPath[]) {
    updateSongOnScreen('annotations', finalAnnotations);
    setAnnotationChanges([]);
    beginPerforming();
  }

  return (
    <PresenterTopAppBar
      contextual
      leading={
        <button
          type="button"
          aria-label="Cancel annotating"
          onClick={handleCancel}
          className={`${PRESENTER_ICON_BUTTON} text-on-secondary-container!`}
        >
          <Icon name="close" className="w-6 h-6" />
        </button>
      }
      title="Annotate"
      actions={
        // Filled secondary, on the bar's secondary-container.
        <Button
          size="sm"
          color="gray"
          className="mr-2"
          onClick={handleSaveAnnotations}
          loading={isCreating || isDeleting}
        >
          Save
        </Button>
      }
    />
  );
}

function determineChangesInAnnotations({
  updatedAnnotations,
  previousAnnotations,
}: {
  updatedAnnotations: AnnotationPath[];
  previousAnnotations: AnnotationPath[];
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
