// import EditableData from "./inputs/EditableData";
import ProfilePicture from "./ProfilePicture";
import OpenInput from "./inputs/OpenInput";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/authSlice";

export default function MemberCard({ member, isCurrentUser }) {
	const currentUser = useSelector(selectCurrentUser);

	if (member) {
		let adminStatusBubble;
		if (member.is_admin) {
			adminStatusBubble = (
				<span className="rounded-full px-3 py-0.5 bg-blue-600 text-white text-xs mb-1 inline-block">
					Admin
				</span>
			);
		}

		let currentUserBubble;
		if (isCurrentUser) {
			currentUserBubble = (
				<span className="rounded-full px-3 py-0.5 bg-purple-600 text-white text-xs mb-1 inline-block">
					Me
				</span>
			);
		}

		return (
			<div className="rounded-md bg-gray-100 p-3 text-center">
				<div className="m-auto w-20 h-20">
					<ProfilePicture url={member.image_url} />
				</div>
				{adminStatusBubble} {currentUserBubble}
				<div className="font-semibold">
					{member.first_name ? member.first_name + " " + member.last_name : member.email}
				</div>
				{currentUser.is_admin && (
					<OpenInput placeholder="Enter position here" value={member.position} />
				)}
			</div>
		);
	} else {
		return "";
	}
}
