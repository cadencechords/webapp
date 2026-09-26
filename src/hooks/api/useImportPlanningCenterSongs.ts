import { useMutation } from '@tanstack/react-query';
import PlanningCenterApi from '../../api/PlanningCenterApi';
import { reportError } from '../../utils/error';
import type { Id } from '../../types';

export default function useImportPlanningCenterSongs({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation<void, Error, { songIds: Id[] }>({
    mutationFn: async ({ songIds }) => {
      await PlanningCenterApi.importSongs(songIds);
    },
    onSuccess,
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
