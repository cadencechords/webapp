import { selectCurrentTeam } from "../../store/authSlice";

import BinderIcon from "../../icons/BinderIcon";

import DashboardIcon from "../../icons/DashboardIcon";
import { Link } from "react-router-dom";
import MobileMenuButton from "../buttons/MobileMenuButton";
import MusicNoteIcon from "@heroicons/react/solid/MusicNoteIcon";
import PlaylistIcon from "../../icons/PlaylistIcon";
import StyledDialog from "../StyledDialog";
import SwitchHorizontalIcon from "@heroicons/react/outline/SwitchHorizontalIcon";
import UserGroupIcon from "@heroicons/react/solid/UserGroupIcon";
import { useSelector } from "react-redux";

export default function AppMenu({ onCloseDialog, open }) {
  const currentTeam = useSelector(selectCurrentTeam).team;
  const iconClasses = "mr-4 w-5 h-5";

  return (
    <StyledDialog
      onCloseDialog={onCloseDialog}
      open={open}
      title={currentTeam.name}
      fullscreen={false}
    >
      <Link to="/">
        <MobileMenuButton full onClick={onCloseDialog}>
          <div className="flex items-center text-gray-700 dark:text-dark-gray-200">
            <DashboardIcon className={iconClasses} />
            Dashboard
          </div>
        </MobileMenuButton>
      </Link>

      <Link to="/binders">
        <MobileMenuButton full onClick={onCloseDialog}>
          <div className="flex items-center text-gray-700 dark:text-dark-gray-200">
            <BinderIcon className={iconClasses} />
            Binders
          </div>
        </MobileMenuButton>
      </Link>

      <Link to="/songs">
        <MobileMenuButton full onClick={onCloseDialog}>
          <div className="flex items-center text-gray-700 dark:text-dark-gray-200">
            <MusicNoteIcon className={iconClasses} />
            Songs
          </div>
        </MobileMenuButton>
      </Link>

      <Link to="/sets">
        <MobileMenuButton full onClick={onCloseDialog}>
          <div className="flex items-center text-gray-700 dark:text-dark-gray-200">
            <PlaylistIcon className={iconClasses} />
            Sets
          </div>
        </MobileMenuButton>
      </Link>

      <Link to="/members">
        <MobileMenuButton full onClick={onCloseDialog}>
          <div className="flex items-center text-gray-700 dark:text-dark-gray-200">
            <UserGroupIcon className={iconClasses} />
            Team members
          </div>
        </MobileMenuButton>
      </Link>

      <MobileMenuButton full onClick={onCloseDialog} disabled={true}>
        <div className="flex items-center text-gray-700 dark:text-dark-gray-200">
          <SwitchHorizontalIcon className={iconClasses} />
          Switch teams
        </div>
      </MobileMenuButton>
    </StyledDialog>
  );
}
