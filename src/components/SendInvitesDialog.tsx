import AddCancelActions from './buttons/AddCancelActions';
import InvitationApi from '../api/InvitationApi';
import OutlinedInput from './inputs/OutlinedInput';
import StyledDialog from './StyledDialog';
import { reportError } from '../utils/error';
import { useState } from 'react';
import type { Invitation, User } from '../types';

type SendInvitesDialogProps = {
  open: boolean;
  onCloseDialog: () => void;
  /** The team's members, whose emails can't be invited again. */
  currentMembers: User[];
  onInviteSent: (invitation: Invitation) => void;
};

export default function SendInvitesDialog({
  open,
  onCloseDialog,
  currentMembers,
  onInviteSent,
}: SendInvitesDialogProps) {
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [sendingInvitation, setSendingInvitation] = useState(false);

  const currentMemberEmails = currentMembers.map(member => member.email);

  const handleCloseDialog = () => {
    setNewMemberEmail('');
    setSendingInvitation(false);
    onCloseDialog();
  };

  const handleSendInvite = async () => {
    setSendingInvitation(true);

    try {
      // Non-null: createOne returns undefined only when it's given no
      // invitation, and it's always given one here.
      const { data } = (await InvitationApi.createOne({
        email: newMemberEmail,
      }))!;
      onInviteSent(data);
      handleCloseDialog();
    } catch (error) {
      reportError(error);
      setSendingInvitation(false);
    }
  };

  const canSendInvite =
    newMemberEmail !== '' && !currentMemberEmails.includes(newMemberEmail);

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
        loadingAdd={sendingInvitation}
        onCancel={handleCloseDialog}
        onAdd={handleSendInvite}
      />
    </StyledDialog>
  );
}
