import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import {
  logOut,
  selectCurrentTeam,
  selectCurrentUser,
} from '../store/authSlice';
import { getNameOrEmail } from '../utils/model';
import Icon from './Icon';
import { MenuDivider, MenuItem, MenuList } from './Menu';
import { RAIL_ACTION, RAIL_ACTION_ROW } from './NavigationRailItem';
import ProfilePicture from './ProfilePicture';
import StyledPopover from './StyledPopover';

// The team and the account in one button at the top of the rail. Collapsed,
// your picture with the team's as a badge on its corner; expanded, the team's
// name over yours. Its menu has the team's actions, then yours.
export default function TeamAccountMenu() {
  const dispatch = useDispatch();
  const router = useHistory();
  const currentUser = useSelector(selectCurrentUser);
  const currentTeam = useSelector(selectCurrentTeam);
  const userName = currentUser && getNameOrEmail(currentUser);

  const handleLogOut = () => {
    dispatch(logOut());
    router.push('/login');
  };

  const button = (
    <div className={RAIL_ACTION_ROW}>
      <div className={`${RAIL_ACTION} lg:h-14`}>
        {/* Your picture, the team's on its corner. */}
        <span className="relative shrink-0">
          <ProfilePicture
            url={currentUser?.image_url}
            name={userName}
            size="xs"
          />
          {currentTeam && (
            <span className="absolute -right-1.5 -bottom-1.5 rounded-full ring-2 ring-white dark:ring-dark-gray-900">
              <ProfilePicture
                url={currentTeam.image_url}
                name={currentTeam.name}
                size="xxs"
              />
            </span>
          )}
        </span>
        <span className="hidden min-w-0 text-left lg:block font-plain">
          <span className="block truncate text-label-large text-on-surface">
            {currentTeam?.name}
          </span>
          <span className="block truncate text-body-small text-on-surface-variant">
            {userName}
          </span>
        </span>
      </div>
    </div>
  );

  return (
    <StyledPopover button={button} position="right-start">
      <MenuList className="w-64">
        {/* Which team you're acting in, and as whom: opens your account.
            data-menu-item so choosing it closes the menu. */}
        <Link
          to="/account"
          data-menu-item
          className="block px-3 pt-2 pb-3 rounded-medium font-plain state-layer-flat outline-none focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-secondary focus-visible:-outline-offset-3 [--md-sys-state-hover-state-layer-opacity:0.14] [--md-sys-state-focus-state-layer-opacity:0.16]"
        >
          <div className="truncate text-title-small text-on-surface">
            {currentTeam?.name}
          </div>
          <div className="truncate text-body-small text-on-surface-variant">
            {currentUser?.email}
          </div>
        </Link>
        <MenuDivider />
        <MenuItem to="/team" icon={<Icon name="info" />}>
          View team details
        </MenuItem>
        <MenuItem to="/login/teams" icon={<Icon name="swap_horiz" />}>
          Switch teams
        </MenuItem>
        <MenuDivider />
        <MenuItem to="/account" icon={<Icon name="account_circle" />}>
          Account
        </MenuItem>
        <MenuItem
          destructive
          onClick={handleLogOut}
          icon={<Icon name="logout" />}
        >
          Log out
        </MenuItem>
      </MenuList>
    </StyledPopover>
  );
}
