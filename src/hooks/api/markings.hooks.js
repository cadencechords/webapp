import { useMutation, useQueryClient } from '@tanstack/react-query';
import MarkingsApi from '../../api/markingsApi';
import { reportError } from '../../utils/error';

export function useCreateMarking({ onSuccess }) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation({
    mutationFn: async ({ marking, songId }) => {
      const { data } = await MarkingsApi.create(songId, marking);
      return data;
    },
    onSuccess: (data, { songId }) => {
      queryClient.invalidateQueries(['songs', `${songId}`, 'markings']);
      onSuccess?.(data);
    },
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
