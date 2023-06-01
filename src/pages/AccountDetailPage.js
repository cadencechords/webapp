import BellIcon from '@heroicons/react/outline/BellIcon';
import CogIcon from '@heroicons/react/outline/CogIcon';
import { Link } from 'react-router-dom';
import MobileMenuButton from '../components/buttons/MobileMenuButton';
import ProfilePicture from '../components/ProfilePicture';
import Toggle from '../components/Toggle';
import UserCircleIcon from '@heroicons/react/outline/UserCircleIcon';
import PhotographIcon from '@heroicons/react/outline/PhotographIcon';
import { noop } from '../utils/constants';
import { selectCurrentUser } from '../store/authSlice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useTheme from '../hooks/useTheme';

export default function AccountDetailPage() {
  const currentUser = useSelector(selectCurrentUser);
  const { isDark, setIsDark } = useTheme();

  useEffect(() => {
    document.title = 'Account Details';
  }, []);

  if (!currentUser) return 'Loading...';

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <div className="text-gray-500 dark:text-dark-gray-200">
          <div className="w-24 m-auto my-2 flex-center">
            <ProfilePicture url={currentUser.image_url} />
          </div>
          <div className="mb-1 text-sm font-semibold text-center">
            {currentUser.email}
          </div>
          {currentUser.first_name && (
            <div className="mb-4 text-xl font-semibold text-center text-black dark:text-dark-gray-100">
              {currentUser.first_name} {currentUser.last_name}
            </div>
          )}
        </div>
        <Link to="/account/settings">
          <MobileMenuButton full className="border-b dark:border-dark-gray-600">
            <div className="flex items-center">
              <CogIcon className="w-5 h-5 mr-4" /> General
            </div>
          </MobileMenuButton>
        </Link>
        <Link to="/account/profile">
          <MobileMenuButton full className="border-b dark:border-dark-gray-600">
            <div className="flex items-center">
              <UserCircleIcon className="w-5 h-5 mr-4" /> Profile
            </div>
          </MobileMenuButton>
        </Link>
        <Link to="/account/notifications">
          <MobileMenuButton full className="border-b dark:border-dark-gray-600">
            <div className="flex items-center">
              <BellIcon className="w-5 h-5 mr-4" /> Notifications
            </div>
          </MobileMenuButton>
        </Link>
        <Link to="/account/appearance">
          <MobileMenuButton full className="border-b dark:border-dark-gray-600">
            <div className="flex items-center">
              <PhotographIcon className="w-5 h-5 mr-4" /> Appearance
            </div>
          </MobileMenuButton>
        </Link>

        <MobileMenuButton full onClick={() => setIsDark(!isDark)}>
          <div className="flex-between">
            Dark theme <Toggle enabled={isDark} onChange={noop} />
          </div>
        </MobileMenuButton>
      </div>
    </>
  );
}
