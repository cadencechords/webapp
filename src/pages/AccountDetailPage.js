import BellIcon from "@heroicons/react/outline/BellIcon";
import CogIcon from "@heroicons/react/outline/CogIcon";
import CreditCardIcon from "@heroicons/react/outline/CreditCardIcon";
import { Link } from "react-router-dom";
import MobileMenuButton from "../components/buttons/MobileMenuButton";
import ProfilePicture from "../components/ProfilePicture";
import UserCircleIcon from "@heroicons/react/outline/UserCircleIcon";
import { selectCurrentUser } from "../store/authSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";

// import PhotographIcon from "@heroicons/react/outline/PhotographIcon";

export default function AccountDetailPage() {
	const currentUser = useSelector(selectCurrentUser);
	useEffect(() => {
		document.title = "Account Details";
	}, []);

	if (!currentUser) return "Loading...";

	return (
		<>
			<div className="max-w-lg mx-auto">
				<div className="text-gray-500">
					<div className="w-24 m-auto flex-center my-2">
						<ProfilePicture url={currentUser.image_url} />
					</div>
					<div className="font-semibold text-sm text-center mb-1">{currentUser.email}</div>
					{currentUser.first_name && (
						<div className="font-semibold text-black text-center text-xl mb-4">
							{currentUser.first_name} {currentUser.last_name}
						</div>
					)}
				</div>
				<Link to="/account/settings">
					<MobileMenuButton full className="border-b">
						<div className="flex items-center text-gray-700">
							<CogIcon className="w-5 h-5 mr-4" /> General
						</div>
					</MobileMenuButton>
				</Link>
				<Link to="/account/profile">
					<MobileMenuButton full className="border-b">
						<div className="flex items-center text-gray-700">
							<UserCircleIcon className="w-5 h-5 mr-4" /> Profile
						</div>
					</MobileMenuButton>
				</Link>
				<Link to="/account/billing">
					<MobileMenuButton full className="border-b">
						<div className="flex items-center text-gray-700">
							<CreditCardIcon className="w-5 h-5 mr-4" /> Billing
						</div>
					</MobileMenuButton>
				</Link>
				{/* <MobileMenuButton full className="border-b">
					<div className="flex items-center text-gray-700">
						<PhotographIcon className="w-5 h-5 mr-4" /> Appearance
					</div>
				</MobileMenuButton> */}
				<Link to="/account/notifications">
					<MobileMenuButton full className="border-b">
						<div className="flex items-center text-gray-700">
							<BellIcon className="h-5 w-5 mr-4" /> Notifications
						</div>
					</MobileMenuButton>
				</Link>
			</div>
		</>
	);
}
