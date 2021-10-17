import { VIEW_EVENTS, VIEW_ROLES } from "../utils/constants";
import { selectCurrentMember, selectCurrentTeam } from "../store/authSlice";

import CalendarIcon from "@heroicons/react/outline/CalendarIcon";
import FolderOpenIcon from "@heroicons/react/outline/FolderOpenIcon";
import LockClosedIcon from "@heroicons/react/outline/LockClosedIcon";
import MusicNoteIcon from "@heroicons/react/solid/MusicNoteIcon";
import SidenavLink from "./SidenavLink";
import TeamOptionsPopover from "./TeamOptionsPopover";
import TemplateIcon from "@heroicons/react/solid/TemplateIcon";
import UserGroupIcon from "@heroicons/react/solid/UserGroupIcon";
import ViewGridAddIcon from "@heroicons/react/outline/ViewGridAddIcon";
import { selectCurrentSubscription } from "../store/subscriptionSlice";
import { useSelector } from "react-redux";

export default function Sidenav() {
	let iconClasses = "h-4 w-4";

	const currentTeam = useSelector(selectCurrentTeam);
	const currentMember = useSelector(selectCurrentMember);
	const currentSubscription = useSelector(selectCurrentSubscription);

	let currentTeamCard = null;
	if (currentTeam) {
		currentTeamCard = <TeamOptionsPopover team={currentTeam} />;
	}

	return (
		<div className="fixed h-full  bg-gray-50 md:w-56 w-0 transition-all border-r shadow-inner">
			<div className="hidden md:flex flex-col">
				{currentTeamCard}
				<div className="px-2 flex flex-col py-3 ">
					<SidenavLink
						text="Dashboard"
						to="/"
						icon={<TemplateIcon className={iconClasses} />}
						exact
					/>
					<SidenavLink
						text="Binders"
						to="/binders"
						icon={<FolderOpenIcon className={iconClasses} />}
					/>
					<SidenavLink text="Songs" to="/songs" icon={<MusicNoteIcon className={iconClasses} />} />
					<SidenavLink text="Sets" to="/sets" icon={<ViewGridAddIcon className={iconClasses} />} />
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
							<hr className="my-4" />
							<SidenavLink
								to="/permissions"
								text="Permissions"
								icon={<LockClosedIcon className={iconClasses} />}
							/>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
