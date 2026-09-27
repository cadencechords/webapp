import { selectCurrentMember, selectCurrentTeam } from '../../store/authSlice';

import { MenuDivider, MenuItem, MenuList } from '../Menu';
import StyledDialog from '../StyledDialog';
import { MANAGE_BILLING, VIEW_EVENTS, VIEW_ROLES } from '../../utils/constants';
import { selectCurrentSubscription } from '../../store/subscriptionSlice';
import { useSelector } from 'react-redux';
import BinderIcon from '../../icons/BinderIcon';
import DashboardIcon from '../../icons/DashboardIcon';
import PlaylistIcon from '../../icons/PlaylistIcon';
import Icon from '../Icon';

type AppMenuProps = {
  onCloseDialog: () => void;
  open: boolean;
};

export default function AppMenu({ onCloseDialog, open }: AppMenuProps) {
  const currentSubscription = useSelector(selectCurrentSubscription);
  const currentMember = useSelector(selectCurrentMember);
  // Non-null: SecuredRoutes renders Content, and so this menu, only once the
  // current team loads.
  const currentTeam = useSelector(selectCurrentTeam)!;

  const shouldShowDividers =
    currentMember?.can(VIEW_ROLES) || currentMember?.can(MANAGE_BILLING);

  return (
    <StyledDialog
      onCloseDialog={onCloseDialog}
      open={open}
      title={currentTeam.name}
      fullscreen={true}
    >
      {/* Items reach into the dialog's padding, so labels line up with the
          title. */}
      <MenuList className="-mx-3 *:rounded-medium">
        <MenuItem to="/" onClick={onCloseDialog} icon={<DashboardIcon />}>
          Dashboard
        </MenuItem>

        <MenuItem to="/binders" onClick={onCloseDialog} icon={<BinderIcon />}>
          Binders
        </MenuItem>

        <MenuItem
          to="/songs"
          onClick={onCloseDialog}
          icon={<Icon name="music_note" filled />}
        >
          Songs
        </MenuItem>

        <MenuItem to="/sets" onClick={onCloseDialog} icon={<PlaylistIcon />}>
          Sets
        </MenuItem>

        <MenuItem
          to="/members"
          onClick={onCloseDialog}
          icon={<Icon name="person" filled />}
        >
          Team members
        </MenuItem>

        {currentSubscription?.isPro && currentMember?.can(VIEW_EVENTS) && (
          <MenuItem
            to="/calendar"
            onClick={onCloseDialog}
            icon={<Icon name="calendar_month" filled />}
          >
            Calendar
          </MenuItem>
        )}

        {shouldShowDividers && <MenuDivider />}
        {currentMember?.can(VIEW_ROLES) && (
          <MenuItem
            to="/permissions"
            onClick={onCloseDialog}
            icon={<Icon name="lock" filled />}
          >
            Permissions
          </MenuItem>
        )}
        {currentMember?.can(MANAGE_BILLING) && (
          <MenuItem
            to="/billing"
            onClick={onCloseDialog}
            icon={<Icon name="credit_card" filled />}
          >
            Billing
          </MenuItem>
        )}
        {shouldShowDividers && <MenuDivider />}
        <MenuItem
          to="/login/teams"
          onClick={onCloseDialog}
          icon={<Icon name="swap_horiz" filled />}
        >
          Switch teams
        </MenuItem>
      </MenuList>
    </StyledDialog>
  );
}
