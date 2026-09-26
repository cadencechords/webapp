// @vitest-environment-options {"url": "https://app.example.com/"}
import { act, fireEvent, render, screen } from '@testing-library/react';
import type { AxiosResponse } from 'axios';
import type { ReactElement } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import OneSignal from 'react-onesignal';
import AuthApi from '../api/AuthApi';
import InvitationApi from '../api/InvitationApi';
import JoinLinkApi from '../api/joinLinkApi';
import TeamApi from '../api/TeamApi';
import UserApi from '../api/UserApi';
import TeamLoginOption from '../components/TeamLoginOption';
import useOneSignal from '../hooks/useOneSignal';
import type { Team, User } from '../types';
import { renderWithProvider, type DeepPartial } from '../utils/test';
import type { RootState } from '../store/store';
import ClaimInvitationPage from './ClaimInvitationPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import InvitationSignUpPage from './InvitationSignUpPage';
import JoinLinkPage from './JoinLinkPage';
import LoginPage from './LoginPage';
import ResetPasswordPage from './ResetPasswordPage';
import SignUpPage from './SignUpPage';
import TeamLoginPage from './TeamLoginPage';

// Pins the behavior of the files converted in CAD-138. The file runs on a
// non-localhost URL so useOneSignal sets OneSignal up.

vi.mock('../api/AuthApi', () => ({
  default: {
    login: vi.fn(),
    signUp: vi.fn(),
    sendResetPasswordInstructions: vi.fn(),
    resetPassword: vi.fn(),
  },
}));
vi.mock('../api/InvitationApi', () => ({
  default: { claimOne: vi.fn(), signUpThroughToken: vi.fn() },
}));
vi.mock('../api/joinLinkApi', () => ({
  default: { getByJoinLinkCode: vi.fn(), join: vi.fn() },
}));
vi.mock('../api/TeamApi', () => ({
  default: { getAll: vi.fn(), getCurrentTeam: vi.fn() },
}));
vi.mock('../api/UserApi', () => ({
  default: { getCurrentUser: vi.fn(), getTeamMembership: vi.fn() },
}));
vi.mock('react-onesignal', () => ({
  default: {
    init: vi.fn(),
    setExternalUserId: vi.fn(),
    showSlidedownPrompt: vi.fn(),
    addListenerForNotificationOpened: vi.fn(),
    removeExternalUserId: vi.fn(),
  },
}));
vi.mock('../utils/error');

beforeEach(() => {
  localStorage.clear();
  // passwords.js isn't loaded in tests: rate every password as strong.
  window.zxcvbn = () => ({ score: 4 });
});

afterEach(() => {
  vi.clearAllMocks();
});

function response<T>(
  data: T,
  headers: Record<string, string> = {}
): AxiosResponse<T> {
  return { data, headers, status: 200, statusText: 'OK', config: {} };
}

const authHeaders = {
  'access-token': 'TOKEN',
  client: 'CLIENT',
  uid: 'someone@example.com',
};

const user: User = { id: 3, email: 'someone@example.com', uid: 'UID-3' };
const team: Team = { id: 12, name: 'Worship Team', users: [] };

/** Renders at `url` and shows where the page sends the router. */
function renderAt(
  url: string,
  path: string,
  page: ReactElement,
  preloadedState?: DeepPartial<RootState>
) {
  return renderWithProvider(
    <MemoryRouter initialEntries={[url]}>
      <Route path={path} exact>
        {page}
      </Route>
      <Route
        render={({ location }) => (
          <div data-testid="location">
            {location.pathname + location.search}
          </div>
        )}
      />
    </MemoryRouter>,
    { preloadedState }
  );
}

function type(placeholder: string, value: string) {
  fireEvent.change(screen.getByPlaceholderText(placeholder), {
    target: { value },
  });
}

test('TeamLoginOption logs in to its team by id', () => {
  const onLoginTeam = vi.fn();
  render(<TeamLoginOption team={team} onLoginTeam={onLoginTeam} />);

  fireEvent.click(screen.getByText('Worship Team'));
  expect(onLoginTeam).toHaveBeenCalledWith(12);
});

test('LoginPage stores the credentials and goes to the target url', async () => {
  vi.mocked(AuthApi.login).mockResolvedValue(
    response({ data: user }, authHeaders)
  );
  vi.mocked(UserApi.getCurrentUser).mockResolvedValue(response(user));
  const { store } = renderAt(
    '/login?target_url=/join/abc',
    '/login',
    <LoginPage />
  );

  type('email', 'someone@example.com');
  type('password', 'hunter22');
  fireEvent.click(screen.getByText('Login'));

  expect(await screen.findByTestId('location')).toHaveTextContent('/join/abc');
  expect(AuthApi.login).toHaveBeenCalledWith('someone@example.com', 'hunter22');
  expect(store.getState().auth).toMatchObject({
    accessToken: 'TOKEN',
    client: 'CLIENT',
    uid: 'someone@example.com',
    currentUser: user,
  });
  expect(localStorage.getItem('access-token')).toBe('TOKEN');
  expect(localStorage.getItem('client')).toBe('CLIENT');
});

test('LoginPage shows the API errors in a red alert', async () => {
  vi.mocked(AuthApi.login).mockRejectedValue({
    response: { data: { errors: ['Invalid login credentials.'] } },
  });
  renderAt('/login', '/login', <LoginPage />);

  type('email', 'someone@example.com');
  type('password', 'wrong');
  fireEvent.click(screen.getByText('Login'));

  const message = await screen.findByText('Invalid login credentials.');
  expect(message).toHaveClass('bg-red-100');
  expect(screen.getByPlaceholderText('password')).toHaveValue('');
});

test('SignUpPage shows success in blue and the API errors in red', async () => {
  vi.mocked(AuthApi.signUp).mockResolvedValueOnce(response({ data: user }));
  renderAt('/signup?email=a@b.co', '/signup', <SignUpPage />);

  function fillIn() {
    type('first name', 'Ada');
    type('last name', 'Lovelace');
    type('password', 'correct horse');
    type('enter your password again', 'correct horse');
  }
  expect(screen.getByPlaceholderText('email')).toHaveValue('a@b.co');
  fillIn();
  fireEvent.click(screen.getByText('Sign Up'));

  const thanks = await screen.findByText(/thanks for signing up/i);
  expect(thanks).toHaveClass('bg-blue-100');
  expect(AuthApi.signUp).toHaveBeenCalledWith({
    email: 'a@b.co',
    password: 'correct horse',
    passwordConfirmation: 'correct horse',
    firstName: 'Ada',
    lastName: 'Lovelace',
  });
  // The fields are cleared either way.
  expect(screen.getByPlaceholderText('email')).toHaveValue('');

  vi.mocked(AuthApi.signUp).mockRejectedValueOnce({
    response: { data: { errors: { full_messages: ['Email is taken'] } } },
  });
  type('email', 'a@b.co');
  fillIn();
  fireEvent.click(screen.getByText('Sign Up'));

  expect(await screen.findByText('Email is taken')).toHaveClass('bg-red-100');
});

test('ForgotPasswordPage sends the typed email', async () => {
  vi.mocked(AuthApi.sendResetPasswordInstructions).mockResolvedValue(
    response(null)
  );
  renderAt('/forgot_password', '/forgot_password', <ForgotPasswordPage />);

  expect(
    screen.getByText('Send instructions').closest('button')
  ).toBeDisabled();
  type('Email address', 'someone@example.com');
  fireEvent.click(screen.getByText('Send instructions'));

  await screen.findByText(/you should receive an email soon/i);
  expect(AuthApi.sendResetPasswordInstructions).toHaveBeenCalledWith(
    'someone@example.com'
  );
});

test('ResetPasswordPage sends the link params with the new password', async () => {
  vi.mocked(AuthApi.resetPassword).mockResolvedValue(response(null));
  renderAt(
    '/reset_password?token=T&access-token=A&uid=U&client=C',
    '/reset_password',
    <ResetPasswordPage />
  );

  type('password', 'correct horse');
  type('enter your password again', 'correct horse');
  fireEvent.click(screen.getByText('Set password'));

  expect(await screen.findByTestId('location')).toHaveTextContent('/login');
  expect(AuthApi.resetPassword).toHaveBeenCalledWith({
    password: 'correct horse',
    passwordConfirmation: 'correct horse',
    token: 'T',
    'access-token': 'A',
    uid: 'U',
    client: 'C',
  });
});

test('ResetPasswordPage shows the API errors, or rejects a link without its params', async () => {
  vi.mocked(AuthApi.resetPassword).mockRejectedValue({
    response: { data: { errors: ['Link expired'] } },
  });
  const { unmount } = renderAt(
    '/reset_password?token=T&access-token=A&uid=U&client=C',
    '/reset_password',
    <ResetPasswordPage />
  );
  type('password', 'correct horse');
  type('enter your password again', 'correct horse');
  fireEvent.click(screen.getByText('Set password'));
  expect(await screen.findByText('Link expired')).toHaveClass('bg-red-100');
  unmount();

  renderAt(
    '/reset_password?token=T&uid=U&client=C',
    '/reset_password',
    <ResetPasswordPage />
  );
  expect(screen.getByText('Invalid reset password link')).toBeInTheDocument();
});

test('ClaimInvitationPage signs in with the claimed invitation', async () => {
  vi.mocked(InvitationApi.claimOne).mockResolvedValue(
    response({ team_id: 12 }, authHeaders)
  );
  const { store } = renderAt(
    '/invitations?token=INV',
    '/invitations',
    <ClaimInvitationPage />
  );

  expect(await screen.findByTestId('location')).toHaveTextContent(/^\/$/);
  expect(InvitationApi.claimOne).toHaveBeenCalledWith('INV');
  expect(store.getState().auth).toMatchObject({
    accessToken: 'TOKEN',
    teamId: 12,
  });
});

test('ClaimInvitationPage shows a 404 and sends a 400 to sign up', async () => {
  vi.mocked(InvitationApi.claimOne).mockRejectedValueOnce({
    response: { status: 404, data: { message: 'Invitation not found' } },
  });
  const { unmount } = renderAt(
    '/invitations?token=INV',
    '/invitations',
    <ClaimInvitationPage />
  );
  expect(await screen.findByText('Invitation not found')).toHaveClass(
    'bg-red-100'
  );
  unmount();

  vi.mocked(InvitationApi.claimOne).mockRejectedValueOnce({
    response: { status: 400, data: {} },
  });
  renderAt('/invitations?token=INV', '/invitations', <ClaimInvitationPage />);
  expect(await screen.findByTestId('location')).toHaveTextContent(
    '/invitations/signup?token=INV'
  );
});

test('InvitationSignUpPage signs up with the token and shows the API message', async () => {
  vi.mocked(InvitationApi.signUpThroughToken).mockRejectedValueOnce({
    response: { data: { message: 'Token expired' } },
  });
  renderAt(
    '/invitations/signup?token=INV',
    '/invitations/signup',
    <InvitationSignUpPage />
  );

  type('first name', 'Ada');
  type('last name', 'Lovelace');
  type('password', 'correct horse');
  type('enter your password again', 'correct horse');
  fireEvent.click(screen.getByText('Sign Up'));

  expect(await screen.findByText('Token expired')).toHaveClass('bg-red-100');
  expect(InvitationApi.signUpThroughToken).toHaveBeenCalledWith({
    token: 'INV',
    password: 'correct horse',
    passwordConfirmation: 'correct horse',
    firstName: 'Ada',
    lastName: 'Lovelace',
  });
});

test('JoinLinkPage joins the team and switches to it', async () => {
  vi.mocked(JoinLinkApi.getByJoinLinkCode).mockResolvedValue(response(team));
  vi.mocked(JoinLinkApi.join).mockResolvedValue(response(null));
  const { store } = renderAt('/join/abc', '/join/:code', <JoinLinkPage />, {
    auth: { currentUser: { id: 3, email: 'someone@example.com' } },
  });

  fireEvent.click(await screen.findByText('Join team'));

  expect(await screen.findByTestId('location')).toHaveTextContent(/^\/$/);
  expect(JoinLinkApi.getByJoinLinkCode).toHaveBeenCalledWith('abc');
  expect(JoinLinkApi.join).toHaveBeenCalledWith('abc');
  expect(localStorage.getItem('teamId')).toBe('12');
  expect(store.getState().auth.teamId).toBe(12);
});

test('JoinLinkPage shows the API message when the link fails', async () => {
  vi.mocked(JoinLinkApi.getByJoinLinkCode).mockRejectedValue({
    response: { data: 'Does not exist' },
  });
  renderAt('/join/abc', '/join/:code', <JoinLinkPage />);

  await screen.findByText(/unable to find a team with this link/i);
});

test('TeamLoginPage lists the teams to log in to', async () => {
  vi.mocked(TeamApi.getAll).mockResolvedValue(response([team]));
  renderAt('/login/teams', '/login/teams', <TeamLoginPage />);

  expect(await screen.findByText('Worship Team')).toBeInTheDocument();
});

test('useOneSignal switches teams and opens the chat from a notification', async () => {
  vi.mocked(TeamApi.getCurrentTeam).mockResolvedValue(
    response({
      team: { id: 7, name: 'Other Team' },
      subscription: { plan_name: 'Starter', is_pro: false },
      members: [],
    })
  );
  vi.mocked(UserApi.getTeamMembership).mockResolvedValue(
    response({ id: 1, user, role: { id: 2, name: 'Member' } })
  );
  function OneSignalUser() {
    useOneSignal();
    return null;
  }
  const { store, unmount } = renderAt('/', '/', <OneSignalUser />, {
    auth: { teamId: '12', currentUser: user },
    subscription: { subscription: { isPro: true } },
  });

  await vi.waitFor(() =>
    expect(OneSignal.addListenerForNotificationOpened).toHaveBeenCalled()
  );
  expect(OneSignal.init).toHaveBeenCalledTimes(1);
  expect(OneSignal.setExternalUserId).toHaveBeenCalledWith('UID-3');

  // Non-null: the hook passed a listener, checked above.
  const onOpened = vi.mocked(OneSignal.addListenerForNotificationOpened).mock
    .calls[0][0]!;
  await act(async () => {
    // `as`: the listener reads only `data` from the DOM Notification that
    // OneSignal passes, and jsdom has no Notification to construct.
    onOpened({
      data: { type: 'chat', team_id: 7, message_id: 99 },
    } as unknown as Notification);
  });

  expect(await screen.findByTestId('location')).toHaveTextContent(
    '/chat?messageId=99'
  );
  expect(localStorage.getItem('teamId')).toBe('7');
  const { auth, subscription } = store.getState();
  expect(auth.teamId).toBe(7);
  expect(auth.currentTeam?.name).toBe('Other Team');
  expect(auth.currentUser?.role?.name).toBe('Member');
  expect(subscription.subscription).toMatchObject({
    plan_name: 'Starter',
    isPro: false,
  });

  unmount();
  expect(OneSignal.removeExternalUserId).toHaveBeenCalled();
});
