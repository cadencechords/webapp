import { MANAGE_BILLING, VIEW_EVENTS, VIEW_ROLES } from '../utils/constants';
import { selectCurrentMember, selectCurrentTeam } from '../store/authSlice';

import BinderIcon from '../icons/BinderIcon';
import NavigationRailItem from './NavigationRailItem';
import TeamOptionsPopover from './TeamOptionsPopover';
import { selectCurrentSubscription } from '../store/subscriptionSlice';
import { useSelector } from 'react-redux';
import Icon from './Icon';

const iconClasses = 'h-6 w-6';

// The M3E navigation rail: collapsed (96dp, label under the icon) at md and
// expanded (220dp, icon and label on one row) at lg. Content and Navbar are
// offset by the same widths (md:ml-24 lg:ml-[220px]).
export default function NavigationRail() {
  const currentTeam = useSelector(selectCurrentTeam);
  // Non-null: Content renders the rail only once the membership loads.
  const currentMember = useSelector(selectCurrentMember)!;
  const currentSubscription = useSelector(selectCurrentSubscription);

  return (
    // ::before and ::after reach a screen above and below, so an overscroll
    // bounce shows more rail rather than the white page behind it.
    <nav
      aria-label="Main"
      className="fixed inset-y-0 left-0 hidden w-24 md:flex flex-col bg-surface-container lg:w-[220px] before:absolute before:inset-x-0 before:bottom-full before:h-screen before:bg-surface-container after:absolute after:inset-x-0 after:top-full after:h-screen after:bg-surface-container"
    >
      {currentTeam && <TeamOptionsPopover team={currentTeam} />}
      <div className="flex flex-col gap-1 py-3 lg:gap-0 lg:px-3">
        <NavigationRailItem
          text="Dashboard"
          to="/"
          icon={<Icon name="dashboard" className={iconClasses} />}
          activeIcon={<Icon name="dashboard" filled className={iconClasses} />}
          exact
        />
        <NavigationRailItem
          text="Songs"
          to="/songs"
          icon={<Icon name="music_note" className={iconClasses} />}
          activeIcon={<Icon name="music_note" filled className={iconClasses} />}
        />
        <NavigationRailItem
          text="Sets"
          to="/sets"
          icon={<Icon name="queue_music" className={iconClasses} />}
          activeIcon={
            <Icon name="queue_music" filled className={iconClasses} />
          }
        />
        <NavigationRailItem
          text="Binders"
          to="/binders"
          icon={<BinderIcon outlined className={iconClasses} />}
          activeIcon={<BinderIcon className={iconClasses} />}
        />
        <NavigationRailItem
          text="Team members"
          to="/members"
          icon={<Icon name="person" className={iconClasses} />}
          activeIcon={<Icon name="person" filled className={iconClasses} />}
        />
        {currentSubscription?.isPro && currentMember?.can(VIEW_EVENTS) && (
          <NavigationRailItem
            text="Calendar"
            to="/calendar"
            icon={<Icon name="calendar_month" className={iconClasses} />}
            activeIcon={
              <Icon name="calendar_month" filled className={iconClasses} />
            }
          />
        )}
        {/* {currentSubscription?.isPro && (
          <NavigationRailItem
            text="Chat"
            to="/chat"
            icon={<Icon name="chat" className={iconClasses} />}
            activeIcon={<Icon name="chat" className={iconClasses} />}
          />
        )} */}
        {currentMember.can(VIEW_ROLES) && (
          <>
            <hr className="mx-3 my-3 border-outline-variant lg:mx-4" />
            <NavigationRailItem
              to="/permissions"
              text="Permissions"
              icon={<Icon name="lock" className={iconClasses} />}
              activeIcon={<Icon name="lock" filled className={iconClasses} />}
            />
          </>
        )}
        {currentMember.can(MANAGE_BILLING) && (
          <NavigationRailItem
            to="/billing"
            text="Billing"
            icon={<Icon name="credit_card" className={iconClasses} />}
            activeIcon={
              <Icon name="credit_card" filled className={iconClasses} />
            }
          />
        )}
      </div>
    </nav>
  );
}
