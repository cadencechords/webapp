import * as Sentry from "@sentry/react";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";

import AppFallback from "./components/AppFallback";
import CenteredPage from "./components/CenteredPage";
import PageLoading from "./components/PageLoading";
import CustomerPortalSessionGeneratorPage from "./pages/CustomerPortalSessionGeneratorPage";
import EditorWorkbenchPage from "./pages/EditorWorkbenchPage";
import SongPresenterPage from "./pages/SongPresenterPage";
import SetPresenterPage from "./pages/SetPresenterPage";

import AccountBillingPage from "./pages/AccountBillingPage";
import AccountDetailPage from "./pages/AccountDetailPage";
import AccountGeneralSettingsPage from "./pages/AccountGeneralSettingsPage";
import AccountNotificationSettingsPage from "./pages/AccountNotificationSettingsPage";
import AccountProfilePage from "./pages/AccountProfilePage";
import BinderDetailPage from "./pages/BinderDetailPage";
import BindersIndexPage from "./pages/BindersIndexPage";
import DashboardPage from "./pages/DashboardPage";
import ImportFilesPage from "./pages/ImportFilesPage";
import MemberDetailPage from "./pages/MemberDetailPage";
import MembersIndexPage from "./pages/MembersIndexPage";
import MobileNav from "./components/MobileNav";
import Navbar from "./components/Navbar";
import OnsongImportPage from "./pages/OnsongImportPage";

import PcoRedirectPage from "./pages/PcoRedirectPage";
import SearchPage from "./components/SearchPage";
import SetlistDetailPage from "./pages/SetlistDetailPage";
import SetlistsIndexPage from "./pages/SetlistsIndexPage";
import Sidenav from "./components/Sidenav";
import SongDetailPage from "./pages/SongDetailPage";
import SongImportSourcesIndexPage from "./pages/SongImportSourcesIndexPage";
import SongsIndexPage from "./pages/SongsIndexPage";
import TeamDetailPage from "./pages/TeamDetailPage";

const PcoSongsIndexPage = lazy(() => import("./pages/PcoSongsIndexPage"));
const RoleDetailPage = lazy(() => import("./pages/RoleDetailPage"));
const RolesIndexPage = lazy(() => import("./pages/RolesIndexPage"));
const CalendarPage = lazy(() => import("./pages/CalendarPage"));

function App() {
  useEffect(() => {
    let theme = localStorage.getItem("theme");

    if (theme === "dark") {
      document.querySelector("html").className += " dark";
    }
  }, []);

  return (
    <Suspense
      fallback={
        <CenteredPage>
          <PageLoading>Please wait...</PageLoading>
        </CenteredPage>
      }
    >
      <Sentry.ErrorBoundary showDialog fallback={<AppFallback />}>
        <Router>
          <Switch>
            <Route path="/editor" exact component={EditorWorkbenchPage} />
            <Route
              path="/songs/:id/present"
              exact
              component={SongPresenterPage}
            />
            <Route
              path="/sets/:id/present"
              exact
              component={SetPresenterPage}
            />
            <Route
              path="/customer_portal_session"
              exact
              component={CustomerPortalSessionGeneratorPage}
            />
            <Route path="/">
              <>
                <Sidenav />
                <Navbar />
                <MobileNav />
                <div className="md:ml-14 lg:ml-52 md:px-10 px-2 py-3">
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
                    <Route path="/account/billing" exact>
                      <AccountBillingPage />
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
                      <Route
                        path="/permissions/:id"
                        exact
                        component={RoleDetailPage}
                      />
                    </Suspense>
                    <Suspense fallback={<PageLoading />}>
                      <Route
                        path="/permissions"
                        exact
                        component={RolesIndexPage}
                      />
                    </Suspense>
                    <Suspense
                      fallback={
                        <PageLoading>Loading your calendar</PageLoading>
                      }
                    >
                      <Route path="/calendar" exact component={CalendarPage} />
                    </Suspense>
                  </div>
                  <div className="h-12 md:h-0"></div>
                </div>
              </>
            </Route>
          </Switch>
        </Router>
      </Sentry.ErrorBoundary>
    </Suspense>
  );
}

export default App;
