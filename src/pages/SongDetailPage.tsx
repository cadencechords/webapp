import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import AddGenreDialog from '../components/AddGenreDialog';
import AddThemeDialog from '../components/AddThemeDialog';
import ArtistField from '../components/ArtistField';
import BpmField from '../components/BpmField';
import Button, { buttonClasses } from '../components/Button';
import SongTags from '../components/SongTags';
import { EDIT_SONGS } from '../utils/constants';
import { Link } from 'react-router-dom';
import MeterField from '../components/MeterField';
import PageTitle from '../components/PageTitle';
import PrintSongDialog from '../components/PrintSongDialog';
import SongApi, { type SongUpdates } from '../api/SongApi';
import SongKeyField from '../components/SongKeyField';
import SongOptionsPopover from '../components/SongOptionsPopover';
import SongPreview from '../components/SongPreview';
import SongTabs from '../components/SongTabs';
import TransposedKeyField from '../components/TransposedKeyField';
import { isEmpty } from '../utils/ObjectUtils';
import { reportError } from '../utils/error';
import { selectCurrentMember } from '../store/authSlice';
import { setSongBeingPresented } from '../store/presenterSlice';
import LastScheduledField from '../components/LastScheduledField';
import { isPast, sortDates } from '../utils/date';
import dayjs from 'dayjs';
import { useCurrentUser } from '../hooks/api/currentUser.hooks';
import DisplayedKeyMenu from '../components/DisplayedKeyMenu';
import UnsavedChangesBar from '../components/UnsavedChangesBar';
import { hasAnyKeysSet } from '../utils/SongUtils';
import { determineCapoNumber } from '../utils/capo';
import Icon from '../components/Icon';
import type { Song, Tag, Track, User } from '../types';
import LoadingIndicator from '../components/feedback/LoadingIndicator';
import { useRecordRecentlyViewed } from '../hooks/useRecentlyViewed';

export default function SongDetailPage() {
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [song, setSong] = useState<Song | undefined>(undefined);
  const [pendingUpdates, setPendingUpdates] = useState<SongUpdates>({});
  const [saving, setSaving] = useState(false);
  const [showAddThemeDialog, setShowAddThemeDialog] = useState(false);
  const [showAddGenreDialog, setShowGenreDialog] = useState(false);
  const [keyType, setKeyType] = useState<string | undefined>(undefined);
  const dispatch = useDispatch();
  // Non-null: Content renders the pages only once the membership loads.
  const currentMember = useSelector(selectCurrentMember)!;
  const { data: currentUser } = useCurrentUser({
    onSuccess: mergeUserPreferencesWithSongFormat,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    document.title = song ? song.name : 'Songs';
  }, [song]);

  // Not while the name has an unsaved edit: only the saved name is recorded.
  useRecordRecentlyViewed('song', 'name' in pendingUpdates ? undefined : song);

  const router = useHistory();
  const { id } = useParams<{ id: string }>();

  // Non-null (song, throughout): only the render below the loading guard
  // calls this.
  function getKeyTypeOptions() {
    const options: { value: string; display: string }[] = [];

    if (song!.original_key)
      options.push({
        value: 'original',
        display: `Original (${song!.original_key})`,
      });
    if (song!.transposed_key)
      options.push({
        value: 'transposed',
        display: `Transposed (${song!.transposed_key})`,
      });
    if (song!.capo?.capo_key) {
      const currentKey = song!.transposed_key || song!.original_key;
      options.push({
        value: 'capo',
        display: `Capo ${determineCapoNumber(
          // As: kept as before, a song with only a capo passes its unset key
          // through (determineCapoNumber throws on it).
          currentKey as string,
          song!.capo.capo_key
        )} (${song!.capo.capo_key})`,
      });
    }

    if (options.length !== 0)
      options.push({ value: 'none', display: 'Hide chords' });

    return options;
  }

  useEffect(() => {
    async function fetchSong() {
      try {
        const { data } = await SongApi.getOneById(id);

        if (currentUser) {
          // Non-null: the API sends the current user with their format
          // preferences; like before, this throws otherwise.
          data.format.chords_hidden =
            currentUser.format_preferences!.hide_chords;
        }

        let keyType;
        if (data.format.chords_hidden) {
          keyType = 'none';
        } else if (data.capo) {
          keyType = 'capo';
          data.show_capo = true;
        } else if (data.transposed_key) {
          keyType = 'transposed';
          data.show_transposed = true;
        } else if (data.original_key) {
          keyType = 'original';
        } else {
          keyType = 'none';
        }

        setKeyType(keyType);
        setSong(data);
      } catch (error) {
        reportError(error);
      }
    }

    if (!song) {
      fetchSong();
    }
  }, [id, currentUser, song]);

  if (!song) {
    return (
      <div className="py-4 text-center">
        <LoadingIndicator className="mx-auto" />
      </div>
    );
  }

  // Non-null (format_preferences): see fetchSong.
  function mergeUserPreferencesWithSongFormat({ format_preferences }: User) {
    if (song) {
      // Non-null (previousSong): the song is set (checked above) and never
      // unset.
      setSong(previousSong => ({
        ...previousSong!,
        format: {
          ...previousSong!.format,
          chords_hidden: format_preferences!.hide_chords,
        },
      }));

      if (format_preferences!.hide_chords) {
        setKeyType('none');
      }
    }
  }

  const handleUpdate = <K extends keyof SongUpdates>(
    field: K,
    value: SongUpdates[K]
  ) => {
    const updates = { ...pendingUpdates };
    updates[field] = value;
    setPendingUpdates(updates);

    const updatedSong: SongUpdates = { ...song };
    updatedSong[field] = value;
    // As: kept as before, the song shows each edit as its field gave it (a
    // bpm can be a string, a cleared transposed key null) until it's saved.
    setSong(updatedSong as Song);
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const result = await SongApi.updateOneById(id, pendingUpdates);
      setSong(currentSong => ({ ...currentSong, ...result.data }));
      setPendingUpdates({});
    } catch (error) {
      reportError(error);
    } finally {
      setSaving(false);
    }
  };

  const handlePresentSong = () => {
    dispatch(
      setSongBeingPresented({
        ...song,
        show_transposed: !!song.transposed_key,
        show_capo: !!song.capo?.capo_key,
      })
    );
    router.push(`/songs/${id}/present`);
  };

  const handleThemesAdded = (newThemes: Tag[]) => {
    // Non-null: the API sends a song with its themes and genres.
    setSong({ ...song, themes: song.themes!.concat(newThemes) });
  };

  const handleGenresAdded = (newGenres: Tag[]) => {
    // Non-null: as in handleThemesAdded.
    setSong({ ...song, genres: song.genres!.concat(newGenres) });
  };

  const handleTrackDeleted = (trackIdToRemove: number) => {
    // Non-null: the song is loaded before the tabs render, and never unset.
    setSong(currentSong => {
      const updatedTracks = currentSong!.tracks?.filter(
        track => track.id !== trackIdToRemove
      );
      return { ...currentSong!, tracks: updatedTracks };
    });
  };

  const handleTracksAdded = (addedTracks: Track[]) => {
    // Non-null: as in handleTrackDeleted.
    setSong(currentSong => {
      const updatedTracks = currentSong!.tracks?.concat(addedTracks);
      return { ...currentSong!, tracks: updatedTracks };
    });
  };

  const handleRemoveTheme = async (themeIdToRemove: number) => {
    try {
      await SongApi.removeThemes(song.id, [themeIdToRemove]);
      // Non-null: as in handleThemesAdded.
      const newThemesList = song.themes!.filter(
        themeInList => themeInList.id !== themeIdToRemove
      );
      setSong({ ...song, themes: newThemesList });
    } catch (error) {
      reportError(error);
    }
  };

  const handleRemoveGenre = async (genreIdToRemove: number) => {
    try {
      await SongApi.removeGenres(song.id, [genreIdToRemove]);
      // Non-null: as in handleThemesAdded.
      const newGenresList = song.genres!.filter(
        genreInList => genreInList.id !== genreIdToRemove
      );
      setSong({ ...song, genres: newGenresList });
    } catch (error) {
      reportError(error);
    }
  };

  function findLatestSetlistDate() {
    const pastSetlists = song?.setlists?.filter(setlist =>
      isPast(setlist.scheduled_date)
    );

    // Non-null: the API sends a song with its setlists; like before, this
    // throws otherwise.
    const sortedSetlists = pastSetlists!.sort((setlistA, setlistB) =>
      sortDates(setlistB.scheduled_date, setlistA.scheduled_date)
    );

    if (sortedSetlists[0]) {
      const latestDate = dayjs(
        sortedSetlists[0].scheduled_date,
        'YYYY-MM-DD'
      ).format('MMM D, YYYY');
      return { date: latestDate, ...sortedSetlists[0] };
    }
  }

  const handleKeyTypeChange = (keyType: string) => {
    setKeyType(keyType);
    const songWithKeyType = { ...song };

    delete songWithKeyType.format.chords_hidden;
    delete songWithKeyType.show_capo;
    delete songWithKeyType.show_transposed;
    if (keyType === 'transposed') {
      songWithKeyType.show_transposed = true;
    }

    if (keyType === 'capo') {
      songWithKeyType.show_capo = true;
    }

    if (keyType === 'none') {
      songWithKeyType.format.chords_hidden = true;
    }

    setSong(songWithKeyType);
  };

  return (
    <div className="grid grid-cols-4">
      <div className="col-span-4 lg:border-r lg:dark:border-dark-gray-700 lg:pr-4 lg:col-span-3">
        {currentMember.can(EDIT_SONGS) && !isEmpty(pendingUpdates) && (
          <UnsavedChangesBar
            changes={pendingUpdates}
            onSave={handleSaveChanges}
            isSaving={saving}
          />
        )}
        <div className="mb-2 flex-between">
          <PageTitle
            title={song.name}
            editable={currentMember.can(EDIT_SONGS)}
            onChange={editedName => handleUpdate('name', editedName)}
          />
          <Button
            variant="icon"
            color="gray"
            size="md"
            onClick={() => setShowPrintDialog(true)}
            className="hidden mr-2 sm:block"
          >
            <Icon name="print" className="w-6 h-6" />
          </Button>
          <SongOptionsPopover onPrintClick={() => setShowPrintDialog(true)} />
        </div>

        <PrintSongDialog
          song={song}
          open={showPrintDialog}
          onCloseDialog={() => setShowPrintDialog(false)}
        />
        <div className="items-center justify-between hidden mb-3 sm:flex">
          {/* M3E small buttons (40px), like the key menu beside them:
              Perform filled, Edit tonal. */}
          <span className="flex items-center gap-2">
            <Button
              variant="filled"
              size="sm"
              onClick={handlePresentSong}
              className="flex-center gap-2"
            >
              <Icon name="play_arrow" filled className="w-5 h-5" />
              Perform
            </Button>
            {currentMember.can(EDIT_SONGS) && (
              <Link
                to={{ pathname: `/songs/${id}/edit`, state: song }}
                className={buttonClasses({
                  variant: 'accent',
                  color: 'gray',
                  size: 'sm',
                  className: 'flex-center gap-2',
                })}
              >
                <Icon name="edit" filled className="w-5 h-5" />
                Edit
              </Link>
            )}
          </span>
          {hasAnyKeysSet(song) && (
            <DisplayedKeyMenu
              options={getKeyTypeOptions()}
              selected={keyType}
              onChange={handleKeyTypeChange}
            />
          )}
        </div>
        {/* M3E medium buttons (56px), side by side: Perform filled, Edit
            tonal. */}
        <div className="flex gap-2 mb-4 sm:hidden">
          <Button
            variant="filled"
            size="md"
            className="flex-center gap-2"
            onClick={handlePresentSong}
            full
          >
            <Icon name="play_arrow" filled className="w-6 h-6" />
            Perform
          </Button>
          {currentMember.can(EDIT_SONGS) && (
            <Link
              to={{ pathname: `/songs/${id}/edit`, state: song }}
              className={buttonClasses({
                variant: 'accent',
                color: 'gray',
                size: 'md',
                full: true,
                className: 'flex-center gap-2',
              })}
            >
              <Icon name="edit" filled className="w-6 h-6" />
              Edit
            </Link>
          )}
        </div>
        <SongPreview song={song} />
      </div>
      {/* The details, a tile each. */}
      <div className="col-span-4 py-6 lg:col-span-1 lg:pl-5">
        <div className="flex flex-col gap-2">
          <SongKeyField
            songKey={song.original_key}
            onChange={(editedKey: string) =>
              handleUpdate('original_key', editedKey)
            }
            editable={currentMember.can(EDIT_SONGS)}
          />
          <TransposedKeyField
            transposedKey={song.transposed_key}
            originalKey={song.original_key}
            onChange={(editedKey: string | null) =>
              handleUpdate('transposed_key', editedKey)
            }
            content={song.content}
            editable={currentMember.can(EDIT_SONGS)}
          />
          <BpmField
            bpm={song.bpm}
            onChange={(editedBpm: string) => handleUpdate('bpm', editedBpm)}
            editable={currentMember.can(EDIT_SONGS)}
          />
          <MeterField
            meter={song.meter}
            onChange={(editedMeter: string) =>
              handleUpdate('meter', editedMeter)
            }
            editable={currentMember.can(EDIT_SONGS)}
          />
          <ArtistField
            artist={song.artist}
            onChange={(editedArtist: string) =>
              handleUpdate('artist', editedArtist)
            }
            editable={currentMember.can(EDIT_SONGS)}
          />
          <LastScheduledField latestSetlist={findLatestSetlistDate()} />
        </div>
      </div>
      <SongTabs
        song={song}
        onTrackDeleted={handleTrackDeleted}
        onTracksAdded={handleTracksAdded}
        tags={
          <SongTags
            binders={song.binders}
            genres={song.genres}
            themes={song.themes}
            canEdit={currentMember.can(EDIT_SONGS)}
            onAddGenre={() => setShowGenreDialog(true)}
            onAddTheme={() => setShowAddThemeDialog(true)}
            onRemoveGenre={handleRemoveGenre}
            onRemoveTheme={handleRemoveTheme}
          />
        }
      />
      <AddGenreDialog
        open={showAddGenreDialog}
        currentSong={song}
        onCloseDialog={() => setShowGenreDialog(false)}
        onGenresAdded={handleGenresAdded}
      />
      <AddThemeDialog
        open={showAddThemeDialog}
        onCloseDialog={() => setShowAddThemeDialog(false)}
        currentSong={song}
        onThemesAdded={handleThemesAdded}
      />
    </div>
  );
}
