import * as Sentry from '@sentry/react';

import { Route, Switch } from 'react-router-dom';
import { lazy, useEffect } from 'react';
import {
  selectCurrentTeam,
  selectCurrentUser,
  selectHasCredentials,
  selectTeamId,
  setCurrentTeam,
  setCurrentUser,
  setMembership,
} from '../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import OneSignal from 'react-onesignal';

import CenteredPage from './CenteredPage';
import Content from './Content';
import PageLoading from './PageLoading';
import TeamApi from '../api/TeamApi';
import UserApi from '../api/UserApi';
import { reportError } from '../utils/error';
import {
  selectCurrentSubscription,
  setSubscription,
} from '../store/subscriptionSlice';
import { useHistory } from 'react-router';
import PerformanceModeProvider from '../contexts/PerformanceModeProvider';
import AnnotationsToolbarProvider from '../contexts/AnnotationsToolbarProvider';

const SongEditorPage = lazy(() => import('../pages/SongEditorPage'));
const CustomerPortalSessionGeneratorPage = lazy(() =>
  import('../pages/CustomerPortalSessionGeneratorPage')
);
const SetPresenterPage = lazy(() => import('../pages/SetPresenterPage'));
const SongPresenterPage = lazy(() => import('../pages/SongPresenterPage'));

export default function SecuredRoutes() {
  const dispatch = useDispatch();
  const hasCredentials = useSelector(selectHasCredentials);
  const teamId = useSelector(selectTeamId);
  const router = useHistory();
  const currentUser = useSelector(selectCurrentUser);
  const currentTeam = useSelector(selectCurrentTeam);
  const currentSubscription = useSelector(selectCurrentSubscription);

  useEffect(() => {
    if (!hasCredentials) {
      router.push('/login');
    } else {
      async function fetchCurrentUser() {
        try {
          let { data } = await UserApi.getCurrentUser();
          Sentry.setUser({ email: data.email });
          dispatch(setCurrentUser(data));

          if (!data.timezone) saveTimeZone();

          if (!teamId) {
            router.push('/login/teams');
          } else {
            await fetchCurrentTeam();
          }
        } catch (error) {
          reportError(error);
          router.push('/login');
        }
      }

      fetchCurrentUser();
    }

    async function fetchCurrentTeam() {
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
        router.push('/login/teams');
      }
    }
  }, [hasCredentials, router, teamId, dispatch]);

  async function saveTimeZone() {
    let currentTimeZone = Intl?.DateTimeFormat().resolvedOptions().timeZone;
    if (currentTimeZone) {
      await UserApi.updateCurrentUser({ timezone: currentTimeZone });
    }
  }

  useEffect(() => {
    async function setupOneSignal() {
      if (currentSubscription?.isPro && currentUser?.id === 3) {
        await OneSignal.init({
          appId: 'e74ed29a-0bb3-4484-9403-45b6271b7f94',
          allowLocalhostAsSecureOrigin: true,
        });

        OneSignal.setExternalUserId(currentUser.uid);
      }
    }

    setupOneSignal();

    return () => {
      OneSignal.removeExternalUserId();
    };
  }, [currentSubscription, currentUser]);

  if (currentUser && currentTeam) {
    return (
      <>
        <Switch>
          <Route path="/songs/:id/edit" exact component={SongEditorPage} />
          <Route path="/songs/:id/present" exact>
            <PerformanceModeProvider>
              <AnnotationsToolbarProvider>
                <SongPresenterPage />
              </AnnotationsToolbarProvider>
            </PerformanceModeProvider>
          </Route>
          <Route path="/sets/:id/present" exact>
            <PerformanceModeProvider>
              <AnnotationsToolbarProvider>
                <SetPresenterPage />
              </AnnotationsToolbarProvider>
            </PerformanceModeProvider>
          </Route>
          <Route
            path="/customer_portal_session"
            exact
            component={CustomerPortalSessionGeneratorPage}
          />
          <Route path="/">
            <Content />
          </Route>
        </Switch>
      </>
    );
  } else {
    return (
      <CenteredPage>
        <PageLoading>Please wait...</PageLoading>
      </CenteredPage>
    );
  }
}
