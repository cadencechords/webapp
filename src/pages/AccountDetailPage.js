import BellIcon from '@heroicons/react/outline/BellIcon';
import CogIcon from '@heroicons/react/outline/CogIcon';
import { Link } from 'react-router-dom';
import MobileMenuButton from '../components/buttons/MobileMenuButton';
import ProfilePicture from '../components/ProfilePicture';
import Toggle from '../components/Toggle';
import UserCircleIcon from '@heroicons/react/outline/UserCircleIcon';
import { noop } from '../utils/constants';
import { selectCurrentUser } from '../store/authSlice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useState } from 'react';

export default function AccountDetailPage() {
  const currentUser = useSelector(selectCurrentUser);
  const [isDark, setIsDark] = useState(() => {
    let theme = localStorage.getItem('theme');

    return theme === 'dark';
  });
  useEffect(() => {
    document.title = 'Account Details';
  }, []);

  function handleToggleDarkTheme() {
    setIsDark(currentValue => {
      let updatedValue = !currentValue;

      if (updatedValue) {
        document.querySelector('html').classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.querySelector('html').classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }

      return updatedValue;
    });
  }

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

        <MobileMenuButton full onClick={handleToggleDarkTheme}>
          <div className="flex-between">
            Dark theme <Toggle enabled={isDark} onChange={noop} />
          </div>
        </MobileMenuButton>
      </div>
    </>
  );
}
