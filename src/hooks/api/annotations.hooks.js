import { useMutation } from '@tanstack/react-query';
import AnnotationsApi from '../../api/annotationsApi';

export function useCreateBulkAnnotations() {
  const {
    isLoading,
    isSuccess,
    isError,
    mutateAsync: run,
  } = useMutation({
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
  } = useMutation({
    mutationFn: async ({ annotationIds, songId }) => {
      return await AnnotationsApi.deleteBulk(annotationIds, songId);
    },
  });

  return { isLoading, isSuccess, isError, run };
}
