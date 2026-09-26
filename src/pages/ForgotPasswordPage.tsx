import { useEffect, useState } from 'react';

import Alert from '../components/Alert';
import AuthApi from '../api/AuthApi';
import Button from '../components/Button';
import CenteredPage from '../components/CenteredPage';
import OutlinedInput from '../components/inputs/OutlinedInput';
import PageTitle from '../components/PageTitle';
import { reportError } from '../utils/error';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    document.title = 'Forgot Password';
  }, []);

  const handleSendInstructions = async () => {
    try {
      setSending(true);
      // Non-null: the button is disabled, and Enter does nothing, until an
      // email is typed.
      await AuthApi.sendResetPasswordInstructions(email!);
      setShowSuccess(true);
    } catch (error) {
      reportError(error);
    } finally {
      setSending(false);
    }
  };

  const handleEnterPressed = () => {
    if (email) {
      handleSendInstructions();
    }
  };

  return (
    <CenteredPage>
      <PageTitle title="Reset Password" align="center" />
      <div className="mb-6 text-lg font-semibold text-gray-600 dark:text-dark-gray-200">
        Enter the email address you used to register with Mezzo. If the email
        matches an account in Mezzo, we&apos;ll send you instructions to reset
        your password.
      </div>
      <OutlinedInput
        className="mb-6"
        onChange={setEmail}
        placeholder="Email address"
        onEnter={handleEnterPressed}
        value={email}
      />
      {showSuccess && (
        <Alert className="mb-6">
          If you have an account with Mezzo, you should receive an email soon!
        </Alert>
      )}
      <Button
        full
        disabled={!email}
        loading={sending}
        onClick={handleSendInstructions}
      >
        Send instructions
      </Button>
    </CenteredPage>
  );
}
