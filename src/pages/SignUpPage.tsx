import {
  useEffect,
  useState,
  type ComponentProps,
  type FormEvent,
} from 'react';

import Alert from '../components/Alert';
import AuthApi from '../api/AuthApi';
import AuthPage, { TEXT_LINK } from '../components/AuthPage';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import OutlinedInput from '../components/inputs/OutlinedInput';
import PasswordInput from '../components/inputs/PasswordInput';
import PasswordRequirements from '../components/PasswordRequirements';
import useQuery from '../hooks/useQuery';
import type { AxiosError } from 'axios';

type AlertColor = NonNullable<ComponentProps<typeof Alert>['color']>;

/**
 * A failed sign up, as axios rejects it. devise_token_auth lists why in
 * `errors.full_messages`.
 */
type SignUpError =
  | AxiosError<{ errors?: { full_messages?: string[] } }>
  | undefined;

export default function SignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [email, setEmail] = useState(useQuery().get('email') || '');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isLongEnough, setIsLongEnough] = useState(false);
  const [isUncommon, setIsUncommon] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<
    string | string[] | null | undefined
  >(null);
  const [alertColor, setAlertColor] = useState<AlertColor | null>(null);

  const MIN_PASSWORD_LENGTH = 8;

  useEffect(() => {
    document.title = 'Sign Up';
    const script = document.createElement('script');

    const protocol = window.location.hostname?.includes('localhost')
      ? 'http'
      : 'https';
    script.src = `${protocol}://${window.location.hostname}:${window.location.port}/scripts/passwords.js`;
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
    if (!canSignUp()) return;
    setLoading(true);

    try {
      await AuthApi.signUp({
        email,
        password,
        passwordConfirmation,
        firstName,
        lastName,
      });
      setAlertColor('blue');
      setAlertMessage(
        'Thanks for signing up! Check your email for further instructions.'
      );
    } catch (error) {
      setAlertColor('red');
      // `as`: the request rejects with an axios error. Anything else thrown
      // here has no response, so this reads undefined, as before.
      setAlertMessage(
        (error as SignUpError)?.response?.data?.errors?.full_messages
      );
    } finally {
      setLoading(false);
      clearFields();
    }
  };

  const clearFields = () => {
    setEmail('');
    setPassword('');
    setPasswordConfirmation('');
    setIsPasswordFocused(false);
    setIsLongEnough(false);
    setFirstName('');
    setLastName('');
    setIsUncommon(false);
  };

  // Only once they've started confirming, so the field isn't red up front.
  const passwordsDiffer =
    passwordConfirmation !== '' && passwordConfirmation !== password;

  const canSignUp = () => {
    return (
      passwordConfirmation === password &&
      isUncommon &&
      isLongEnough &&
      email &&
      firstName &&
      lastName
    );
  };

  return (
    <AuthPage
      title="Create your account"
      description="Join Mezzo to keep your team's songs and sets in one place."
      footer={
        <>
          Already have an account?
          <Link to="/login" className={TEXT_LINK}>
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSignUp} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <OutlinedInput
            label="First name"
            autoComplete="given-name"
            onChange={setFirstName}
            value={firstName}
          />
          <OutlinedInput
            label="Last name"
            autoComplete="family-name"
            onChange={setLastName}
            value={lastName}
          />
        </div>
        <OutlinedInput
          label="Email"
          type="email"
          autoComplete="email"
          onChange={setEmail}
          value={email}
        />
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
            // Non-null: the color is set with the message (handleSignUp).
            color={alertColor!}
            dismissable
            onDismiss={() => setAlertMessage(null)}
          >
            {alertMessage}
          </Alert>
        )}
        <Button
          full
          size="md"
          disabled={!canSignUp()}
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
