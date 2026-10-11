import { useMutation } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import TeamApi from '../../api/TeamApi';
import { selectCurrentTeam, setCurrentTeam } from '../../store/authSlice';
import { reportError } from '../../utils/error';
import type { Team } from '../../types';

/** Turns the current team's automatic roadmaps on or off. The switch flips
    right away; a failed save turns it back. */
export function useSetAutoRoadmaps() {
  const dispatch = useDispatch();
  // Non-null: used by TeamDetailPage, under SecuredRoutes, which renders only
  // once the current team loads.
  const currentTeam = useSelector(selectCurrentTeam)!;
  return useMutation<
    AxiosResponse<Team>,
    Error,
    boolean,
    { previous: boolean | undefined }
  >({
    mutationFn: enabled => TeamApi.update({ auto_roadmaps: enabled }),
    onMutate: enabled => {
      dispatch(setCurrentTeam({ ...currentTeam, auto_roadmaps: enabled }));
      return { previous: currentTeam.auto_roadmaps };
    },
    onError: (error, _enabled, context) => {
      reportError(error);
      dispatch(
        setCurrentTeam({ ...currentTeam, auto_roadmaps: context?.previous })
      );
    },
  });
}
