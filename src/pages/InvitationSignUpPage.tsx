import { setAuth, setTeamId } from '../store/authSlice';
import { useEffect, useState } from 'react';

import Alert from '../components/Alert';
import Button from '../components/Button';
import CenteredPage from '../components/CenteredPage';
import InvitationApi from '../api/InvitationApi';
import OutlinedInput from '../components/inputs/OutlinedInput';
import PasswordRequirements from '../components/PasswordRequirements';
import { useDispatch } from 'react-redux';
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

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const result = await InvitationApi.signUpThroughToken({
        // Non-null: the button is disabled without a token (canSignUp).
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

  if (token) {
    return (
      <CenteredPage>
        <h1 className="mb-8 text-3xl font-bold text-center">
          You&apos;re almost there! <br /> Create a password for your new
          account
        </h1>

        <div className="flex items-center mb-4">
          <div className="w-full pr-2">
            <div className="mb-2">First name</div>
            <OutlinedInput
              value={firstName}
              onChange={setFirstName}
              placeholder="first name"
            />
          </div>
          <div className="w-full pl-2">
            <div className="mb-2">Last name</div>
            <OutlinedInput
              value={lastName}
              onChange={setLastName}
              placeholder="last name"
            />
          </div>
        </div>
        <div className="mb-2">Password</div>
        <div className="mb-4">
          <OutlinedInput
            value={password}
            placeholder="password"
            type="password"
            onFocus={() => setIsPasswordFocused(true)}
            onChange={handlePasswordChange}
          />

          {isPasswordFocused && (
            <div className="mt-4">
              <PasswordRequirements
                isUncommon={isUncommon}
                isLongEnough={isLongEnough}
              />
            </div>
          )}
        </div>

        <div className="mb-2">Confirm Password</div>
        <div className="mb-4">
          <OutlinedInput
            value={passwordConfirmation}
            placeholder="enter your password again"
            type="password"
            onChange={setPasswordConfirmation}
          />
        </div>

        {alertMessage && (
          <div className="mb-6">
            <Alert
              color="red"
              dismissable
              onDismiss={() => setAlertMessage(null)}
            >
              {alertMessage}
            </Alert>
          </div>
        )}

        <Button
          full
          disabled={!canSignUp}
          loading={loading}
          onClick={handleSignUp}
        >
          Sign Up
        </Button>
      </CenteredPage>
    );
  } else {
    return (
      <CenteredPage>
        <Alert color="red">Invalid invitation</Alert>
      </CenteredPage>
    );
  }
}
