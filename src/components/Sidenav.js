import SidenavLink from "./SidenavLink";
import FolderOpenIcon from "@heroicons/react/outline/FolderOpenIcon";
import MusicNoteIcon from "@heroicons/react/solid/MusicNoteIcon";
import ViewGridAddIcon from "@heroicons/react/outline/ViewGridAddIcon";
import UserGroupIcon from "@heroicons/react/solid/UserGroupIcon";

export default function Sidenav() {
	let iconClasses = "h-4 w-4";
	return (
		<div className="fixed h-full  bg-gray-50 md:w-56 w-0 transition-all border-r shadow-inner">
			<div className="hidden md:flex flex-col">
				<div className="font-display flex items-center justify-center font-extrabold text-gray-700 text-2xl tracking-wider h-16 bg-white border-b">
					Cadence
				</div>

				<div className="px-2 flex flex-col py-3 ">
					<SidenavLink
						text="Binders"
						to="/app/binders"
						icon={<FolderOpenIcon className={iconClasses} />}
					/>
					<SidenavLink
						text="Songs"
						to="/app/songs"
						icon={<MusicNoteIcon className={iconClasses} />}
					/>
					<SidenavLink
						text="Sets"
						to="/app/sets"
						icon={<ViewGridAddIcon className={iconClasses} />}
					/>
					<SidenavLink
						text="Team members"
						to="/app/members"
						icon={<UserGroupIcon className={iconClasses} />}
					/>
				</div>
			</div>
		</div>
	);
}
