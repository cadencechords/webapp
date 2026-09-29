import Button from '../components/Button';
import OnsongsSongsList from '../components/OnsongSongsList';
import ImportStepHeader from './ImportStepHeader';
import PageLoading from './PageLoading';
import Icon from './Icon';
import { pluralize } from '../utils/StringUtils';
import type { OnsongFile } from '../types';

type OnsongChooseSongsFromBackupProps = {
  uploading: boolean;
  /** The backup's songs, once it's unzipped. */
  unzippedFiles?: OnsongFile[] | null;
  selectedSongs: OnsongFile[];
  onSongToggled: (selected: boolean, song: OnsongFile) => void;
  onSelectAll: () => void;
  onUnselectAll: () => void;
  importing: boolean;
  onBackClick: () => void;
  onConfirmSongSelection: () => void;
};

// Step 2: the backup's songs to pick from, with the count and the next step
// on a bar stuck to the bottom while the list scrolls.
export default function OnsongChooseSongsFromBackup({
  uploading,
  unzippedFiles,
  selectedSongs,
  onSongToggled,
  onSelectAll,
  onUnselectAll,
  importing,
  onBackClick,
  onConfirmSongSelection,
}: OnsongChooseSongsFromBackupProps) {
  const count = unzippedFiles?.length ?? 0;
  return (
    <>
      <ImportStepHeader
        step="Step 2 of 4"
        title="Choose songs"
        subtitle={
          uploading
            ? undefined
            : `${count} ${pluralize('song', count)} in backup`
        }
        onBack={onBackClick}
        backLabel="Back to choosing a backup"
      />
      {uploading ? (
        <PageLoading>Opening your backup</PageLoading>
      ) : (
        <>
          <OnsongsSongsList
            songs={unzippedFiles}
            selectedSongs={selectedSongs}
            onToggleSong={onSongToggled}
            onSelectAll={onSelectAll}
            onUnselectAll={onUnselectAll}
          />
          <div className="sticky bottom-[calc(5rem+env(safe-area-inset-bottom))] md:bottom-4 z-10 flex items-center justify-between gap-4 p-2 pl-5 mt-6 rounded-full bg-surface-container-high shadow-(--md-sys-elevation-level2) font-plain">
            <span className="text-label-large text-on-surface-variant">
              {selectedSongs.length} selected
            </span>
            <Button
              size="sm"
              className="gap-2 flex-center"
              disabled={selectedSongs.length === 0}
              loading={importing}
              onClick={onConfirmSongSelection}
            >
              Choose folder
              <Icon name="arrow_forward" className="w-5 h-5" />
            </Button>
          </div>
        </>
      )}
    </>
  );
}
