import { useMutation } from '@tanstack/react-query';
import PlanningCenterApi from '../../api/PlanningCenterApi';
import { reportError } from '../../utils/error';

export default function useImportPlanningCenterSongs({ onSuccess } = {}) {
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation({
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
