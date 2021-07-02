import StyledDialog from "../StyledDialog";
import MobileMenuButton from "../buttons/MobileMenuButton";
import FolderOpenIcon from "@heroicons/react/outline/FolderOpenIcon";
import MusicNoteIcon from "@heroicons/react/solid/MusicNoteIcon";
import ViewGridAddIcon from "@heroicons/react/outline/ViewGridAddIcon";
import UserGroupIcon from "@heroicons/react/solid/UserGroupIcon";
import { Link } from "react-router-dom";

export default function AppMenu({ onCloseDialog, open }) {
	return (
		<StyledDialog onCloseDialog={onCloseDialog} open={open} title="Menu" fullscreen={false}>
			<Link to="/binders">
				<MobileMenuButton full onClick={onCloseDialog}>
					<div className="flex items-center text-gray-700">
						<FolderOpenIcon className="mr-4 h-5" />
						Binders
					</div>
				</MobileMenuButton>
			</Link>

			<Link to="/songs">
				<MobileMenuButton full onClick={onCloseDialog}>
					<div className="flex items-center text-gray-700">
						<MusicNoteIcon className="mr-4 h-5" />
						Songs
					</div>
				</MobileMenuButton>
			</Link>

			<Link to="/sets">
				<MobileMenuButton full onClick={onCloseDialog}>
					<div className="flex items-center text-gray-700">
						<ViewGridAddIcon className="mr-4 h-5" />
						Sets
					</div>
				</MobileMenuButton>
			</Link>

			<Link to="/members">
				<MobileMenuButton full onClick={onCloseDialog}>
					<div className="flex items-center text-gray-700">
						<UserGroupIcon className="mr-4 h-5" />
						Team members
					</div>
				</MobileMenuButton>
			</Link>
		</StyledDialog>
	);
}
