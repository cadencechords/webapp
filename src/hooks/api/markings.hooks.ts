import { useMutation, useQueryClient } from '@tanstack/react-query';
import MarkingsApi from '../../api/markingsApi';
import { reportError } from '../../utils/error';
import type { Id, Marking } from '../../types';

export function useCreateMarking({
  onSuccess,
}: { onSuccess?: (marking: Marking) => void } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation<Marking, Error, { marking: Omit<Marking, 'id'>; songId: Id }>(
    {
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
    }
  );

  return { isLoading, isSuccess, isError, error, run };
}

export function useUpdateMarking({
  onSuccess,
}: { onSuccess?: (marking: Marking) => void } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation<
    Marking,
    Error,
    { markingId: Id; songId: Id; updates: Partial<Omit<Marking, 'id'>> }
  >({
    mutationFn: async ({ markingId, songId, updates }) => {
      const { data } = await MarkingsApi.update(songId, markingId, updates);
      return data;
    },
    onSuccess: (data, { songId, markingId }) => {
      queryClient.invalidateQueries([
        'songs',
        `${songId}`,
        'markings',
        `${markingId}`,
      ]);
      onSuccess?.(data);
    },
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}

export function useDeleteMarking({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation<void, Error, { markingId: Id; songId: Id }>({
    mutationFn: async ({ markingId, songId }) => {
      await MarkingsApi.delete(songId, markingId);
    },
    onSuccess: (_data, { songId, markingId }) => {
      queryClient.removeQueries([
        'songs',
        `${songId}`,
        'markings',
        `${markingId}`,
      ]);
      onSuccess?.();
    },
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
