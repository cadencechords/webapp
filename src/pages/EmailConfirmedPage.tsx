import Button from '../components/Button';
import CenteredPage from '../components/CenteredPage';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function EmailConfirmationSuccess() {
  useEffect(() => {
    document.title = 'Email confirmed';
  }, []);

  return (
    <CenteredPage>
      <div className="bg-gray-100 dark:bg-dark-gray-800 rounded-md p-4 max-w-md w-4/5 mx-auto">
        Thanks for confirming your email! You can login to your account now.
        <Link to="/login" className="flex-center mt-6">
          <Button full name="login">
            Login
          </Button>
        </Link>
      </div>
    </CenteredPage>
  );
}
