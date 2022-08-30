import { useEffect, useState } from 'react';

import Alert from '../components/Alert';
import AuthApi from '../api/AuthApi';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import OutlinedInput from '../components/inputs/OutlinedInput';
import PasswordRequirements from '../components/PasswordRequirements';
import useQuery from '../hooks/useQuery';

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
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertColor, setAlertColor] = useState(null);

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

  const handlePasswordChange = passwordValue => {
    setPassword(passwordValue);

    setIsLongEnough(passwordValue.length >= MIN_PASSWORD_LENGTH);

    let { score } = window.zxcvbn(passwordValue);

    setIsUncommon(score >= 3);
  };

  const handleSignUp = async () => {
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
      setAlertMessage(error?.response?.data?.errors?.full_messages);
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
    <div className="flex w-screen h-screen">
      <div className="w-full max-w-xl px-3 m-auto lg:w-2/5 sm:w-3/4 md:w-3/5">
        <h1 className="mb-2 text-3xl font-bold text-center">
          Sign up for an account
        </h1>
        <div className="mb-4 text-center">
          Or
          <Link to="/login" className="ml-1 font-semibold text-blue-600">
            login here
          </Link>
        </div>
        <div className="py-2">
          <div className="flex mb-4">
            <div className="w-full pr-2">
              <div className="mb-2">First Name</div>
              <OutlinedInput
                placeholder="first name"
                onChange={setFirstName}
                value={firstName}
              />
            </div>
            <div className="w-full pl-2">
              <div className="mb-2">Last Name</div>
              <OutlinedInput
                placeholder="last name"
                onChange={setLastName}
                value={lastName}
              />
            </div>
          </div>
          <div className="mb-2">Email</div>
          <div className="mb-4">
            <OutlinedInput
              placeholder="email"
              type="email"
              onChange={setEmail}
              value={email}
            />
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

        <Button
          full
          disabled={!canSignUp()}
          loading={loading}
          onClick={handleSignUp}
          name="sign up"
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
}
