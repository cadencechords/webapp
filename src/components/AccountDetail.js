import { useEffect } from "react";
import NoDataMessage from "./NoDataMessage";
import CenteredPage from "./CenteredPage";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/authSlice";
import ProfilePicture from "./ProfilePicture";

export default function AccountDetail() {
	const currentUser = useSelector(selectCurrentUser);

	useEffect(() => {
		document.title = "Account Details";
	}, []);

	if (currentUser) {
		return (
			<>
				<div className="text-gray-500">
					<div className="w-24 m-auto">
						<ProfilePicture url={currentUser.image_url} />
					</div>
					<div className="font-semibold text-sm text-center mb-2">{currentUser.email}</div>
					{currentUser.first_name ? (
						<div className="font-semibold text-black text-center text-xl">
							{currentUser.first_name} {currentUser.last_name}
						</div>
					) : (
						<div className="text-center">
							You haven't provided your name yet. You can do that here
						</div>
					)}
				</div>
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
