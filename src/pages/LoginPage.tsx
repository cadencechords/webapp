import * as Sentry from '@sentry/react';

import { Link, useHistory } from 'react-router-dom';
import {
  useEffect,
  useState,
  type ComponentProps,
  type FormEvent,
} from 'react';

import Alert from '../components/Alert';
import AuthApi from '../api/AuthApi';
import Button from '../components/Button';
import { setAuth, setCurrentUser } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import { useQuery } from './ClaimInvitationPage';
import UserApi from '../api/UserApi';
import classNames from 'classnames';
import type { AxiosError } from 'axios';

type AlertColor = NonNullable<ComponentProps<typeof Alert>['color']>;

/**
 * A failed sign in, as axios rejects it. devise_token_auth says why in
 * `errors`, e.g. ['Invalid login credentials. Please try again.'].
 */
type LoginError = AxiosError<{ errors?: string[] }> | undefined;

/** The headers devise_token_auth signs in with. */
type AuthHeaders = { 'access-token': string; client: string; uid: string };

export default function LoginPage() {
  useEffect(() => {
    document.title = 'Login';
  });
  const [canLogin, setCanLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string[] | null | undefined>(
    null
  );
  const [alertColor, setAlertColor] = useState<AlertColor | null>(null);
  const dispatch = useDispatch();
  const router = useHistory();
  const targetUrl = useQuery().get('target_url');
  const [focusedElement, setFocusedElement] = useState('email');

  const handlePasswordChange = (passwordValue: string) => {
    setPassword(passwordValue);
    setCanLogin(passwordValue !== '' && email !== '');
  };

  const handleEmailChange = (emailValue: string) => {
    setEmail(emailValue);
    setCanLogin(emailValue !== '' && password !== '');
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await AuthApi.login(email, password);
      const headers = result.headers;

      setAuthInLocalStorage(headers);
      Sentry.setUser({ email });

      const currentUserResult = await UserApi.getCurrentUser();
      dispatch(setCurrentUser(currentUserResult.data));

      const nextUrl = targetUrl || '/login/teams';
      router.push(nextUrl);
    } catch (error) {
      setAlertColor('red');
      // `as`: the request rejects with an axios error. Anything else thrown
      // here has no response, so this reads undefined, as before.
      setAlertMessage((error as LoginError)?.response?.data?.errors);
      setLoading(false);
      setPassword('');
      setCanLogin(false);
    }
  };

  const setAuthInLocalStorage = (headers: AuthHeaders) => {
    const accessToken = headers['access-token'];
    const client = headers['client'];
    const uid = headers['uid'];

    dispatch(setAuth({ accessToken, client, uid }));

    localStorage.setItem('access-token', headers['access-token']);
    localStorage.setItem('uid', headers['uid']);
    localStorage.setItem('client', headers['client']);
  };

  return (
    <div className="flex w-screen h-screen">
      <div className="w-full max-w-xl px-3 m-auto">
        <h1 className="mb-1 text-3xl font-bold text-center">
          Login to your account
        </h1>
        <div className="mb-4 text-center">
          Or
          <Link
            to="/signup"
            className="ml-1 font-semibold text-blue-600 dark:text-dark-blue"
            aria-label="sign up"
          >
            sign up for one!
          </Link>
        </div>
        <form onSubmit={handleLogin}>
          <div className="relative pt-5 pb-3">
            <input
              className={classNames(
                focusedElement === 'email' ? 'z-10' : 'border-b-0',
                'relative w-full px-4 py-3 border border-gray-300 rounded-b-none outline-hidden appearance-none rounded-t-xl dark:border-dark-gray-400 focus:outline-hidden focus:ring-2 ring-offset-1 ring-blue-400 dark:bg-dark-gray-700'
              )}
              placeholder="email"
              type="email"
              autoComplete="off"
              autoCapitalize="off"
              onChange={e => handleEmailChange(e.target.value)}
              value={email}
              onFocus={() => setFocusedElement('email')}
            />

            <input
              className={classNames(
                focusedElement === 'password' ? 'z-10' : 'border-t-0',
                'relative w-full px-4 py-3 border border-gray-300 rounded-t-none shadow-xs outline-hidden appearance-none rounded-b-xl focus:outline-hidden dark:border-dark-gray-400 focus:ring-2 ring-offset-1 ring-blue-400 dark:bg-dark-gray-700'
              )}
              placeholder="password"
              type="password"
              autoComplete="off"
              autoCapitalize="off"
              onChange={e => handlePasswordChange(e.target.value)}
              value={password}
              onFocus={() => setFocusedElement('password')}
            />
          </div>
          <div className="mb-4 font-semibold text-right text-blue-600 dark:text-dark-blue">
            <Link to="/forgot_password">Forgot password?</Link>
          </div>
          {alertMessage && (
            <div className="mb-6">
              <Alert
                // Non-null: the color is set with the message (handleLogin).
                color={alertColor!}
                dismissable
                onDismiss={() => setAlertMessage(null)}
              >
                {alertMessage}
              </Alert>
            </div>
          )}
          <div className="my-3">
            <Button
              full
              bold
              disabled={!canLogin}
              loading={loading}
              type="submit"
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
