import { useEffect, useContext } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import FormatApi from '../api/FormatApi';
import SongApi from '../api/SongApi';
import { SongEditorContext } from '../contexts/SongEditorProvider';
import { reportError } from '../utils/error';

export default function useSongEditor() {
  const initialData = useLocation().state;
  const router = useHistory();
  const { id } = useParams();

  const {
    loading,
    setLoading,
    song,
    setSong,
    editedContent,
    setEditedContent,
    editedFormat,
    setEditedFormat,
    saving,
    setSaving,
  } = useContext(SongEditorContext);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let { data } = await SongApi.getOneById(id);

        setSong({
          ...data,
          show_transposed: Boolean(data.transposed_key),
        });
      } catch (error) {
        reportError(error);
      } finally {
        setLoading(false);
      }
    }

    if (!song) {
      if (!initialData) {
        fetchData();
      } else {
        setSong(initialData);
      }
    }
  }, [id, initialData, setLoading, setSong, song]);

  function updateFormat(updates) {
    setSong(previousSong => ({
      ...previousSong,
      format: { ...previousSong.format, ...updates },
    }));
    setEditedFormat(previousFormat => ({ ...previousFormat, ...updates }));
  }

  function updateContent(updatedContent) {
    setEditedContent(updatedContent);
    setSong(previousSong => ({ ...previousSong, content: updatedContent }));
  }

  async function saveChanges() {
    setSaving(true);
    if (editedContent !== null && editedContent !== undefined) {
      try {
        await SongApi.updateOneById(song.id, {
          content: editedContent,
        });
        setEditedContent(null);
      } catch (error) {
        reportError(error);
      }
    }

    if (editedFormat) {
      try {
        await FormatApi.updateSongFormat(song.id, editedFormat);
        router.replace(`/songs/${song.id}/edit`, song);
        setEditedFormat(null);
      } catch (error) {
        reportError(error);
      }
    }
    setSaving(false);
  }

  return {
    song,
    loading,
    updateContent,
    updateFormat,
    dirty:
      (editedContent !== null && editedContent !== undefined) || !!editedFormat,
    saveChanges,
    saving,
  };
}
