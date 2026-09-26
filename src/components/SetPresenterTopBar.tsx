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
import type { ReactNode } from 'react';
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
    <>
      <Link to={`/sets/${id}`}>
        <Button variant="icon" size="md" color="gray">
          <Icon name="close" className="w-5 h-5 sm:h-6 sm:w-6" />
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
          <Icon name="tune" className="w-5 h-5 sm:h-6 sm:w-6" />
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

function HeaderTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="w-1/3 overflow-hidden font-semibold text-center whitespace-pre text-ellipsis">
      {children}
    </h1>
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
