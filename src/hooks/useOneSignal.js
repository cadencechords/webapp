import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentUser,
  selectTeamId,
  setCurrentTeam,
  setMembership,
  setTeamId,
} from '../store/authSlice';
import {
  selectCurrentSubscription,
  setSubscription,
} from '../store/subscriptionSlice';
import OneSignal from 'react-onesignal';
import { useHistory } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { reportError } from '../utils/error';
import TeamApi from '../api/TeamApi';
import UserApi from '../api/UserApi';

export default function useOneSignal() {
  const isConfigured = useRef(false);
  const teamId = useSelector(selectTeamId);
  const currentSubscription = useSelector(selectCurrentSubscription);
  const currentUser = useSelector(selectCurrentUser);
  const router = useHistory();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const isProSubscription = currentSubscription?.isPro;
  const uid = currentUser?.uid;
  const userId = currentUser?.id;

  const switchTeams = useCallback(
    async newTeamId => {
      console.log('switching teams');
      dispatch(setTeamId(newTeamId));
      localStorage.setItem('teamId');
      queryClient.removeQueries();

      try {
        let { data } = await TeamApi.getCurrentTeam();
        dispatch(setCurrentTeam(data.team));
        dispatch(setSubscription(data.subscription));

        let membershipResponse = await UserApi.getTeamMembership();
        dispatch(
          setMembership({
            role: membershipResponse.data.role,
          })
        );
      } catch (error) {
        reportError(error);
      }
    },
    [dispatch, queryClient]
  );

  useEffect(() => {
    async function setupOneSignal() {
      if (isProSubscription && userId === 3) {
        console.log('setting up onesignal');
        if (!isConfigured.current) {
          await OneSignal.init({
            appId: 'e74ed29a-0bb3-4484-9403-45b6271b7f94',
          });
          isConfigured.current = true;
        }

        await OneSignal.setExternalUserId(uid);
        OneSignal.showSlidedownPrompt();
        OneSignal.addListenerForNotificationOpened(async ({ data }) => {
          console.log(data);
          let { team_id, message_id, type } = data || {};
          if (team_id) team_id = parseInt(team_id);

          if (type === 'chat') {
            if (team_id !== teamId) {
              await switchTeams(team_id);
            }

            console.log('pushing');
            router.push(`/chat?message_id=${message_id}`);
          }
        });
      }
    }

    setupOneSignal();

    return () => {
      console.log('removing listener');
      OneSignal.removeExternalUserId();
      OneSignal.addListenerForNotificationOpened(() => {});
    };
  }, [userId, isProSubscription, uid, teamId, switchTeams, router]);
}
