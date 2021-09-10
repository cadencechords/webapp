import { selectCurrentMember, selectCurrentUser } from "../../store/authSlice";

import MobileMenuButton from "../buttons/MobileMenuButton";
import { REMOVE_MEMBERS } from "../../utils/constants";
import ShieldCheckIcon from "@heroicons/react/outline/ShieldCheckIcon";
import ShieldExclamationIcon from "@heroicons/react/outline/ShieldExclamationIcon";
import StyledDialog from "../StyledDialog";
import UserApi from "../../api/UserApi";
import UserRemoveIcon from "@heroicons/react/outline/UserRemoveIcon";
import { useSelector } from "react-redux";

export default function MemberMenu({
	onCloseDialog,
	open,
	member,
	onAdminStatusChanged,
	onRemoved,
}) {
	const currentUser = useSelector(selectCurrentUser);
	const currentMember = useSelector(selectCurrentMember);

	const handleChangeAdminStatus = async (isAdmin) => {
		try {
			await UserApi.updateMembership(member.id, { isAdmin });
			onAdminStatusChanged(member.id, isAdmin);
		} catch (error) {
			console.log(error);
		} finally {
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

	let adminButton = currentUser.is_admin && (
		<MobileMenuButton full onClick={() => handleChangeAdminStatus(!member.is_admin)}>
			<div className="flex items-center">
				{member?.is_admin ? (
					<>
						<ShieldExclamationIcon className="mr-4 h-5" />
						Remove admin
					</>
				) : (
					<>
						<ShieldCheckIcon className="mr-4 h-5" />
						Make admin
					</>
				)}
			</div>
		</MobileMenuButton>
	);

	let removeFromTeamButton = currentMember.can(REMOVE_MEMBERS) && (
		<MobileMenuButton full color="red" onClick={handleRemoveFromTeam}>
			<div className="flex items-center">
				<UserRemoveIcon className="mr-4 h-5" />
				Remove from team
			</div>
		</MobileMenuButton>
	);

	const hasName = () => {
		return member.first_name && member.last_name;
	};

	if (member) {
		return (
			<StyledDialog
				onCloseDialog={onCloseDialog}
				open={open}
				title={hasName() ? member.first_name + " " + member.last_name : member.email}
				fullscreen={false}
			>
				{adminButton}
				{removeFromTeamButton}
			</StyledDialog>
		);
	} else {
		return null;
	}
}
