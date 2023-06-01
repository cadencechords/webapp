import 'react-toastify/dist/ReactToastify.min.css';
import * as Sentry from '@sentry/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';

import AppFallback from './components/AppFallback';
import CenteredPage from './components/CenteredPage';
import CreateNewTeamPage from './pages/CreateNewTeamPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PageLoading from './components/PageLoading';
import SecuredRoutes from './components/SecuredRoutes';
import SignUpPage from './pages/SignUpPage';
import { ToastContainer } from 'react-toastify';
import JoinLinkPage from './pages/JoinLinkPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ThemeProvider from './contexts/ThemeProvider';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const TeamLoginPage = lazy(() => import('./pages/TeamLoginPage'));
const EmailConfirmedPage = lazy(() => import('./pages/EmailConfirmedPage'));
const ClaimInvitationPage = lazy(() => import('./pages/ClaimInvitationPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const InvitationSignUpPage = lazy(() => import('./pages/InvitationSignUpPage'));

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // window?.Beacon('init', 'e59a5584-73cb-4380-b0b2-be1d76ff7362');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Suspense
          fallback={
            <CenteredPage>
              <PageLoading>Please wait...</PageLoading>
            </CenteredPage>
          }
        >
          <ToastContainer />
          <Sentry.ErrorBoundary
            showDialog
            fallback={({ error }) => <AppFallback error={error} />}
          >
            <Router>
              <Switch>
                <Route path="/login" exact component={LoginPage} />
                <Route path="/login/teams" exact component={TeamLoginPage} />
                <Route path="/join/:code" exact component={JoinLinkPage} />
                <Route path="/login/teams/new" exact>
                  <CreateNewTeamPage />
                </Route>
                <Route
                  path="/confirmation"
                  exact
                  component={EmailConfirmedPage}
                />
                <Route path="/signup" exact>
                  <SignUpPage />
                </Route>
                <Route path="/invitations" exact>
                  <ClaimInvitationPage />
                </Route>
                <Route path="/invitations/signup" exact>
                  <InvitationSignUpPage />
                </Route>
                <Route path="/forgot_password" exact>
                  <ForgotPasswordPage />
                </Route>
                <Route path="/reset_password" exact>
                  <ResetPasswordPage />
                </Route>
                <SecuredRoutes />
              </Switch>
            </Router>
          </Sentry.ErrorBoundary>
        </Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
