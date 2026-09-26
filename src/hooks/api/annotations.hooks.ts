import { useMutation } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import AnnotationsApi from '../../api/annotationsApi';
import type { AnnotationPath, Id } from '../../types';

export function useCreateBulkAnnotations() {
  const {
    isLoading,
    isSuccess,
    isError,
    mutateAsync: run,
  } = useMutation<
    AnnotationPath[],
    Error,
    { annotations: AnnotationPath[]; songId: Id }
  >({
    mutationFn: async ({ annotations, songId }) => {
      return (await AnnotationsApi.createBulk(annotations, songId)).data;
    },
  });

  return { isLoading, isSuccess, isError, run };
}

export function useDeleteBulkAnnotations() {
  const {
    isLoading,
    isSuccess,
    isError,
    mutateAsync: run,
  } = useMutation<
    AxiosResponse<unknown>,
    Error,
    { annotationIds: Id[]; songId: Id }
  >({
    mutationFn: async ({ annotationIds, songId }) => {
      return await AnnotationsApi.deleteBulk(annotationIds, songId);
    },
  });

  return { isLoading, isSuccess, isError, run };
}
