import { useEffect, useState } from 'react';
import type { AxiosResponse } from 'axios';

import AddCancelActions from './buttons/AddCancelActions';
import FixedBottomMobile from './FixedBottomMobile';
import GenreApi from '../api/GenreApi';
import GenreOptions from './GenreOptions';
import NoDataMessage from './NoDataMessage';
import OutlinedInput from './inputs/OutlinedInput';
import SongApi from '../api/SongApi';
import StyledDialog from './StyledDialog';
import { reportError } from '../utils/error';
import type { Song, Tag } from '../types';

type AddGenreDialogProps = {
  open: boolean;
  onCloseDialog: () => void;
  currentSong: Pick<Song, 'id' | 'genres'>;
  onGenresAdded: (genres: Tag[]) => void;
};

export default function AddGenreDialog({
  open,
  onCloseDialog,
  currentSong,
  onGenresAdded,
}: AddGenreDialogProps) {
  const [availableGenres, setAvailableGenres] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [genresToAdd, setGenresToAdd] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchGenres() {
      setLoading(true);
      try {
        const { data } = await GenreApi.getAll();

        if (data) {
          const availableGenres: Tag[] = [];
          data.forEach(possiblyAvailableGenre => {
            const index = currentSong?.genres?.findIndex(alreadyBoundGenre => {
              return alreadyBoundGenre.id === possiblyAvailableGenre.id;
            });

            if (index === -1) {
              availableGenres.push(possiblyAvailableGenre);
            }
          });

          setAvailableGenres(availableGenres);
        }
      } catch (error) {
        reportError(error);
      } finally {
        setLoading(false);
      }
    }

    if (open) {
      fetchGenres();
    }
  }, [currentSong, open]);

  const handleGenreToggled = (checked: boolean, genre: Tag) => {
    if (checked) {
      setGenresToAdd([...genresToAdd, genre]);
    } else {
      const updatedGenres = genresToAdd.filter(
        addedGenre => addedGenre !== genre
      );
      setGenresToAdd(updatedGenres);
    }
  };

  const filterAvailableGenres = () => {
    return availableGenres.filter(genre =>
      genre.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const clearData = () => {
    setGenresToAdd([]);
    setAvailableGenres([]);
    setLoading(false);
    setSearchTerm('');
    setSaving(false);
  };

  const handleCloseDialog = () => {
    clearData();
    onCloseDialog();
  };

  const handleSaveGenres = async () => {
    try {
      setSaving(true);
      const genresIdsToAdd = genresToAdd.map(genre => genre.id);
      // Add is disabled until a genre is picked, so addGenres has ids to send
      // and returns a request (it returns undefined only for no ids). The response
      // is read as the added genres: SongDetailPage concatenates it onto the
      // song's genres.
      const { data } = (await SongApi.addGenres(
        currentSong.id,
        genresIdsToAdd
      )) as AxiosResponse<Tag[]>;
      onGenresAdded(data);
      handleCloseDialog();
    } catch (error) {
      reportError(error);
      setSaving(false);
    }
  };

  return (
    <StyledDialog
      open={open}
      onCloseDialog={handleCloseDialog}
      title="Add genres"
      size="xl"
    >
      <OutlinedInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search for a specific genre"
      />
      {availableGenres.length === 0 ? (
        <div className="py-4">
          <NoDataMessage loading={loading}>
            There are no genres to choose from
          </NoDataMessage>
        </div>
      ) : (
        <GenreOptions
          genres={filterAvailableGenres()}
          selectedGenres={genresToAdd}
          onToggle={handleGenreToggled}
        />
      )}
      <FixedBottomMobile>
        <AddCancelActions
          addDisabled={genresToAdd?.length === 0}
          onCancel={handleCloseDialog}
          onAdd={handleSaveGenres}
          loadingAdd={saving}
        />
      </FixedBottomMobile>
    </StyledDialog>
  );
}
