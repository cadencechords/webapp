import ProfilePicture from "./ProfilePicture";
import Button from "./Button";
import { useCallback } from "react";
import UserApi from "../api/UserApi";
import EditableData from "./inputs/EditableData";
import DotsVerticalIcon from "@heroicons/react/outline/DotsVerticalIcon";
import _ from "lodash";
import { Link } from "react-router-dom";

export default function MemberCard({ member, isCurrentUser, onPositionChanged, onShowMemberMenu }) {
	const handlePositionChange = (newPosition) => {
		onPositionChanged(newPosition);
		debounce(newPosition);
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debounce = useCallback(
		_.debounce((newPosition) => {
			try {
				UserApi.updateMembership(member.id, { position: newPosition });
			} catch (error) {
				console.log(error);
			}
		}, 1000),
		[]
	);

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

		let teamPosition = null;
		if (isCurrentUser) {
			teamPosition = (
				<EditableData
					value={member.position}
					placeholder="What's your position on the team?"
					centered
					onChange={handlePositionChange}
				/>
			);
		} else {
			teamPosition = <div className="text-sm">{member.position}</div>;
		}
		return (
			<div className="rounded-md bg-gray-50 py-3 px-5 text-center relative">
				<Button variant="open" className="absolute right-2 top-2" onClick={onShowMemberMenu}>
					<DotsVerticalIcon className="text-gray-600 h-5" />
				</Button>
				<div className="m-auto w-20 h-20 flex items-center justify-center">
					<ProfilePicture url={member.image_url} />
				</div>
				{adminStatusBubble} {currentUserBubble}
				<div className="font-semibold">
					{member.first_name ? member.first_name + " " + member.last_name : member.email}
				</div>
				{teamPosition}
				<Link to={`/app/members/${member.id}`}>
					<Button variant="outlined" size="xs" full className="mt-2">
						View profile
					</Button>
				</Link>
			</div>
		);
	} else {
		return null;
	}
}
