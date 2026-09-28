import { setAuth, setTeamId } from '../store/authSlice';
import { useEffect, useState, type FormEvent } from 'react';

import Alert from '../components/Alert';
import AuthPage, { TEXT_LINK } from '../components/AuthPage';
import Button from '../components/Button';
import InvitationApi from '../api/InvitationApi';
import OutlinedInput from '../components/inputs/OutlinedInput';
import PasswordInput from '../components/inputs/PasswordInput';
import PasswordRequirements from '../components/PasswordRequirements';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useQuery } from './ClaimInvitationPage';
import type { AxiosError } from 'axios';

/** A failed sign up, as axios rejects it. The API says why in `message`. */
type SignUpError = AxiosError<{ message?: string }> | undefined;

export default function InvitationSignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLongEnough, setIsLongEnough] = useState(false);
  const [isUncommon, setIsUncommon] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null | undefined>(
    null
  );
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useHistory();

  const MIN_PASSWORD_LENGTH = 8;
  const token = useQuery().get('token');

  // Only once they've started confirming, so the field isn't red up front.
  const passwordsDiffer =
    passwordConfirmation !== '' && passwordConfirmation !== password;

  const canSignUp =
    isUncommon &&
    isLongEnough &&
    token &&
    password === passwordConfirmation &&
    firstName &&
    lastName;

  useEffect(() => {
    document.title = 'Sign Up';
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

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSignUp) return;
    setLoading(true);
    try {
      const result = await InvitationApi.signUpThroughToken({
        // Non-null: canSignUp checked there's a token.
        token: token!,
        password,
        passwordConfirmation,
        firstName,
        lastName,
      });
      const accessToken = result.headers['access-token'];
      const client = result.headers['client'];
      const uid = result.headers['uid'];
      dispatch(setAuth({ accessToken, client, uid }));
      dispatch(setTeamId(result.data.team_id));

      router.push('/');
    } catch (error) {
      // `as`: the request rejects with an axios error. Anything else thrown
      // here has no response, so this reads undefined, as before.
      setAlertMessage((error as SignUpError)?.response?.data?.message);
      setLoading(false);
    }
  };

  const signInFooter = (
    <>
      Already have an account?
      <Link to="/login" className={TEXT_LINK}>
        Sign in
      </Link>
    </>
  );

  if (!token) {
    return (
      <AuthPage
        title="This invitation doesn't work"
        description="Invalid invitation link. Ask whoever invited you to send a new one."
        footer={signInFooter}
      />
    );
  }

  return (
    <AuthPage
      title="You're almost there"
      description="Add your name and choose a password to finish setting up your Mezzo account."
      footer={signInFooter}
    >
      <form onSubmit={handleSignUp} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <OutlinedInput
            label="First name"
            autoComplete="given-name"
            value={firstName}
            onChange={setFirstName}
          />
          <OutlinedInput
            label="Last name"
            autoComplete="family-name"
            value={lastName}
            onChange={setLastName}
          />
        </div>
        <PasswordInput
          label="Password"
          autoComplete="new-password"
          value={password}
          onFocus={() => setIsPasswordFocused(true)}
          onChange={handlePasswordChange}
        />
        {isPasswordFocused && (
          // Tucked under the field, like its supporting text.
          <div className="-mt-2">
            <PasswordRequirements
              isUncommon={isUncommon}
              isLongEnough={isLongEnough}
            />
          </div>
        )}
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
          disabled={!canSignUp}
          loading={loading}
          type="submit"
          className="mt-2"
        >
          Create account
        </Button>
      </form>
    </AuthPage>
  );
}
