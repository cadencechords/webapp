import CalendarIcon from "@heroicons/react/outline/CalendarIcon";
import FolderOpenIcon from "@heroicons/react/outline/FolderOpenIcon";
import { Link } from "react-router-dom";
import MobileMenuButton from "../buttons/MobileMenuButton";
import MusicNoteIcon from "@heroicons/react/solid/MusicNoteIcon";
import StyledDialog from "../StyledDialog";
import UserGroupIcon from "@heroicons/react/solid/UserGroupIcon";
import { VIEW_EVENTS } from "../../utils/constants";
import ViewGridAddIcon from "@heroicons/react/outline/ViewGridAddIcon";
import { selectCurrentMember } from "../../store/authSlice";
import { selectCurrentSubscription } from "../../store/subscriptionSlice";
import { useSelector } from "react-redux";

export default function AppMenu({ onCloseDialog, open }) {
	const currentSubscription = useSelector(selectCurrentSubscription);
	const currentMember = useSelector(selectCurrentMember);
	return (
		<StyledDialog onCloseDialog={onCloseDialog} open={open} title="Menu" fullscreen={false}>
			<Link to="/binders">
				<MobileMenuButton full onClick={onCloseDialog}>
					<div className="flex items-center text-gray-700">
						<FolderOpenIcon className="mr-4 w-5 h-5" />
						Binders
					</div>
				</MobileMenuButton>
			</Link>

			<Link to="/songs">
				<MobileMenuButton full onClick={onCloseDialog}>
					<div className="flex items-center text-gray-700">
						<MusicNoteIcon className="mr-4 w-5 h-5" />
						Songs
					</div>
				</MobileMenuButton>
			</Link>

			<Link to="/sets">
				<MobileMenuButton full onClick={onCloseDialog}>
					<div className="flex items-center text-gray-700">
						<ViewGridAddIcon className="mr-4 w-5 h-5" />
						Sets
					</div>
				</MobileMenuButton>
			</Link>

			<Link to="/members">
				<MobileMenuButton full onClick={onCloseDialog}>
					<div className="flex items-center text-gray-700">
						<UserGroupIcon className="mr-4 w-5 h-5" />
						Team members
					</div>
				</MobileMenuButton>
			</Link>

			{currentSubscription?.isPro && currentMember?.can(VIEW_EVENTS) && (
				<Link to="/calendar">
					<MobileMenuButton full onClick={onCloseDialog}>
						<div className="flex items-center text-gray-700">
							<CalendarIcon className="mr-4 h-5" />
							Calendar
						</div>
					</MobileMenuButton>
				</Link>
			)}
		</StyledDialog>
	);
}
