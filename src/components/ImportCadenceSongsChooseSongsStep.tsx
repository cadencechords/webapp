import React, { useMemo, useState, type ReactNode } from 'react';
import Checkbox from './Checkbox';
import { hasAnyKeysSet } from '../utils/SongUtils';
import KeyBadge from './KeyBadge';
import { pluralize } from '../utils/StringUtils';
import Button from './Button';
import FadeIn from './FadeIn';
import PageLoading from './PageLoading';
import PageTitle from './PageTitle';
import WellInput from './inputs/WellInput';
import useImportSongsFromTeam from '../hooks/api/useImportSongsFromTeam';
import useImportableCadenceSongs from '../hooks/api/useImportableCadenceSongs';
import NoDataMessage from './NoDataMessage';
import Icon from './Icon';
import type { Id, ImportableTeam, Song } from '../types';

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
  const { isLoading: isLoadingSongs, data: songs } = useImportableCadenceSongs(
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
    <>
      <FadeIn>
        <Button
          variant="open"
          color="gray"
          className="flex-center"
          onClick={() => onGoToStep(0)}
        >
          <Icon name="arrow_back" className="w-4 h-4 mr-4" />
          Choose team
        </Button>
        <PageTitle title="Which songs would you like to import?" />
        <div className="px-2 text-sm subtext">Step 2 of 2</div>
        {isLoadingSongs && <PageLoading />}
        {songs && (
          <>
            <WellInput
              placeholder={`Search your ${songs.length} ${pluralize(
                'song',
                songs.length
              )}`}
              value={query}
              onChange={setQuery}
              className="my-4 lg:text-sm"
            />
            {filteredSongs.length === 0 ? (
              <NoDataMessage type="songs" />
            ) : (
              <div className="mb-10">
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
      </FadeIn>
      <SaveButton
        disabled={selectedSongs.length === 0}
        loading={isImporting}
        onClick={handleImport}
      >
        Import {selectedSongs.length} {pluralize('song', selectedSongs.length)}
      </SaveButton>
    </>
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
      className="flex items-center h-12 gap-4 px-3 border-b sm:rounded-lg sm:hover:bg-gray-100 sm:dark:hover:bg-dark-gray-800 dark:border-dark-gray-600 last:border-0 sm:border-0"
    >
      <Checkbox
        checked={selected}
        onChange={isChecked => onToggleSong(isChecked, song)}
        standAlone={false}
      />
      <span className="inline-block overflow-hidden whitespace-nowrap text-ellipsis">
        {song.name}{' '}
      </span>
      {hasAnyKeysSet(song) && (
        <KeyBadge songKey={song.transposed_key || song.original_key} />
      )}
    </label>
  );
}

type SaveButtonProps = {
  onClick: () => void;
  children?: ReactNode;
  loading: boolean;
  disabled: boolean;
};

function SaveButton({ onClick, children, loading, disabled }: SaveButtonProps) {
  return (
    <>
      <Button
        className="fixed left-0 right-0 md:hidden bottom-14"
        style={{ borderRadius: 0 }}
        loading={loading}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </Button>
      <Button
        className="fixed hidden w-44 bottom-8 right-8 md:inline-block whitespace-nowrap"
        loading={loading}
        onClick={onClick}
        disabled={disabled}
        size="medium"
      >
        {children}
      </Button>
    </>
  );
}
