import StyledDialog from "./StyledDialog";
import AddCancelActions from "./buttons/AddCancelActions";
import { useState } from "react";
import OutlinedInput from "./inputs/OutlinedInput";

export default function SendInvitesDialog({ open, onCloseDialog, currentMembers }) {
	const [newMemberEmail, setNewMemberEmail] = useState("");
	const currentMemberEmails = currentMembers.map((member) => member.email);

	const handleCloseDialog = () => {
		setNewMemberEmail("");
		onCloseDialog();
	};

	const canSendInvite = newMemberEmail !== "" && !currentMemberEmails.includes(newMemberEmail);

	return (
		<StyledDialog open={open} onCloseDialog={handleCloseDialog} title="Invite a new member">
			<div className="mb-4">
				<OutlinedInput placeholder="Email" value={newMemberEmail} onChange={setNewMemberEmail} />
			</div>
			<AddCancelActions
				addText="Send invite"
				addDisabled={!canSendInvite}
				onCancel={handleCloseDialog}
			/>
		</StyledDialog>
	);
}
