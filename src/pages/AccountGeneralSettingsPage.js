import ArrowNarrowLeftIcon from "@heroicons/react/outline/ArrowNarrowLeftIcon";
import Button from "../components/Button";
import Integrations from "../components/Integrations";
import { Link } from "react-router-dom";
import ProfilePicture from "../components/ProfilePicture";
import SignOutOptions from "../components/SignOutOptions";
import { selectCurrentUser } from "../store/authSlice";
import { useSelector } from "react-redux";

export default function AccountGeneralSettingsPage() {
	const currentUser = useSelector(selectCurrentUser);
	if (!currentUser) return "Loading...";
	return (
		<>
			<Link to="/account">
				<Button variant="open" color="gray">
					<div className="flex-center">
						<ArrowNarrowLeftIcon className="mr-4 w-4 h-4" />
						Menu
					</div>
				</Button>
			</Link>
			<div className="text-gray-500">
				<div className="w-24 m-auto flex-center my-2">
					<ProfilePicture url={currentUser.image_url} />
				</div>
				<div className="font-semibold text-sm text-center mb-1">{currentUser.email}</div>
				{currentUser.first_name ? (
					<div className="font-semibold text-black dark:text-dark-gray-100 text-center text-xl">
						{currentUser.first_name} {currentUser.last_name}
					</div>
				) : (
					<div className="text-center">
						You haven't provided your name yet. You can do that
						<Link to="/account/profile"> here</Link>
					</div>
				)}
			</div>

			<Integrations currentUser={currentUser} />
			<SignOutOptions />
		</>
	);
}
