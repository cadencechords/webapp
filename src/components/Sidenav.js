import { MANAGE_BILLING, VIEW_EVENTS, VIEW_ROLES } from '../utils/constants';
import { selectCurrentMember, selectCurrentTeam } from '../store/authSlice';

import BinderIcon from '../icons/BinderIcon';
import CalendarIcon from '@heroicons/react/outline/CalendarIcon';
import DashboardIcon from '../icons/DashboardIcon';
import LockClosedIcon from '@heroicons/react/outline/LockClosedIcon';
import CreditCardIcon from '@heroicons/react/outline/CreditCardIcon';
import MusicNoteIcon from '@heroicons/react/solid/MusicNoteIcon';
import PlaylistIcon from '../icons/PlaylistIcon';
import SidenavLink from './SidenavLink';
import TeamOptionsPopover from './TeamOptionsPopover';
import UserGroupIcon from '@heroicons/react/solid/UserGroupIcon';
import { selectCurrentSubscription } from '../store/subscriptionSlice';
import { useSelector } from 'react-redux';

export default function Sidenav() {
  let iconClasses = 'h-5 w-5';

  const currentTeam = useSelector(selectCurrentTeam);
  const currentMember = useSelector(selectCurrentMember);
  const currentSubscription = useSelector(selectCurrentSubscription);

  let currentTeamCard = null;
  if (currentTeam) {
    currentTeamCard = <TeamOptionsPopover team={currentTeam} />;
  }

  return (
    <div className="fixed w-0 h-full transition-all shadow-inner bg-gray-50 dark:bg-dark-gray-800 lg:w-52 md:w-14 md:border-r dark:border-dark-gray-400">
      <div className="flex-col hidden md:flex">
        {currentTeamCard}
        <div className="flex flex-col py-3 ">
          <SidenavLink
            text="Dashboard"
            to="/"
            icon={<DashboardIcon className={iconClasses} />}
            exact
          />
          <SidenavLink
            text="Binders"
            to="/binders"
            icon={<BinderIcon className={iconClasses} />}
          />
          <SidenavLink
            text="Songs"
            to="/songs"
            icon={<MusicNoteIcon className={iconClasses} />}
          />
          <SidenavLink
            text="Sets"
            to="/sets"
            icon={<PlaylistIcon className="w-6 h-6" />}
          />
          <SidenavLink
            text="Team members"
            to="/members"
            icon={<UserGroupIcon className={iconClasses} />}
          />
          {currentSubscription?.isPro && currentMember?.can(VIEW_EVENTS) && (
            <SidenavLink
              text="Calendar"
              to="/calendar"
              icon={<CalendarIcon className={iconClasses} />}
            />
          )}
          {currentMember.can(VIEW_ROLES) && (
            <>
              <hr className="my-4 dark:border-dark-gray-400" />
              <SidenavLink
                to="/permissions"
                text="Permissions"
                icon={<LockClosedIcon className={iconClasses} />}
              />
            </>
          )}
          {currentMember.can(MANAGE_BILLING) && (
            <SidenavLink
              to="/billing"
              text="Billing"
              icon={<CreditCardIcon className={iconClasses} />}
            />
          )}
        </div>
      </div>
    </div>
  );
}
