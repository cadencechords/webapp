import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import CaposApi from '../../api/caposApi';
import { reportError } from '../../utils/error';
import type { Capo, Id } from '../../types';

export function useDeleteCapo({ onSuccess }: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    error,
    mutate: run,
  } = useMutation<AxiosResponse<unknown>, Error, { capoId: Id; songId: Id }>({
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

export function useCreateCapo({
  onSuccess,
}: { onSuccess?: (capo: Capo) => void } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    error,
    mutate: run,
  } = useMutation<Capo, Error, { capo_key: string; songId: Id }>({
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

export function useUpdateCapo({
  onSuccess,
}: { onSuccess?: (capo: Capo) => void } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    error,
    mutate: run,
  } = useMutation<Capo, Error, { capo_key: string; songId: Id; capoId: Id }>({
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
