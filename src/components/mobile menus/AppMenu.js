import { selectCurrentMember, selectCurrentTeam } from '../../store/authSlice';

import { Link } from 'react-router-dom';
import MobileMenuButton from '../buttons/MobileMenuButton';
import StyledDialog from '../StyledDialog';
import { MANAGE_BILLING, VIEW_EVENTS, VIEW_ROLES } from '../../utils/constants';
import { selectCurrentSubscription } from '../../store/subscriptionSlice';
import { useSelector } from 'react-redux';
import BinderIcon from '../../icons/BinderIcon';
import CalendarIcon from '@heroicons/react/solid/CalendarIcon';
import DashboardIcon from '../../icons/DashboardIcon';
import MusicNoteIcon from '@heroicons/react/solid/MusicNoteIcon';
import PlaylistIcon from '../../icons/PlaylistIcon';
import SwitchHorizontalIcon from '@heroicons/react/solid/SwitchHorizontalIcon';
import UserIcon from '@heroicons/react/solid/UserIcon';
import CreditCardIcon from '@heroicons/react/solid/CreditCardIcon';
import LockClosedIcon from '@heroicons/react/solid/LockClosedIcon';

export default function AppMenu({ onCloseDialog, open }) {
  const currentSubscription = useSelector(selectCurrentSubscription);
  const currentMember = useSelector(selectCurrentMember);
  const currentTeam = useSelector(selectCurrentTeam);

  const iconClasses = 'mr-5 w-5 h-5';

  const shouldShowDividers =
    currentMember?.can(VIEW_ROLES) || currentMember?.can(MANAGE_BILLING);

  return (
    <StyledDialog
      onCloseDialog={onCloseDialog}
      open={open}
      title={currentTeam.name}
      fullscreen={true}
    >
      <Link to="/">
        <MobileMenuButton full onClick={onCloseDialog} size="none">
          <div className="flex items-center text-gray-700 dark:text-dark-gray-200">
            <DashboardIcon className={iconClasses} />
            Dashboard
          </div>
        </MobileMenuButton>
      </Link>

      <Link to="/binders">
        <MobileMenuButton full onClick={onCloseDialog} size="none">
          <div className="flex items-center text-gray-700 dark:text-dark-gray-200">
            <BinderIcon className={iconClasses} />
            Binders
          </div>
        </MobileMenuButton>
      </Link>

      <Link to="/songs">
        <MobileMenuButton full onClick={onCloseDialog} size="none">
          <div className="flex items-center text-gray-700 dark:text-dark-gray-200">
            <MusicNoteIcon className={iconClasses} />
            Songs
          </div>
        </MobileMenuButton>
      </Link>

      <Link to="/sets">
        <MobileMenuButton full onClick={onCloseDialog} size="none">
          <div className="flex items-center text-gray-700 dark:text-dark-gray-200">
            <PlaylistIcon className={iconClasses} />
            Sets
          </div>
        </MobileMenuButton>
      </Link>

      <Link to="/members">
        <MobileMenuButton full onClick={onCloseDialog} size="none">
          <div className="flex items-center text-gray-700 dark:text-dark-gray-200">
            <UserIcon className={iconClasses} />
            Team members
          </div>
        </MobileMenuButton>
      </Link>

      {currentSubscription?.isPro && currentMember?.can(VIEW_EVENTS) && (
        <Link to="/calendar">
          <MobileMenuButton full onClick={onCloseDialog} size="none">
            <div className="flex items-center text-gray-700 dark:text-dark-gray-200">
              <CalendarIcon className={iconClasses} />
              Calendar
            </div>
          </MobileMenuButton>
        </Link>
      )}

      {shouldShowDividers && (
        <div className="h-px pt-4 mb-4 border-b dark:border-dark-gray-400" />
      )}
      {currentMember?.can(VIEW_ROLES) && (
        <Link to="/permissions">
          <MobileMenuButton full onClick={onCloseDialog} size="none">
            <div className="flex items-center text-gray-700 dark:text-dark-gray-200">
              <LockClosedIcon className={iconClasses} />
              Permissions
            </div>
          </MobileMenuButton>
        </Link>
      )}
      {currentMember?.can(MANAGE_BILLING) && (
        <Link to="/billing">
          <MobileMenuButton full onClick={onCloseDialog} size="none">
            <div className="flex items-center text-gray-700 dark:text-dark-gray-200">
              <CreditCardIcon className={iconClasses} />
              Billing
            </div>
          </MobileMenuButton>
        </Link>
      )}
      {shouldShowDividers && (
        <div className="h-px pt-4 mb-4 border-b dark:border-dark-gray-400" />
      )}
      <Link to="/login/teams">
        <MobileMenuButton full onClick={onCloseDialog} size="none">
          <div className="flex items-center text-gray-700 dark:text-dark-gray-200">
            <SwitchHorizontalIcon className={iconClasses} />
            Switch teams
          </div>
        </MobileMenuButton>
      </Link>
    </StyledDialog>
  );
}
