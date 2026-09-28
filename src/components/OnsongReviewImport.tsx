import Button from './Button';
import ImportStepHeader from './ImportStepHeader';
import { LIST_ITEM } from './lists/listItem';
import { pluralize } from '../utils/StringUtils';
import type { Binder, OnsongFile } from '../types';

type OnsongReviewImportProps = {
  selectedBinder?: Binder | null;
  selectedSongs: OnsongFile[];
  onBackClick: () => void;
  onConfirm: () => void;
};

// Step 4: what's about to be imported and where, then the songs, and the
// Import button.
export default function OnsongReviewImport({
  selectedBinder,
  selectedSongs,
  onBackClick,
  onConfirm,
}: OnsongReviewImportProps) {
  const count = selectedSongs.length;
  const songs = `${count} ${pluralize('song', count)}`;

  return (
    <>
      <ImportStepHeader
        step="Step 4 of 4"
        title="Review"
        subtitle={
          selectedBinder
            ? `Importing ${songs} into ${selectedBinder.name}`
            : `Importing ${songs}, not into a folder`
        }
        onBack={onBackClick}
        backLabel="Back to choosing a folder"
      />
      <div className="mb-6 overflow-y-auto list-segmented max-h-96">
        {selectedSongs.map(song => (
          <div key={song.id} className={LIST_ITEM}>
            <span className="min-w-0 truncate">{song.name}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button size="md" className="w-full sm:w-auto" onClick={onConfirm}>
          Import {songs}
        </Button>
      </div>
    </>
  );
}
