import { useSelector } from 'react-redux';
import useCreateCustomerPortalSession from '../hooks/api/useCreateCustomerProtalSession';
import useSubscription from '../hooks/api/useSubscription';
import { selectCurrentMember } from '../store/authSlice';
import AccountOptionsPopover from './AccountOptionsPopover';
import Button from './Button';
import FeedbackPopover from './FeedbackPopover';
import SearchBar from './SearchBar';
import { MANAGE_BILLING } from '../utils/constants';

export default function Navbar() {
  const { data: subscription } = useSubscription();
  const { isLoading: isCreatingSession, run: createCustomerPortalSession } =
    useCreateCustomerPortalSession();
  const currentMember = useSelector(selectCurrentMember);
  const showUpgradeButton =
    currentMember.can(MANAGE_BILLING) && subscription?.plan_name === 'Starter';

  return (
    <nav className="items-center justify-between hidden h-16 px-4 border-b md:flex md:ml-14 lg:ml-56 dark:border-dark-gray-700">
      <SearchBar />
      <span className="flex-center">
        {showUpgradeButton && (
          <Button
            color="purple"
            className="w-24 mr-8"
            onClick={createCustomerPortalSession}
            loading={isCreatingSession}
          >
            Upgrade
          </Button>
        )}
        <FeedbackPopover />
        <AccountOptionsPopover />
      </span>
    </nav>
  );
}
