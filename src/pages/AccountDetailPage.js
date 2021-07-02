import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

import NoDataMessage from "../components/NoDataMessage";
import CenteredPage from "../components/CenteredPage";
import { selectCurrentUser } from "../store/authSlice";
import ProfilePicture from "../components/ProfilePicture";
import SignOutOptions from "../components/SignOutOptions";
import Integrations from "../components/Integrations";

export default function AccountDetailPage() {
	const currentUser = useSelector(selectCurrentUser);

	useEffect(() => {
		document.title = "Account Details";
	}, []);

	if (currentUser) {
		return (
			<>
				<div className="text-gray-500">
					<div className="w-24 m-auto flex-center my-2">
						<ProfilePicture url={currentUser.image_url} />
					</div>
					<div className="font-semibold text-sm text-center mb-1">{currentUser.email}</div>
					{currentUser.first_name ? (
						<div className="font-semibold text-black text-center text-xl">
							{currentUser.first_name} {currentUser.last_name}
						</div>
					) : (
						<div className="text-center">
							You haven't provided your name yet. You can do that
							<Link to="/account/personal">here</Link>
						</div>
					)}
				</div>

				<Integrations currentUser={currentUser} />
				<SignOutOptions />
			</>
		);
	} else {
		return (
			<CenteredPage>
				<NoDataMessage>You'll need to sign in first</NoDataMessage>;
			</CenteredPage>
		);
	}
}
