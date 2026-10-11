import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useStore } from 'react-redux';
import TeamApi from '../../api/TeamApi';
import { selectCurrentTeam, setCurrentTeam } from '../../store/authSlice';
import { reportError } from '../../utils/error';
import type { RootState } from '../../store/store';
import type { Id } from '../../types';

const AUTO_ROADMAPS_KEY = ['team', 'auto_roadmaps'];

/** Turns the current team's automatic roadmaps on or off. The switch flips
    right away; a failed save turns it back. */
export function useSetAutoRoadmaps() {
  const dispatch = useDispatch();
  const store = useStore<RootState>();
  const queryClient = useQueryClient();
  const { mutate } = useMutation<
    unknown,
    Error,
    { teamId: Id; enabled: boolean; previous: boolean | undefined }
  >({
    mutationKey: AUTO_ROADMAPS_KEY,
    mutationFn: ({ enabled }) => TeamApi.update({ auto_roadmaps: enabled }),
    onError: (error, { teamId, previous }) => {
      reportError(error);
      // Turned back on the latest team, not the one at the click: a rename
      // may have changed it meanwhile. Not if the user signed out or switched
      // teams.
      const team = selectCurrentTeam(store.getState());
      if (team?.id === teamId) {
        dispatch(setCurrentTeam({ ...team, auto_roadmaps: previous }));
      }
    },
  });

  function run(enabled: boolean) {
    // One save at a time, even across leaving and coming back to the page:
    // clicks while one is in flight are ignored, so a failure can't turn the
    // switch back to another click's unsaved value. isMutating is read from
    // the mutation cache, so it's current even before a re-render.
    if (queryClient.isMutating({ mutationKey: AUTO_ROADMAPS_KEY }) > 0) return;
    // Non-null: the switch renders only once the current team loads.
    const team = selectCurrentTeam(store.getState())!;
    // Before mutate, not in onMutate, which runs a tick later.
    dispatch(setCurrentTeam({ ...team, auto_roadmaps: enabled }));
    mutate({ teamId: team.id, enabled, previous: team.auto_roadmaps });
  }

  return { run };
}
