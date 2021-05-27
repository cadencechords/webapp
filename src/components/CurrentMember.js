import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/authSlice";
import ProfilePicture from "./ProfilePicture";

export default function CurrentMember() {
	const currentUser = useSelector(selectCurrentUser);

	if (currentUser) {
		let adminStatusBubble;
		if (currentUser.admin) {
			adminStatusBubble = (
				<span className="rounded-full px-3 py-0.5 bg-blue-600 text-white text-xs mb-1 inline-block">
					Admin
				</span>
			);
		}
		return (
			<div className="rounded-md bg-gray-100 p-3 text-center">
				<div className="m-auto w-20">
					<ProfilePicture url={currentUser.url} />
				</div>
				<span className="rounded-full px-3 py-0.5 bg-purple-600 text-white text-xs mb-1 inline-block">
					Me
				</span>
				{adminStatusBubble}
				<div className="font-semibold">
					{currentUser.first_name} {currentUser.last_name}
				</div>
				<div className="font-semibold text-sm text-gray-500">{currentUser.position}</div>
			</div>
		);
	} else {
		return "";
	}
}
