import { useEffect } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import FormatApi from '../api/FormatApi';
import SongApi from '../api/SongApi';
import { useSongEditorContext } from '../contexts/SongEditorProvider';
import { reportError } from '../utils/error';
import type { Song, SongFormat } from '../types';

export default function useSongEditor() {
  // Location state is whatever the navigating code passed; routes to the
  // editor pass the song (possibly missing), or nothing.
  const initialData = useLocation().state as Song | null | undefined;
  const router = useHistory();
  const { id } = useParams<{ id: string }>();

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
  } = useSongEditorContext();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data } = await SongApi.getOneById(id);

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

  // Non-null song (`previousSong!`, `song!`) in updateFormat, updateContent
  // and saveChanges: they're called from the format options, the editor and
  // the Save button, which SongEditorPage renders only once the song loads.
  function updateFormat(updates: Partial<SongFormat>) {
    setSong(previousSong => ({
      ...previousSong!,
      format: { ...previousSong!.format, ...updates },
    }));
    setEditedFormat(previousFormat => ({ ...previousFormat, ...updates }));
  }

  function updateContent(updatedContent: string) {
    setEditedContent(updatedContent);
    setSong(previousSong => ({ ...previousSong!, content: updatedContent }));
  }

  async function saveChanges() {
    setSaving(true);
    if (editedContent !== null && editedContent !== undefined) {
      try {
        await SongApi.updateOneById(song!.id, {
          content: editedContent,
        });
        setEditedContent(null);
      } catch (error) {
        reportError(error);
      }
    }

    if (editedFormat) {
      try {
        await FormatApi.updateSongFormat(song!.id, editedFormat);
        router.replace(`/songs/${song!.id}/edit`, song);
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
