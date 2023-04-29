import React, { useMemo, useState } from 'react';
import Checkbox from './Checkbox';
import { hasAnyKeysSet } from '../utils/SongUtils';
import KeyBadge from './KeyBadge';
import { pluralize } from '../utils/StringUtils';
import Button from './Button';
import FadeIn from './FadeIn';
import PageLoading from './PageLoading';
import ArrowNarrowLeftIcon from '@heroicons/react/outline/ArrowNarrowLeftIcon';
import PageTitle from './PageTitle';
import WellInput from './inputs/WellInput';
import useImportSongsFromTeam from '../hooks/api/useImportSongsFromTeam';
import useImportableCadenceSongs from '../hooks/api/useImportableCadenceSongs';
import NoDataMessage from './NoDataMessage';

export default function ImportCadenceSongsChooseSongsStep({
  selectedTeam,
  selectedSongs,
  currentStep,
  onToggleSong,
  onGoToStep,
}) {
  const { isLoading: isImporting, run: importSongs } = useImportSongsFromTeam({
    onSuccess: () => onGoToStep(2),
  });
  const [query, setQuery] = useState('');
  const { isLoading: isLoadingSongs, data: songs } = useImportableCadenceSongs(
    selectedTeam?.id,
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
      exportTeamId: selectedTeam.id,
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
          <ArrowNarrowLeftIcon className="w-4 h-4 mr-4" />
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

function SongOption({ song, selected, onToggleSong }) {
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
      <span className="inline-block overflow-hidden whitespace-nowrap overflow-ellipsis">
        {song.name}{' '}
      </span>
      {hasAnyKeysSet(song) && (
        <KeyBadge songKey={song.transposed_key || song.original_key} />
      )}
    </label>
  );
}

function SaveButton({ onClick, children, loading, disabled }) {
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
