import ProfilePicture from "./ProfilePicture";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/authSlice";
import Button from "./Button";
import { useState, useCallback } from "react";
import UserApi from "../api/UserApi";
import EditableData from "./inputs/EditableData";
import _ from "lodash";

export default function MemberCard({
	member,
	isCurrentUser,
	onAdminStatusChanged,
	onRemoved,
	onPositionChanged,
}) {
	const currentUser = useSelector(selectCurrentUser);
	const [loading, setLoading] = useState(false);

	const handleChangeAdminStatus = async (isAdmin) => {
		setLoading(true);
		try {
			await UserApi.updateMembership(member.id, { isAdmin });
			onAdminStatusChanged(member.id, isAdmin);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveFromTeam = async () => {
		try {
			await UserApi.deleteMembership(member.id);
			onRemoved(member.id);
		} catch (error) {
			console.log(error);
		}
	};

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

		let adminButton = null;

		if (currentUser.is_admin) {
			adminButton = (
				<Button
					color="purple"
					size="xs"
					className="mt-4 mb-1"
					full
					onClick={() => handleChangeAdminStatus(!member.is_admin)}
					loading={loading}
				>
					{member.is_admin ? "Remove" : "Make"} admin
				</Button>
			);
		}

		let deleteButton = null;
		if (currentUser.is_admin) {
			deleteButton = (
				<Button variant="open" color="red" onClick={handleRemoveFromTeam} full size="xs">
					Remove from team
				</Button>
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
		}
		return (
			<div className="rounded-md bg-gray-50 py-3 px-5 text-center">
				<div className="m-auto w-20 h-20 flex items-center justify-center">
					<ProfilePicture url={member.image_url} />
				</div>
				{adminStatusBubble} {currentUserBubble}
				<div className="font-semibold">
					{member.first_name ? member.first_name + " " + member.last_name : member.email}
				</div>
				{teamPosition}
				{adminButton}
				{deleteButton}
			</div>
		);
	} else {
		return "";
	}
}
