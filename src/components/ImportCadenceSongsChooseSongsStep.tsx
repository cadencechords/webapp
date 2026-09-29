import { useMemo, useState } from 'react';
import Checkbox from './Checkbox';
import { hasAnyKeysSet } from '../utils/SongUtils';
import KeyBadge from './KeyBadge';
import { pluralize } from '../utils/StringUtils';
import Button from './Button';
import FadeIn from './FadeIn';
import PageLoading from './PageLoading';
import ImportStepHeader from './ImportStepHeader';
import SearchField from './inputs/SearchField';
import useImportSongsFromTeam from '../hooks/api/useImportSongsFromTeam';
import useImportableCadenceSongs from '../hooks/api/useImportableCadenceSongs';
import NoDataMessage from './NoDataMessage';
import type { Id, ImportableTeam, Song } from '../types';
import { LIST_ITEM, LIST_ITEM_INTERACTIVE } from './lists/listItem';

type ImportCadenceSongsChooseSongsStepProps = {
  selectedTeam?: ImportableTeam | null;
  selectedSongs: Song[];
  currentStep: number;
  onToggleSong: (isChecked: boolean, song: Song) => void;
  onGoToStep: (step: number) => void;
};

export default function ImportCadenceSongsChooseSongsStep({
  selectedTeam,
  selectedSongs,
  currentStep,
  onToggleSong,
  onGoToStep,
}: ImportCadenceSongsChooseSongsStepProps) {
  const { isLoading: isImporting, run: importSongs } = useImportSongsFromTeam({
    onSuccess: () => onGoToStep(2),
  });
  const [query, setQuery] = useState('');
  // `data` is [] until the songs load, so the list waits for isSuccess.
  const {
    isLoading: isLoadingSongs,
    isSuccess: hasSongs,
    data: songs,
  } = useImportableCadenceSongs(
    // The query is disabled until a team is chosen, so it only fetches with a
    // team's id.
    selectedTeam?.id as Id,
    { enabled: !!selectedTeam }
  );

  const filteredSongs = useMemo(
    () =>
      songs
        ? songs.filter(song => {
            const lowercasedQuery = query.toLowerCase();
            return song.name.toLowerCase().includes(lowercasedQuery);
          })
        : [],
    [songs, query]
  );

  function handleImport() {
    importSongs({
      // Non-null: songs can only be picked on this step, which is reached
      // with "Choose songs", disabled until a team is chosen.
      exportTeamId: selectedTeam!.id,
      songIds: selectedSongs.map(song => song.id),
    });
  }

  if (currentStep !== 1) {
    return null;
  }

  return (
    <FadeIn>
      <ImportStepHeader
        step="Step 2 of 2"
        title="Choose songs"
        subtitle={selectedTeam ? `From ${selectedTeam.name}` : undefined}
        onBack={() => onGoToStep(0)}
        backLabel="Back to choosing a team"
      />
      {isLoadingSongs && <PageLoading />}
      {hasSongs && (
        <>
          <SearchField
            placeholder={`Search ${songs.length} ${pluralize(
              'song',
              songs.length
            )}`}
            value={query}
            onChange={setQuery}
            className="mb-4"
          />
          {filteredSongs.length === 0 ? (
            <NoDataMessage type="songs" />
          ) : (
            <div className="list-segmented">
              {filteredSongs.map(song => (
                <SongOption
                  key={song.id}
                  song={song}
                  selected={selectedSongs.includes(song)}
                  onToggleSong={onToggleSong}
                />
              ))}
            </div>
          )}
        </>
      )}
      {/* The import action, stuck to the bottom of the page while the list
          scrolls: a surface bar with the count and the button. */}
      <div className="sticky bottom-[calc(5rem+env(safe-area-inset-bottom))] md:bottom-4 z-10 flex items-center justify-between gap-4 p-2 pl-5 mt-6 rounded-full bg-surface-container-high shadow-(--md-sys-elevation-level2) font-plain">
        <span className="text-label-large text-on-surface-variant">
          {selectedSongs.length} selected
        </span>
        <Button
          size="sm"
          loading={isImporting}
          onClick={handleImport}
          disabled={selectedSongs.length === 0}
        >
          Import {selectedSongs.length}{' '}
          {pluralize('song', selectedSongs.length)}
        </Button>
      </div>
    </FadeIn>
  );
}

type SongOptionProps = {
  song: Song;
  selected: boolean;
  onToggleSong: (isChecked: boolean, song: Song) => void;
};

function SongOption({ song, selected, onToggleSong }: SongOptionProps) {
  return (
    <label
      key={song.id}
      className={`${LIST_ITEM} ${LIST_ITEM_INTERACTIVE} cursor-pointer`}
    >
      <Checkbox
        checked={selected}
        onChange={isChecked => onToggleSong(isChecked, song)}
        standAlone={false}
      />
      <span className="flex items-center min-w-0">
        <span className="min-w-0 truncate">{song.name} </span>
        {hasAnyKeysSet(song) && (
          <KeyBadge songKey={song.transposed_key || song.original_key} />
        )}
      </span>
    </label>
  );
}
