import { useEffect, useState } from "react";

import Alert from "../components/Alert";
import Button from "../components/Button";
import MemberMenu from "../components/mobile menus/MemberMenu";
import PageLoading from "../components/PageLoading";
import ProfilePicture from "../components/ProfilePicture";
import UserApi from "../api/UserApi";
import { reportError } from "../utils/error";
import { toMonthYearDate } from "../utils/DateUtils";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";

export default function MemberDetail() {
	const { id } = useParams();
	const [member, setMember] = useState();
	const [loadingMember, setLoadingMember] = useState(true);
	const [memberMenuOpen, setMemberMenuOpen] = useState(false);
	const [alert, setAlert] = useState();
	const router = useHistory();

	useEffect(() => {
		async function fetchTeamMember() {
			try {
				let { data } = await UserApi.getMember(id);
				setMember(data);
			} catch (error) {
				reportError(error);
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
					<div className="text-gray-600 dark:text-dark-gray-200 text-lg mb-4 text-center">
						{hasName() ? member.email : "No name provided yet"}
					</div>
					<div className="mb-2 flex-center">
						<ProfilePicture url={member.image_url} />
					</div>

					<div className="text-sm mb-4">
						<div className="text-gray-600 dark:text-dark-gray-200 flex-between border-b dark:border-dark-gray-600 pb-2">
							<div className="font-semibold">Position:</div>
							{member?.position ? member.position : "No position provided yet"}
						</div>
						<div className="text-gray-600 dark:text-dark-gray-200 flex-between py-2">
							<div className="font-semibold">Joined:</div>
							{toMonthYearDate(member.created_at)}
						</div>
					</div>
					<Button full variant="outlined" onClick={() => setMemberMenuOpen(true)}>
						Actions
					</Button>
					<MemberMenu
						open={memberMenuOpen}
						onCloseDialog={() => setMemberMenuOpen(false)}
						member={member}
						onRemoved={handleMemberRemoved}
					/>
				</div>
			</>
		);
	}
}
