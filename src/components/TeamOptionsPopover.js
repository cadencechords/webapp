import InformationCircleIcon from "@heroicons/react/outline/InformationCircleIcon";
import { Link } from "react-router-dom";
import MobileMenuButton from "./buttons/MobileMenuButton";
import ProfilePicture from "./ProfilePicture";
import StyledPopover from "./StyledPopover";
import SwitchHorizontalIcon from "@heroicons/react/outline/SwitchHorizontalIcon";

export default function TeamOptionsPopover({ team }) {
	let button = (
		<div className="font-semibold text-base items-center flex w-full px-3 py-2 transition-colors dark:hover:bg-dark-gray-700 hover:bg-gray-200">
			<span className="w-8 mr-3">
				<ProfilePicture url={team.image_url} size="xs" />
			</span>
			<span className="hidden lg:inline dark:text-dark-gray-100">{team.name}</span>
		</div>
	);
	return (
		<StyledPopover button={button} position="bottom-start">
			<div className="w-64">
				<MobileMenuButton full className="rounded-t-md border-b dark:border-dark-gray-400">
					<Link className="flex justify-start items-center" to="/team">
						<InformationCircleIcon className="mx-4 h-4" />
						View details
					</Link>
				</MobileMenuButton>
				<MobileMenuButton full className="rounded-b-md">
					<Link className="flex justify-start  items-center" to="/login/teams">
						<SwitchHorizontalIcon className="mx-4 h-4" />
						Switch teams
					</Link>
				</MobileMenuButton>
			</div>
		</StyledPopover>
	);
}
