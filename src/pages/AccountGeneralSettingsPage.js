import ArrowNarrowLeftIcon from '@heroicons/react/outline/ArrowNarrowLeftIcon';
import Button from '../components/Button';
import Integrations from '../components/Integrations';
import { Link } from 'react-router-dom';
import ProfilePicture from '../components/ProfilePicture';
import SignOutOptions from '../components/SignOutOptions';
import { selectCurrentUser } from '../store/authSlice';
import { useSelector } from 'react-redux';

export default function AccountGeneralSettingsPage() {
  const currentUser = useSelector(selectCurrentUser);
  if (!currentUser) return 'Loading...';
  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/account">
        <Button variant="open" color="gray">
          <div className="flex-center">
            <ArrowNarrowLeftIcon className="w-4 h-4 mr-4" />
            Menu
          </div>
        </Button>
      </Link>
      <div className="text-gray-500">
        <div className="w-24 m-auto my-2 flex-center">
          <ProfilePicture url={currentUser.image_url} />
        </div>
        <div className="mb-1 text-sm font-semibold text-center">
          {currentUser.email}
        </div>
        {currentUser.first_name ? (
          <div className="text-xl font-semibold text-center text-black dark:text-dark-gray-100">
            {currentUser.first_name} {currentUser.last_name}
          </div>
        ) : (
          <div className="text-center">
            You haven't provided your name yet. You can do that
            <Link to="/account/profile"> here</Link>
          </div>
        )}
      </div>

      <Integrations currentUser={currentUser} />
      <SignOutOptions />
    </div>
  );
}
