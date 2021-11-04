import { selectCurrentMember, selectCurrentTeam } from "../../store/authSlice";

import BinderIcon from "../../icons/BinderIcon";
import CalendarIcon from "@heroicons/react/outline/CalendarIcon";
import DashboardIcon from "../../icons/DashboardIcon";
import { Link } from "react-router-dom";
import MobileMenuButton from "../buttons/MobileMenuButton";
import MusicNoteIcon from "@heroicons/react/solid/MusicNoteIcon";
import PlaylistIcon from "../../icons/PlaylistIcon";
import StyledDialog from "../StyledDialog";
import SwitchHorizontalIcon from "@heroicons/react/outline/SwitchHorizontalIcon";
import UserGroupIcon from "@heroicons/react/solid/UserGroupIcon";
import { VIEW_EVENTS } from "../../utils/constants";
import { selectCurrentSubscription } from "../../store/subscriptionSlice";
import { useSelector } from "react-redux";

export default function AppMenu({ onCloseDialog, open }) {
	const currentSubscription = useSelector(selectCurrentSubscription);
	const currentMember = useSelector(selectCurrentMember);
	const currentTeam = useSelector(selectCurrentTeam);
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
					<div className="flex items-center text-gray-700">
						<DashboardIcon className={iconClasses} />
						Dashboard
					</div>
				</MobileMenuButton>
			</Link>

			<Link to="/binders">
				<MobileMenuButton full onClick={onCloseDialog}>
					<div className="flex items-center text-gray-700">
						<BinderIcon className={iconClasses} />
						Binders
					</div>
				</MobileMenuButton>
			</Link>

			<Link to="/songs">
				<MobileMenuButton full onClick={onCloseDialog}>
					<div className="flex items-center text-gray-700">
						<MusicNoteIcon className={iconClasses} />
						Songs
					</div>
				</MobileMenuButton>
			</Link>

			<Link to="/sets">
				<MobileMenuButton full onClick={onCloseDialog}>
					<div className="flex items-center text-gray-700">
						<PlaylistIcon className={iconClasses} />
						Sets
					</div>
				</MobileMenuButton>
			</Link>

			<Link to="/members">
				<MobileMenuButton full onClick={onCloseDialog}>
					<div className="flex items-center text-gray-700">
						<UserGroupIcon className={iconClasses} />
						Team members
					</div>
				</MobileMenuButton>
			</Link>

			{currentSubscription?.isPro && currentMember?.can(VIEW_EVENTS) && (
				<Link to="/calendar">
					<MobileMenuButton full onClick={onCloseDialog}>
						<div className="flex items-center text-gray-700">
							<CalendarIcon className={iconClasses} />
							Calendar
						</div>
					</MobileMenuButton>
				</Link>
			)}
			<Link to="/login/teams">
				<MobileMenuButton full onClick={onCloseDialog}>
					<div className="flex items-center text-gray-700">
						<SwitchHorizontalIcon className={iconClasses} />
						Switch teams
					</div>
				</MobileMenuButton>
			</Link>
		</StyledDialog>
	);
}
