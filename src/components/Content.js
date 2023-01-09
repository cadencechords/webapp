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
import SongImportSourcesIndexPage from '../pages/SongImportSourcesIndexPage';
import SongsIndexPage from '../pages/SongsIndexPage';
import TeamDetailPage from '../pages/TeamDetailPage';
import CreateCalendarEventPage from '../pages/CreateCalendarEventPage';
import EventFormProvider from '../contexts/EventFormProvider';
import EditCalendarEventPage from '../pages/EditCalendarEventPage';

const PcoSongsIndexPage = lazy(() => import('../pages/PcoSongsIndexPage'));
const RoleDetailPage = lazy(() => import('../pages/RoleDetailPage'));
const RolesIndexPage = lazy(() => import('../pages/RolesIndexPage'));
const CalendarPage = lazy(() => import('../pages/CalendarPage'));

export default function Content() {
  return (
    <>
      <Sidenav />
      <Navbar />
      <MobileNav />
      <div className="px-2 py-3 md:ml-14 lg:ml-52 md:px-10">
        <div className="container mx-auto">
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
              path="/import/pco/songs"
              exact
              component={PcoSongsIndexPage}
            />
          </Suspense>
          <Route path="/import/pco_redirect" exact>
            <PcoRedirectPage />
          </Route>
          <Route path="/import" exact>
            <SongImportSourcesIndexPage />
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
        </div>
        <div className="h-12 md:h-0"></div>
      </div>
    </>
  );
}
