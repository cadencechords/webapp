import AddCancelActions from "./buttons/AddCancelActions";
import InvitationApi from "../api/InvitationApi";
import OutlinedInput from "./inputs/OutlinedInput";
import StyledDialog from "./StyledDialog";
import { useState } from "react";

export default function SendInvitesDialog({
  open,
  onCloseDialog,
  currentMembers,
  onInviteSent,
}) {
  const [newMemberEmail, setNewMemberEmail] = useState("");

  const currentMemberEmails = currentMembers.map((member) => member.email);

  const handleCloseDialog = () => {
    setNewMemberEmail("");

    onCloseDialog();
  };

  const handleSendInvite = () => {
    let { data } = InvitationApi.createOne({ email: newMemberEmail });
    onInviteSent(data);
    handleCloseDialog();
  };

  const canSendInvite =
    newMemberEmail !== "" && !currentMemberEmails.includes(newMemberEmail);

  return (
    <StyledDialog
      open={open}
      onCloseDialog={handleCloseDialog}
      title="Invite a new member"
    >
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
        onCancel={handleCloseDialog}
        onAdd={handleSendInvite}
      />
    </StyledDialog>
  );
}
