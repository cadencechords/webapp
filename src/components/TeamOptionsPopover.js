import StyledPopover from "./StyledPopover";
import ProfilePicture from "./ProfilePicture";
import SwitchHorizontalIcon from "@heroicons/react/outline/SwitchHorizontalIcon";
import InformationCircleIcon from "@heroicons/react/outline/InformationCircleIcon";
import { Link } from "react-router-dom";
import Button from "./Button";

export default function TeamOptionsPopover({ team }) {
	let button = (
		<div className="font-semibold text-base items-center flex w-full px-3 py-2 transition-colors hover:bg-gray-200">
			<span className="w-8 mr-3">
				<ProfilePicture url={team.image_url} size="xs" />
			</span>
			{team.name}
		</div>
	);
	return (
		<StyledPopover button={button}>
			<div className="w-64">
				<Button variant="open" full>
					<Link className="flex justify-start text-gray-600 h-8 items-center" to="/app/team">
						<InformationCircleIcon className="mx-4 h-4 text-gray-600" />
						View details
					</Link>
				</Button>
				<Button variant="open" full>
					<Link className="flex justify-start text-gray-600 h-8 items-center" to="/login/teams">
						<SwitchHorizontalIcon className="mx-4 h-4 text-gray-600" />
						Switch teams
					</Link>
				</Button>
			</div>
		</StyledPopover>
	);
}
