import { Suspense, lazy } from 'react';

import AccountDetailPage from '../pages/AccountDetailPage';
import AccountGeneralSettingsPage from '../pages/AccountGeneralSettingsPage';
import AccountNotificationSettingsPage from '../pages/AccountNotificationSettingsPage';
import AccountProfilePage from '../pages/AccountProfilePage';
import BinderDetailPage from '../pages/BinderDetailPage';
import BindersIndexPage from '../pages/BindersIndexPage';
import DashboardPage from '../pages/DashboardPage';
import ImportFilesPage from '../pages/ImportFilesPage';
import MemberDetailPage from '../pages/MemberDetailPage';
import MembersIndexPage from '../pages/MembersIndexPage';
import MobileNav from './MobileNav';
import Navbar from './Navbar';
import OnsongImportPage from '../pages/OnsongImportPage';
import PageLoading from './PageLoading';
import PcoRedirectPage from '../pages/PcoRedirectPage';
import { Route } from 'react-router-dom';
import SearchPage from './SearchPage';
import SetlistDetailPage from '../pages/SetlistDetailPage';
import SetlistsIndexPage from '../pages/SetlistsIndexPage';
import Sidenav from './Sidenav';
import SongDetailPage from '../pages/SongDetailPage';
import ImportSongsPage from '../pages/ImportSongsPage';
import SongsIndexPage from '../pages/SongsIndexPage';
import TeamDetailPage from '../pages/TeamDetailPage';
import EventFormProvider from '../contexts/EventFormProvider';
import { useSelector } from 'react-redux';
import { selectCurrentMember } from '../store/authSlice';
import { MANAGE_BILLING } from '../utils/constants';
import AccountAppearancePage from '../pages/AccountAppearancePage';
import ImportCadenceSongsPage from '../pages/ImportCadenceSongsPage';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';

const PlanningCenterSongsPage = lazy(() =>
  import('../pages/PlanningCenterSongsPage')
);
const RoleDetailPage = lazy(() => import('../pages/RoleDetailPage'));
const RolesIndexPage = lazy(() => import('../pages/RolesIndexPage'));
const CalendarPage = lazy(() => import('../pages/CalendarPage'));
const ChatPage = lazy(() => import('../pages/ChatPage'));
const EditCalendarEventPage = lazy(() =>
  import('../pages/EditCalendarEventPage')
);
const CreateCalendarEventPage = lazy(() =>
  import('../pages/CreateCalendarEventPage')
);
const BillingPage = lazy(() => import('../pages/BillingPage'));

export default function Content() {
  const currentMember = useSelector(selectCurrentMember);
  const location = useLocation();
  const isChat = location.pathname?.startsWith('/chat');

  if (!currentMember) return null;

  return (
    <>
      <Sidenav />
      <Navbar />
      <MobileNav />
      <div
        className={classNames(!isChat && 'p-3 md:px-10', 'md:ml-14 lg:ml-56')}
      >
        <div className={classNames(!isChat && 'container', 'mx-auto')}>
          <Route path="/" exact>
            <DashboardPage />
          </Route>
          <Route path="/binders/:id" exact>
            <BinderDetailPage />
          </Route>
          <Route path="/binders" exact>
            <BindersIndexPage />
          </Route>
          <Route path="/import/files" exact>
            <ImportFilesPage />
          </Route>
          <Route path="/import/onsong" exact>
            <OnsongImportPage />
          </Route>
          <Suspense fallback={<PageLoading />}>
            <Route
              path="/import/planning-center"
              exact
              component={PlanningCenterSongsPage}
            />
          </Suspense>
          <Route path="/import/cadence" exact>
            <ImportCadenceSongsPage />
          </Route>
          <Route path="/import/pco_redirect" exact>
            <PcoRedirectPage />
          </Route>
          <Route path="/import" exact>
            <ImportSongsPage />
          </Route>
          <Route path="/songs/:id" exact>
            <SongDetailPage />
          </Route>
          <Route path="/songs" exact>
            <SongsIndexPage />
          </Route>
          <Route path="/sets" exact>
            <SetlistsIndexPage />
          </Route>
          <Route path="/sets/:id" exact>
            <SetlistDetailPage />
          </Route>
          <Route path="/account" exact>
            <AccountDetailPage />
          </Route>
          <Route path="/account/settings" exact>
            <AccountGeneralSettingsPage />
          </Route>
          <Route path="/account/appearance" exact>
            <AccountAppearancePage />
          </Route>
          <Route path="/account/profile" exact>
            <AccountProfilePage />
          </Route>
          <Route path="/account/notifications" exact>
            <AccountNotificationSettingsPage />
          </Route>
          <Route path="/members/:id" exact>
            <MemberDetailPage />
          </Route>
          <Route path="/members" exact>
            <MembersIndexPage />
          </Route>
          <Route path="/team">
            <TeamDetailPage />
          </Route>
          <Route path="/search">
            <SearchPage />
          </Route>
          <Suspense fallback={<PageLoading />}>
            <Route path="/permissions/:id" exact component={RoleDetailPage} />
          </Suspense>
          <Suspense fallback={<PageLoading />}>
            <Route path="/permissions" exact component={RolesIndexPage} />
          </Suspense>
          {currentMember.can(MANAGE_BILLING) && (
            <Suspense
              fallback={<PageLoading>Loading billing details</PageLoading>}
            >
              <Route path="/billing" exact component={BillingPage} />
            </Suspense>
          )}
          <Suspense fallback={<PageLoading>Loading your calendar</PageLoading>}>
            <EventFormProvider>
              <Route path="/calendar" exact component={CalendarPage} />
              <Route
                path="/calendar/new"
                exact
                component={CreateCalendarEventPage}
              />
              <Route
                path="/calendar/:id/edit"
                exact
                component={EditCalendarEventPage}
              />
            </EventFormProvider>
          </Suspense>
          <Suspense fallback={<PageLoading>Loading chat</PageLoading>}>
            <Route path="/chat" exact component={ChatPage} />
          </Suspense>
        </div>
        <div className="h-12 md:h-0"></div>
      </div>
    </>
  );
}
