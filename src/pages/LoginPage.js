import * as Sentry from '@sentry/react';

import { Link, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Alert from '../components/Alert';
import AuthApi from '../api/AuthApi';
import Button from '../components/Button';
import { setAuth, setCurrentUser } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import { useQuery } from './ClaimInvitationPage';
import UserApi from '../api/UserApi';

export default function LoginPage() {
  useEffect(() => (document.title = 'Login'));
  const [canLogin, setCanLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertColor, setAlertColor] = useState(null);
  const dispatch = useDispatch();
  const router = useHistory();
  const targetUrl = useQuery().get('target_url');

  const handlePasswordChange = passwordValue => {
    setPassword(passwordValue);
    setCanLogin(passwordValue !== '' && email !== '');
  };

  const handleEmailChange = emailValue => {
    setEmail(emailValue);
    setCanLogin(emailValue !== '' && password !== '');
  };

  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      let result = await AuthApi.login(email, password);
      let headers = result.headers;

      setAuthInLocalStorage(headers);
      Sentry.setUser({ email });

      let currentUserResult = await UserApi.getCurrentUser();
      dispatch(setCurrentUser(currentUserResult.data));

      let nextUrl = targetUrl || '/login/teams';
      router.push(nextUrl);
    } catch (error) {
      setAlertColor('red');
      setAlertMessage(error?.response?.data?.errors);
      setLoading(false);
      setPassword('');
      setCanLogin(false);
    }
  };

  const setAuthInLocalStorage = headers => {
    let accessToken = headers['access-token'];
    let client = headers['client'];
    let uid = headers['uid'];

    dispatch(setAuth({ accessToken, client, uid }));

    localStorage.setItem('access-token', headers['access-token']);
    localStorage.setItem('uid', headers['uid']);
    localStorage.setItem('client', headers['client']);
  };

  return (
    <div className="flex w-screen h-screen">
      <div className="w-full max-w-xl px-3 m-auto lg:w-2/5 sm:w-3/4 md:w-3/5">
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
          <div className="pt-5 pb-3">
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-b-none outline-none appearance-none rounded-t-xl dark:border-dark-gray-400 focus:outline-none focus:ring-inset focus:ring-2 focus:ring-blue-400 dark:bg-dark-gray-700"
              placeholder="email"
              type="email"
              autoComplete="off"
              autoCapitalize="off"
              onChange={e => handleEmailChange(e.target.value)}
              value={email}
            />

            <input
              className="w-full px-3 py-2 border border-t-0 border-gray-300 rounded-t-none shadow-sm outline-none appearance-none rounded-b-xl focus:outline-none dark:border-dark-gray-400 focus:ring-inset focus:ring-2 focus:ring-blue-400 dark:bg-dark-gray-700"
              placeholder="password"
              type="password"
              autoComplete="off"
              autoCapitalize="off"
              onChange={e => handlePasswordChange(e.target.value)}
              value={password}
            />
          </div>
          <div className="mb-4 font-semibold text-right text-blue-600 dark:text-dark-blue">
            <Link to="/forgot_password">Forgot password?</Link>
          </div>
          {alertMessage && (
            <div className="mb-6">
              <Alert
                color={alertColor}
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
