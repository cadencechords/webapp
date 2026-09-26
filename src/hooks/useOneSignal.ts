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
import type { Id } from '../types';

/** The data the API sends with a push notification. */
interface NotificationData {
  /** 'chat' for a new chat message. */
  type?: string;
  /** The team the chat message was sent on. */
  team_id?: Id;
  message_id?: Id;
}

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
    async (newTeamId: Id) => {
      dispatch(setTeamId(newTeamId));
      // `as`: setItem stores a number as its string (Web Storage converts the
      // value with String()), the same as setTeamId does.
      localStorage.setItem('teamId', newTeamId as string);
      queryClient.removeQueries();

      try {
        const { data } = await TeamApi.getCurrentTeam();
        dispatch(setCurrentTeam(data.team));
        dispatch(setSubscription(data.subscription));

        const membershipResponse = await UserApi.getTeamMembership();
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
        if (!isConfigured.current) {
          await OneSignal.init({
            appId: 'e74ed29a-0bb3-4484-9403-45b6271b7f94',
          });
          isConfigured.current = true;
        }

        await OneSignal.setExternalUserId(uid);
        OneSignal.showSlidedownPrompt();
        OneSignal.addListenerForNotificationOpened(async ({ data }) => {
          const { team_id, type, message_id }: NotificationData = data || {};

          if (type === 'chat') {
            if (team_id !== teamId) {
              // Non-null: chat notifications carry the team they were sent on.
              await switchTeams(team_id!);
            }

            router.push(`/chat?messageId=${message_id}`);
          }
        });
      }
    }

    if (window.location.hostname !== 'localhost') setupOneSignal();

    return () => {
      OneSignal.removeExternalUserId();
    };
  }, [userId, isProSubscription, uid, teamId, switchTeams, router]);
}
