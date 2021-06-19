import StyledDialog from "../StyledDialog";
import MobileMenuButton from "../buttons/MobileMenuButton";
import UserRemoveIcon from "@heroicons/react/outline/UserRemoveIcon";
import ShieldCheckIcon from "@heroicons/react/outline/ShieldCheckIcon";
import ShieldExclamationIcon from "@heroicons/react/outline/ShieldExclamationIcon";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/authSlice";
import UserApi from "../../api/UserApi";

export default function MemberMenu({
	onCloseDialog,
	open,
	member,
	onAdminStatusChanged,
	onRemoved,
}) {
	const currentUser = useSelector(selectCurrentUser);

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

	let adminButton = null;
	let removeFromTeamButton = null;

	if (currentUser.is_admin && member) {
		adminButton = (
			<MobileMenuButton full onClick={() => handleChangeAdminStatus(!member.is_admin)}>
				<div className="flex items-center">
					{member.is_admin ? (
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

		removeFromTeamButton = (
			<MobileMenuButton full color="red" onClick={handleRemoveFromTeam}>
				<div className="flex items-center">
					<UserRemoveIcon className="mr-4 h-5" />
					Remove from team
				</div>
			</MobileMenuButton>
		);
	}

	if (member) {
		return (
			<StyledDialog
				onCloseDialog={onCloseDialog}
				open={open}
				title={member.first_name + " " + member.last_name}
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
