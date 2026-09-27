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
  // Non-null: Content renders the Navbar only once the membership loads.
  const currentMember = useSelector(selectCurrentMember)!;
  const showUpgradeButton =
    currentMember.can(MANAGE_BILLING) && subscription?.plan_name === 'Starter';

  return (
    // On the rail's surface with no border, so rail and header read as one
    // frame. The page below is the sheet inside it: a 28dp (extra-large)
    // concave corner where rail and header meet rounds it, and the header is
    // sticky so the corner stays put while the page scrolls under it. The
    // ::before reaches a screen above it, so an overscroll bounce at the top
    // shows more header rather than the white page behind it.
    <nav className="sticky top-0 z-25 items-center justify-between hidden h-16 px-4 md:flex md:ml-24 lg:ml-[220px] bg-surface-container before:absolute before:inset-x-0 before:bottom-full before:h-screen before:bg-surface-container">
      <span
        aria-hidden="true"
        className="absolute left-0 w-7 h-7 pointer-events-none top-full bg-[radial-gradient(circle_at_100%_100%,transparent_27.5px,var(--md-sys-color-surface-container)_28px)]"
      />
      <SearchBar />
      <span className="flex-center">
        {showUpgradeButton && (
          <Button
            color="purple"
            className="w-24 mr-8"
            onClick={() => createCustomerPortalSession()}
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
