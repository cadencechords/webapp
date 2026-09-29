import { useEffect, useState, type FormEvent } from 'react';

import Alert from '../components/Alert';
import AuthApi from '../api/AuthApi';
import AuthPage, { FILLED_LINK, TEXT_LINK } from '../components/AuthPage';
import Button from '../components/Button';
import PasswordInput from '../components/inputs/PasswordInput';
import PasswordRequirements from '../components/PasswordRequirements';
import { Link, useHistory } from 'react-router-dom';
import { useQuery } from './ClaimInvitationPage';
import type { AxiosError } from 'axios';

/**
 * A failed reset, as axios rejects it. devise_token_auth says why in
 * `errors`.
 */
type ResetPasswordError = AxiosError<{ errors?: string[] }> | undefined;

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isLongEnough, setIsLongEnough] = useState(false);
  const [isUncommon, setIsUncommon] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string[] | null | undefined>(
    null
  );
  const [loading, setLoading] = useState(false);
  const router = useHistory();

  const MIN_PASSWORD_LENGTH = 8;

  const authConfig = {
    token: useQuery().get('token'),
    'access-token': useQuery().get('access-token'),
    uid: useQuery().get('uid'),
    client: useQuery().get('client'),
  };

  // Only once they've started confirming, so the field isn't red up front.
  const passwordsDiffer =
    passwordConfirmation !== '' && passwordConfirmation !== password;

  const canReset =
    isUncommon &&
    isLongEnough &&
    hasAuthConfig() &&
    password === passwordConfirmation;

  useEffect(() => {
    document.title = 'Reset Password';
    const script = document.createElement('script');

    script.src = import.meta.env.REACT_APP_URL + '/scripts/passwords.js';
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePasswordChange = (passwordValue: string) => {
    setPassword(passwordValue);

    setIsLongEnough(passwordValue.length >= MIN_PASSWORD_LENGTH);

    const { score } = window.zxcvbn(passwordValue);

    setIsUncommon(score >= 3);
  };

  const handleReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canReset) return;
    try {
      setLoading(true);
      await AuthApi.resetPassword({
        password,
        passwordConfirmation,
        // `as`: canReset checked that hasAuthConfig() found every param in
        // the link.
        ...(authConfig as { [K in keyof typeof authConfig]: string }),
      });
      router.push('/login');
    } catch (error) {
      // `as`: the request rejects with an axios error. Anything else thrown
      // here has no response, so this reads undefined, as before.
      setAlertMessage((error as ResetPasswordError)?.response?.data?.errors);
      setLoading(false);
    }
  };

  function hasAuthConfig() {
    return (
      authConfig &&
      authConfig['access-token'] &&
      authConfig.client &&
      authConfig.token &&
      authConfig.uid
    );
  }

  const signInFooter = (
    <>
      Remembered it?
      <Link to="/login" className={TEXT_LINK}>
        Sign in
      </Link>
    </>
  );

  if (!hasAuthConfig()) {
    return (
      <AuthPage
        title="This link doesn't work"
        description="Invalid reset password link. It may be missing part of its address. Ask for a new one and use the link in that email."
        footer={signInFooter}
      >
        <Link to="/forgot_password" className={FILLED_LINK}>
          Send a new link
        </Link>
      </AuthPage>
    );
  }

  return (
    <AuthPage
      title="Choose a new password"
      description="You'll use it to sign in to Mezzo from now on."
      footer={signInFooter}
    >
      <form onSubmit={handleReset} className="flex flex-col gap-4">
        <PasswordInput
          label="New password"
          autoComplete="new-password"
          value={password}
          onChange={handlePasswordChange}
        />
        {/* Tucked under the field, like its supporting text. */}
        <div className="-mt-2">
          <PasswordRequirements
            isUncommon={isUncommon}
            isLongEnough={isLongEnough}
          />
        </div>
        <PasswordInput
          label="Confirm password"
          autoComplete="new-password"
          value={passwordConfirmation}
          onChange={setPasswordConfirmation}
          error={passwordsDiffer ? "Passwords don't match" : undefined}
        />
        {alertMessage && (
          <Alert
            color="red"
            dismissable
            onDismiss={() => setAlertMessage(null)}
          >
            {alertMessage}
          </Alert>
        )}
        <Button
          full
          size="md"
          disabled={!canReset}
          loading={loading}
          type="submit"
          className="mt-2"
        >
          Set password
        </Button>
      </form>
    </AuthPage>
  );
}
