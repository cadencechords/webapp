import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import Alert from '../components/Alert';
import AuthApi from '../api/AuthApi';
import AuthPage, { TEXT_LINK } from '../components/AuthPage';
import Button from '../components/Button';
import OutlinedInput from '../components/inputs/OutlinedInput';
import { reportError } from '../utils/error';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    document.title = 'Forgot Password';
  }, []);

  const handleSendInstructions = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    try {
      setSending(true);
      await AuthApi.sendResetPasswordInstructions(email);
      setShowSuccess(true);
    } catch (error) {
      reportError(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <AuthPage
      title="Forgot your password?"
      description="Enter the email you signed up with. If it matches a Mezzo account, we'll send you a link to reset your password."
      footer={
        <>
          Remembered it?
          <Link to="/login" className={TEXT_LINK}>
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSendInstructions} className="flex flex-col gap-4">
        <OutlinedInput
          label="Email"
          type="email"
          autoComplete="email"
          onChange={setEmail}
          value={email}
        />
        {showSuccess && (
          <Alert>
            If you have an account with Mezzo, you should receive an email soon!
          </Alert>
        )}
        <Button
          full
          size="md"
          disabled={!email}
          loading={sending}
          type="submit"
          className="mt-2"
        >
          Send instructions
        </Button>
      </form>
    </AuthPage>
  );
}
