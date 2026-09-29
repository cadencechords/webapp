import { selectCurrentMember, selectCurrentTeam } from '../../store/authSlice';

import { SettingsAction } from '../SettingsList';
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

  const hasAdminSection =
    currentMember?.can(VIEW_ROLES) || currentMember?.can(MANAGE_BILLING);

  return (
    <StyledDialog
      onCloseDialog={onCloseDialog}
      open={open}
      title={currentTeam.name}
      fullscreen={true}
    >
      {/* Sections of segmented list items, 8dp apart. */}
      <div className="flex flex-col gap-2">
        <div className="list-segmented">
          <SettingsAction
            to="/"
            onClick={onCloseDialog}
            icon={<DashboardIcon />}
            label="Dashboard"
          />
          <SettingsAction
            to="/folders"
            onClick={onCloseDialog}
            icon={<BinderIcon />}
            label="Folders"
          />
          <SettingsAction
            to="/songs"
            onClick={onCloseDialog}
            icon={<Icon name="music_note" filled />}
            label="Songs"
          />
          <SettingsAction
            to="/sets"
            onClick={onCloseDialog}
            icon={<PlaylistIcon />}
            label="Sets"
          />
          <SettingsAction
            to="/members"
            onClick={onCloseDialog}
            icon={<Icon name="person" filled />}
            label="Team members"
          />
          {currentSubscription?.isPro && currentMember?.can(VIEW_EVENTS) && (
            <SettingsAction
              to="/calendar"
              onClick={onCloseDialog}
              icon={<Icon name="calendar_month" filled />}
              label="Calendar"
            />
          )}
        </div>

        {hasAdminSection && (
          <div className="list-segmented">
            {currentMember?.can(VIEW_ROLES) && (
              <SettingsAction
                to="/permissions"
                onClick={onCloseDialog}
                icon={<Icon name="lock" filled />}
                label="Permissions"
              />
            )}
            {currentMember?.can(MANAGE_BILLING) && (
              <SettingsAction
                to="/billing"
                onClick={onCloseDialog}
                icon={<Icon name="credit_card" filled />}
                label="Billing"
              />
            )}
          </div>
        )}

        <div className="list-segmented">
          <SettingsAction
            to="/login/teams"
            onClick={onCloseDialog}
            icon={<Icon name="swap_horiz" filled />}
            label="Switch teams"
          />
        </div>
      </div>
    </StyledDialog>
  );
}
