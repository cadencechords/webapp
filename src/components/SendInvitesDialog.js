import StyledDialog from "./StyledDialog";
import AddCancelActions from "./buttons/AddCancelActions";
import { useState } from "react";
import OutlinedInput from "./inputs/OutlinedInput";
import InvitationApi from "../api/InvitationApi";

export default function SendInvitesDialog({ open, onCloseDialog, currentMembers, onInviteSent }) {
	const [newMemberEmail, setNewMemberEmail] = useState("");
	const [sendingInvitation, setSendingInvitation] = useState(false);

	const currentMemberEmails = currentMembers.map((member) => member.email);

	const handleCloseDialog = () => {
		setNewMemberEmail("");
		setSendingInvitation(false);
		onCloseDialog();
	};

	const handleSendInvite = async () => {
		setSendingInvitation(true);

		try {
			let { data } = await InvitationApi.createOne({ email: newMemberEmail });
			onInviteSent(data);
			handleCloseDialog();
		} catch (error) {
			console.log(error);
			setSendingInvitation(false);
		}
	};

	const canSendInvite = newMemberEmail !== "" && !currentMemberEmails.includes(newMemberEmail);

	return (
		<StyledDialog open={open} onCloseDialog={handleCloseDialog} title="Invite a new member">
			<div className="mb-4">
				<OutlinedInput
					placeholder="Email"
					value={newMemberEmail}
					onChange={setNewMemberEmail}
					type="email"
				/>
			</div>
			<AddCancelActions
				addText="Send invite"
				addDisabled={!canSendInvite}
				loadingAdd={sendingInvitation}
				onCancel={handleCloseDialog}
				onAdd={handleSendInvite}
			/>
		</StyledDialog>
	);
}
