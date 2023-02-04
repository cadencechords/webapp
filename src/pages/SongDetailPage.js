import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import AddGenreDialog from '../components/AddGenreDialog';
import AddThemeDialog from '../components/AddThemeDialog';
import ArtistField from '../components/ArtistField';
import BinderColor from '../components/BinderColor';
import BpmField from '../components/BpmField';
import Button from '../components/Button';
import DetailSection from '../components/DetailSection';
import { EDIT_SONGS } from '../utils/constants';
import EyeIcon from '@heroicons/react/outline/EyeIcon';
import EyeOffIcon from '@heroicons/react/outline/EyeOffIcon';
import { Link } from 'react-router-dom';
import MeterField from '../components/MeterField';
import PageTitle from '../components/PageTitle';
import PencilIcon from '@heroicons/react/solid/PencilIcon';
import PlayIcon from '@heroicons/react/solid/PlayIcon';
import PrintSongDialog from '../components/PrintSongDialog';
import PrinterIcon from '@heroicons/react/outline/PrinterIcon';
import PulseLoader from 'react-spinners/PulseLoader';
import SongApi from '../api/SongApi';
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

export default function SongDetailPage() {
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [song, setSong] = useState();
  const [pendingUpdates, setPendingUpdates] = useState({});
  const [saving, setSaving] = useState(false);
  const [showAddThemeDialog, setShowAddThemeDialog] = useState(false);
  const [showAddGenreDialog, setShowGenreDialog] = useState(false);
  const dispatch = useDispatch();
  const currentMember = useSelector(selectCurrentMember);

  useEffect(() => (document.title = song ? song.name : 'Songs'), [song]);

  const router = useHistory();
  const { id } = useParams();

  useEffect(() => {
    async function fetchSong() {
      try {
        let { data } = await SongApi.getOneById(id);

        setSong({ ...data, show_transposed: Boolean(data.transposed_key) });
      } catch (error) {
        reportError(error);
      }
    }

    fetchSong();
  }, [id]);

  if (!song) {
    return (
      <div className="py-4 text-center">
        <PulseLoader color="#1f6feb" />
      </div>
    );
  }

  const handleUpdate = (field, value) => {
    let updates = { ...pendingUpdates };
    updates[field] = value;
    setPendingUpdates(updates);

    let updatedSong = { ...song };
    updatedSong[field] = value;
    setSong(updatedSong);
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      let result = await SongApi.updateOneById(id, pendingUpdates);
      setSong(currentSong => ({ ...currentSong, ...result.data }));
      setPendingUpdates({});
    } catch (error) {
      reportError(error);
    } finally {
      setSaving(false);
    }
  };

  const handlePresentSong = () => {
    dispatch(setSongBeingPresented(song));
    router.push(`/songs/${id}/present`);
  };

  const handleThemesAdded = newThemes => {
    setSong({ ...song, themes: song.themes.concat(newThemes) });
  };

  const handleGenresAdded = newGenres => {
    setSong({ ...song, genres: song.genres.concat(newGenres) });
  };

  const handleTrackDeleted = trackIdToRemove => {
    setSong(currentSong => {
      let updatedTracks = currentSong.tracks?.filter(
        track => track.id !== trackIdToRemove
      );
      return { ...currentSong, tracks: updatedTracks };
    });
  };

  const handleTracksAdded = addedTracks => {
    setSong(currentSong => {
      let updatedTracks = currentSong.tracks?.concat(addedTracks);
      return { ...currentSong, tracks: updatedTracks };
    });
  };

  const handleRemoveTheme = async themeIdToRemove => {
    try {
      await SongApi.removeThemes(song.id, [themeIdToRemove]);
      let newThemesList = song.themes.filter(
        themeInList => themeInList.id !== themeIdToRemove
      );
      setSong({ ...song, themes: newThemesList });
    } catch (error) {
      reportError(error);
    }
  };

  const handleRemoveGenre = async genreIdToRemove => {
    try {
      await SongApi.removeGenres(song.id, [genreIdToRemove]);
      let newGenresList = song.genres.filter(
        genreInList => genreInList.id !== genreIdToRemove
      );
      setSong({ ...song, genres: newGenresList });
    } catch (error) {
      reportError(error);
    }
  };

  const bindersTags = song?.binders?.map(binder => ({
    id: binder.id,
    name: (
      <Link to={`/binders/${binder.id}`}>
        <div className="flex items-center">
          <BinderColor color={binder.color} size={3} />
          <span className="ml-2">{binder.name}</span>
        </div>
      </Link>
    ),
  }));

  function handleUpdateSong(field, value) {
    setSong(currentSong => ({ ...currentSong, [field]: value }));
  }

  function handleUpdateFormat(field, value) {
    setSong(currentSong => {
      let updatedFormat = { ...currentSong.format };
      updatedFormat[field] = value;
      return { ...currentSong, format: updatedFormat };
    });
  }

  function findLatestSetlistDate() {
    let pastSetlists = song?.setlists?.filter(setlist =>
      isPast(setlist.scheduled_date)
    );

    let sortedSetlists = pastSetlists.sort((setlistA, setlistB) =>
      sortDates(setlistB.scheduled_date, setlistA.scheduled_date)
    );

    if (sortedSetlists[0]) {
      let latestDate = dayjs(
        sortedSetlists[0].scheduled_date,
        'YYYY-MM-DD'
      ).format('MMM D, YYYY');
      return { date: latestDate, ...sortedSetlists[0] };
    }
  }

  return (
    <div className="grid grid-cols-4">
      <div className="col-span-4 lg:border-r lg:dark:border-dark-gray-700 lg:pr-4 lg:col-span-3">
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
            <PrinterIcon className="w-5 h-5" />
          </Button>
          <SongOptionsPopover onPrintClick={() => setShowPrintDialog(true)} />
        </div>

        <PrintSongDialog
          song={song}
          open={showPrintDialog}
          onCloseDialog={() => setShowPrintDialog(false)}
        />
        <div className="items-center justify-between hidden mb-3 sm:flex">
          <span className="flex-center">
            <Button variant="filled" size="xs" onClick={handlePresentSong}>
              <div className="flex-center">
                <PlayIcon className="w-4 h-4 mr-1.5" />
                Perform
              </div>
            </Button>
            {currentMember.can(EDIT_SONGS) && (
              <Link to={{ pathname: `/songs/${id}/edit`, state: song }}>
                <Button variant="accent" size="xs" className="mx-3">
                  <div className="flex-center">
                    <PencilIcon className="w-4 h-4 mr-1.5" />
                    Edit
                  </div>
                </Button>
              </Link>
            )}

            {song?.transposed_key && (
              <Button
                size="xs"
                color="blue"
                onClick={() =>
                  handleUpdateSong('show_transposed', !song.show_transposed)
                }
                variant="open"
              >
                {song.show_transposed ? 'Stop transposing' : 'Transpose'}
              </Button>
            )}
          </span>
          <Button
            variant="icon"
            size="md"
            onClick={() =>
              handleUpdateFormat('chords_hidden', !song?.format?.chords_hidden)
            }
          >
            {song?.format?.chords_hidden ? (
              <EyeOffIcon className="h-5 text-gray-600" />
            ) : (
              <EyeIcon className="h-5" />
            )}
          </Button>
        </div>
        <div className="flex justify-between gap-3 mx-auto mb-4 sm:hidden">
          {currentMember.can(EDIT_SONGS) && (
            <Link
              to={{ pathname: `/songs/${id}/edit`, state: song }}
              className="w-full"
            >
              <Button
                variant="accent"
                size="medium"
                className="gap-3 flex-center"
                full
              >
                <PencilIcon className="w-5 h-5" />
                Edit
              </Button>
            </Link>
          )}
          <Button
            variant="accent"
            size="medium"
            className="gap-3 flex-center"
            onClick={handlePresentSong}
            full
          >
            <PlayIcon className="w-5 h-5" />
            Perform
          </Button>
        </div>
        <SongPreview song={song} />
      </div>
      <div className="col-span-4 pl-2 lg:col-span-1 lg:pl-5">
        <div className="py-6 mt-1 border-b dark:border-dark-gray-700">
          <SongKeyField
            songKey={song.original_key}
            onChange={editedKey => handleUpdate('original_key', editedKey)}
            editable={currentMember.can(EDIT_SONGS)}
          />
          <TransposedKeyField
            transposedKey={song.transposed_key}
            originalKey={song.original_key}
            onChange={editedKey => handleUpdate('transposed_key', editedKey)}
            content={song.content}
            editable={currentMember.can(EDIT_SONGS)}
          />
          <ArtistField
            artist={song.artist}
            onChange={editedArtist => handleUpdate('artist', editedArtist)}
            editable={currentMember.can(EDIT_SONGS)}
          />
          <BpmField
            bpm={song.bpm}
            onChange={editedBpm => handleUpdate('bpm', editedBpm)}
            editable={currentMember.can(EDIT_SONGS)}
          />
          <MeterField
            meter={song.meter}
            onChange={editedMeter => handleUpdate('meter', editedMeter)}
            editable={currentMember.can(EDIT_SONGS)}
          />
          <LastScheduledField latestSetlist={findLatestSetlistDate()} />
        </div>
        <div className="py-6">
          <DetailSection title="Binders" items={bindersTags} />
          <DetailSection
            title="Genres"
            items={song.genres}
            onAdd={() => setShowGenreDialog(true)}
            onDelete={handleRemoveGenre}
            canEdit={currentMember.can(EDIT_SONGS)}
          />
          <DetailSection
            title="Themes"
            items={song.themes}
            onAdd={() => setShowAddThemeDialog(true)}
            onDelete={handleRemoveTheme}
            canEdit={currentMember.can(EDIT_SONGS)}
          />
        </div>
      </div>
      {currentMember.can(EDIT_SONGS) && !isEmpty(pendingUpdates) && (
        <Button
          bold
          onClick={handleSaveChanges}
          loading={saving}
          className="fixed bottom-16 right-4 md:right-6 md:bottom-6"
        >
          Save Changes
        </Button>
      )}
      <SongTabs
        song={song}
        onTrackDeleted={handleTrackDeleted}
        onTracksAdded={handleTracksAdded}
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
