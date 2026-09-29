import { MANAGE_BILLING, VIEW_EVENTS, VIEW_ROLES } from '../utils/constants';
import { selectCurrentMember } from '../store/authSlice';

import BinderIcon from '../icons/BinderIcon';
import NavigationRailItem, { pulse } from './NavigationRailItem';
import { selectCurrentSubscription } from '../store/subscriptionSlice';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import Button from './Button';
import FeedbackPopover from './FeedbackPopover';
import TeamAccountMenu from './TeamAccountMenu';
import useSubscription from '../hooks/api/useSubscription';
import useCreateCustomerPortalSession from '../hooks/api/useCreateCustomerProtalSession';

const iconClasses = 'h-6 w-6';

// The M3E navigation rail: collapsed (96dp, label under the icon) at md and
// expanded (220dp, icon and label on one row) at lg, on the page's own color.
// Content is offset by the same widths (md:ml-24 lg:ml-[220px]). The team
// and account (one menu) are at the top; upgrade and feedback at the foot.
// In a short window the rail scrolls; its menus are fixed-position popovers,
// so the scroller doesn't clip them.
export default function NavigationRail() {
  // Non-null: Content renders the rail only once the membership loads.
  const currentMember = useSelector(selectCurrentMember)!;
  const currentSubscription = useSelector(selectCurrentSubscription);
  const { data: subscription } = useSubscription();
  const { isLoading: isCreatingSession, run: createCustomerPortalSession } =
    useCreateCustomerPortalSession();
  const showUpgradeButton =
    currentMember.can(MANAGE_BILLING) && subscription?.plan_name === 'Starter';

  return (
    <nav
      aria-label="Main"
      className="fixed inset-y-0 left-0 z-25 hidden w-24 md:flex flex-col overflow-y-auto [scrollbar-width:thin] lg:w-[220px]"
    >
      <div className="pt-4">
        <TeamAccountMenu />
      </div>
      {/* Search is the rail's FAB: a 56dp square collapsed, an extended FAB
          with its label expanded. Extended, it's 16dp before the icon and
          22dp after the label (M3's extended FAB has 20): the icon's glyph is inset
          in its box, so equal padding looks tighter at the end. */}
      <div className="flex justify-center pt-3 pb-2 lg:justify-start lg:px-3">
        <Link
          to="/search"
          aria-label="Search"
          onClick={event => pulse(event.currentTarget)}
          className="flex-center gap-3 w-14 h-14 rounded-large bg-secondary-container text-on-secondary-container state-layer focus-ring lg:w-fit lg:pl-4 lg:pr-5.5"
        >
          <Icon name="search" className={iconClasses} />
          <span className="hidden lg:inline font-plain text-label-large">
            Search
          </span>
        </Link>
      </div>
      <div className="flex flex-col gap-1 py-3 lg:gap-0 lg:px-3">
        <NavigationRailItem
          text="Dashboard"
          to="/"
          icon={<Icon name="dashboard" filled className={iconClasses} />}
          exact
        />
        <NavigationRailItem
          text="Songs"
          to="/songs"
          icon={<Icon name="music_note" filled className={iconClasses} />}
        />
        <NavigationRailItem
          text="Sets"
          to="/sets"
          icon={<Icon name="queue_music" filled className={iconClasses} />}
        />
        <NavigationRailItem
          text="Folders"
          to="/folders"
          icon={<BinderIcon className={iconClasses} />}
        />
        <NavigationRailItem
          text="Team members"
          to="/members"
          icon={<Icon name="person" filled className={iconClasses} />}
        />
        {currentSubscription?.isPro && currentMember?.can(VIEW_EVENTS) && (
          <NavigationRailItem
            text="Calendar"
            to="/calendar"
            icon={<Icon name="calendar_month" filled className={iconClasses} />}
          />
        )}
        {/* {currentSubscription?.isPro && (
          <NavigationRailItem
            text="Chat"
            to="/chat"
            icon={<Icon name="chat" className={iconClasses} />}
          />
        )} */}
        {currentMember.can(VIEW_ROLES) && (
          <>
            <hr className="mx-3 my-3 border-outline-variant lg:mx-4" />
            <NavigationRailItem
              to="/permissions"
              text="Permissions"
              icon={<Icon name="lock" filled className={iconClasses} />}
            />
          </>
        )}
        {currentMember.can(MANAGE_BILLING) && (
          <NavigationRailItem
            to="/billing"
            text="Billing"
            icon={<Icon name="credit_card" filled className={iconClasses} />}
          />
        )}
      </div>
      <div className="flex flex-col pb-3 mt-auto">
        {showUpgradeButton && (
          <div className="px-3 pb-2">
            <Button
              color="purple"
              className="w-full"
              onClick={() => createCustomerPortalSession()}
              loading={isCreatingSession}
            >
              Upgrade
            </Button>
          </div>
        )}
        <FeedbackPopover />
      </div>
    </nav>
  );
}
