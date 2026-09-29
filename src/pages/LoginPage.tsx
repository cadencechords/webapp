import * as Sentry from '@sentry/react';

import { Link, useHistory } from 'react-router-dom';
import { useEffect, useState, type FormEvent } from 'react';

import AuthApi from '../api/AuthApi';
import Button from '../components/Button';
import AuthPage, { TEXT_LINK } from '../components/AuthPage';
import OutlinedInput from '../components/inputs/OutlinedInput';
import PasswordInput from '../components/inputs/PasswordInput';
import { setAuth, setCurrentUser } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import { useQuery } from './ClaimInvitationPage';
import UserApi from '../api/UserApi';
import type { AxiosError } from 'axios';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // Why the last sign in failed, shown under the password field.
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useHistory();
  const targetUrl = useQuery().get('target_url');
  const canLogin = email !== '' && password !== '';

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError(null);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setError(null);
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canLogin) return;
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
      // `as`: the request rejects with an axios error. Anything else thrown
      // here has no response, so this reads undefined.
      const errors = (error as LoginError)?.response?.data?.errors;
      setError(errors?.join(' ') || "Couldn't sign in. Please try again.");
      setLoading(false);
      setPassword('');
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
    <AuthPage
      title="Welcome back"
      description="Sign in to Mezzo to get to your songs and sets."
      footer={
        <>
          New here?
          <Link to="/signup" className={TEXT_LINK}>
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <OutlinedInput
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={handleEmailChange}
        />
        <PasswordInput
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={handlePasswordChange}
          error={error}
        />
        <Link to="/forgot_password" className={`${TEXT_LINK} self-end -mt-2`}>
          Forgot password?
        </Link>
        <Button
          full
          size="md"
          disabled={!canLogin}
          loading={loading}
          type="submit"
        >
          Sign in
        </Button>
      </form>
    </AuthPage>
  );
}
