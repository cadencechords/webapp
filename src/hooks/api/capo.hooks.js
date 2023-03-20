import { useMutation, useQueryClient } from '@tanstack/react-query';
import CaposApi from '../../api/caposApi';
import { reportError } from '../../utils/error';

export function useDeleteCapo({ onSuccess } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    error,
    mutate: run,
  } = useMutation({
    mutationFn: async ({ capoId, songId }) => {
      return await CaposApi.delete(capoId, songId);
    },
    onError: error => {
      reportError(error);
    },
    onSuccess: (_, { songId }) => {
      onSuccess?.();
      queryClient.invalidateQueries(['songs', `${songId}`]);
    },
  });

  return { isLoading, error, run };
}

export function useCreateCapo({ onSuccess } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    error,
    mutate: run,
  } = useMutation({
    mutationFn: async ({ capo_key, songId }) => {
      return (await CaposApi.create(capo_key, songId)).data;
    },
    onError: error => {
      reportError(error);
    },
    onSuccess: (data, { songId }) => {
      onSuccess?.(data);
      queryClient.invalidateQueries(['songs', `${songId}`]);
    },
  });

  return { isLoading, error, run };
}

export function useUpdateCapo({ onSuccess } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    error,
    mutate: run,
  } = useMutation({
    mutationFn: async ({ capo_key, songId, capoId }) => {
      return (await CaposApi.update(capoId, songId, { capo_key })).data;
    },
    onError: error => {
      reportError(error);
    },
    onSuccess: (data, { songId }) => {
      onSuccess?.(data);
      queryClient.invalidateQueries(['songs', `${songId}`]);
    },
  });

  return { isLoading, error, run };
}
