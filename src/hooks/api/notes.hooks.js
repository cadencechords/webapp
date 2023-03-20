import { useMutation, useQueryClient } from '@tanstack/react-query';
import NotesApi from '../../api/notesApi';
import { reportError } from '../../utils/error';

export default function useCreateNote({ onSuccess }) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation({
    mutationFn: async ({ note, songId }) => {
      const { data } = await NotesApi.create(songId, note);
      return data;
    },
    onSuccess: (data, { songId }) => {
      queryClient.invalidateQueries(['songs', `${songId}`, 'notes']);
      onSuccess?.(data);
    },
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
