import { Link, useParams } from 'react-router-dom';

import Button from './Button';
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
import Icon from './Icon';
import PresenterTopAppBar, {
  PRESENTER_ICON_BUTTON,
} from './PresenterTopAppBar';
import type { PresentedSong } from '../store/presenterSlice';
import type { AnnotationPath } from '../types';

type UpdateSong = <K extends keyof PresentedSong>(
  field: K,
  value: PresentedSong[K]
) => void;

type SetPresenterTopBarProps = {
  /** Undefined until the setlist's songs load. */
  song: PresentedSong | undefined;
  onUpdateSong: UpdateSong;
  onShowDrawer: () => void;
  onAddNote: () => void;
  onShowMarkingsModal: () => void;
};

export default function SetPresenterTopBar({
  song,
  onUpdateSong,
  onShowDrawer,
  onAddNote,
  onShowMarkingsModal,
}: SetPresenterTopBarProps) {
  const { isAnnotating } = usePerformanceMode();
  if (!song) return null;

  return isAnnotating ? (
    <AnnotationsTopBar song={song} onUpdateSong={onUpdateSong} />
  ) : (
    <DefaultTopBar
      song={song}
      onUpdateSong={onUpdateSong}
      onAddNote={onAddNote}
      onShowMarkingsModal={onShowMarkingsModal}
      onShowDrawer={onShowDrawer}
    />
  );
}

type DefaultTopBarProps = Omit<SetPresenterTopBarProps, 'song'> & {
  song: PresentedSong;
};

function DefaultTopBar({
  song,
  onUpdateSong,
  onShowDrawer,
  onAddNote,
  onShowMarkingsModal,
}: DefaultTopBarProps) {
  // Non-null: kept as before. SecuredRoutes renders pages once the team is
  // set, and the subscription is dispatched right after it.
  const currentSubscription = useSelector(selectCurrentSubscription)!;
  const { id } = useParams<{ id: string }>();

  // KeyOptionsPopover passes the song's changed fields.
  function handleUpdateSong(updates: Partial<PresentedSong>) {
    Object.entries(updates).forEach(([field, value]) => {
      // `as`: the entries of a Partial<PresentedSong> are its fields.
      onUpdateSong(field as keyof PresentedSong, value);
    });
  }
  return (
    <PresenterTopAppBar
      leading={
        <Link
          to={`/sets/${id}`}
          aria-label="Close set"
          className={PRESENTER_ICON_BUTTON}
        >
          <Icon name="close" className="w-6 h-6" />
        </Link>
      }
      title={song.name}
      actions={
        <>
          {hasAnyKeysSet(song) && (
            <KeyOptionsPopover
              song={song}
              onUpdateSong={handleUpdateSong}
              key={song.id}
            />
          )}
          <button
            type="button"
            aria-label="Adjust song"
            onClick={onShowDrawer}
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

function AnnotationsTopBar({
  song,
  onUpdateSong,
}: {
  song: PresentedSong;
  onUpdateSong: UpdateSong;
}) {
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
          songId: song.id,
        });
      }

      if (deletedAnnotations.length > 0) {
        // Non-null: these came from the song, and saved annotations have ids.
        const annotationIds = deletedAnnotations.map(a => a.id!);

        await deleteBulkAnnotations({
          annotationIds,
          songId: song.id,
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
    onUpdateSong('annotations', finalAnnotations);
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
