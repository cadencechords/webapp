import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";

import PageLoading from "../components/PageLoading";
import Button from "../components/Button";
import UserApi from "../api/UserApi";
import ProfilePicture from "../components/ProfilePicture";
import { toMonthYearDate } from "../utils/DateUtils";
import { selectCurrentUser } from "../store/authSlice";
import MemberMenu from "../components/mobile menus/MemberMenu";
import Alert from "../components/Alert";

export default function MemberDetail() {
	const { id } = useParams();
	const [member, setMember] = useState();
	const [loadingMember, setLoadingMember] = useState(true);
	const currentUser = useSelector(selectCurrentUser);
	const [memberMenuOpen, setMemberMenuOpen] = useState(false);
	const [alert, setAlert] = useState();
	const router = useHistory();

	useEffect(() => {
		async function fetchTeamMember() {
			try {
				let { data } = await UserApi.getMember(id);
				setMember(data);
			} catch (error) {
				console.log(error);
			} finally {
				setLoadingMember(false);
			}
		}

		fetchTeamMember();
	}, [id]);

	const hasName = () => {
		return member?.first_name && member?.last_name;
	};

	const getFullName = () => {
		return `${member.first_name} ${member.last_name}`;
	};

	const handleAdminStatusChanged = (memberId, isAdmin) => {
		setMemberMenuOpen(false);
		setMember((currentMember) => ({ ...currentMember, is_admin: isAdmin }));
	};

	const handleMemberRemoved = () => {
		setMemberMenuOpen(false);
		setAlert(
			"You have just removed this member. You will be redirected to the members page shortly."
		);
		setTimeout(() => {
			router.push("/members");
		}, 4000);
	};

	if (loadingMember) {
		return <PageLoading>Loading profile</PageLoading>;
	} else {
		return (
			<>
				<div className="mx-auto max-w-sm mt-4">
					{alert && (
						<div className="mb-4">
							<Alert color="yellow">{alert}</Alert>
						</div>
					)}
					<div className="text-2xl font-bold mb-1 text-center">
						{hasName() ? getFullName() : member.email}
					</div>
					<div className="text-gray-600 text-lg mb-4 text-center">
						{hasName() ? member.email : "No name provided yet"}
					</div>
					<div className="mb-2 flex-center">
						<ProfilePicture url={member.image_url} />
					</div>
					{member.is_admin && (
						<div className="text-center">
							<span className="rounded-full px-3 py-0.5 bg-blue-600 text-white text-xs inline-block mb-4">
								Admin
							</span>
						</div>
					)}
					<div className="text-sm mb-4">
						<div className="text-gray-600 flex-between border-b pb-2">
							<div className="font-semibold">Position:</div>
							{member?.position ? member.position : "No position provided yet"}
						</div>
						<div className="text-gray-600 flex-between py-2">
							<div className="font-semibold">Joined:</div>
							{toMonthYearDate(member.created_at)}
						</div>
					</div>
					{currentUser.is_admin && (
						<Button full variant="outlined" onClick={() => setMemberMenuOpen(true)}>
							Actions
						</Button>
					)}
					<MemberMenu
						open={memberMenuOpen}
						onCloseDialog={() => setMemberMenuOpen(false)}
						member={member}
						onAdminStatusChanged={handleAdminStatusChanged}
						onRemoved={handleMemberRemoved}
					/>
				</div>
			</>
		);
	}
}
