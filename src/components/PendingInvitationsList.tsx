import { ADD_MEMBERS } from '../utils/constants';
import Button from './Button';
import InvitationApi from '../api/InvitationApi';
import NoDataMessage from './NoDataMessage';
import ProfilePicture from './ProfilePicture';
import { LIST_ITEM_TWO_LINE, LIST_SUPPORTING_TEXT } from './lists/listItem';
import { reportError } from '../utils/error';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import Icon from './Icon';
import type { Invitation } from '../types';

type PendingInvitationsListProps = {
  invitations: Invitation[];
  loading: boolean;
  onInvitationDeleted: (invitationId: number) => void;
};

export default function PendingInvitationsList({
  invitations,
  loading,
  onInvitationDeleted,
}: PendingInvitationsListProps) {
  // Non-null: MembersIndexPage renders inside Content, which renders nothing
  // until the membership loads.
  const currentMember = useSelector(selectCurrentMember)!;
  const handleDeleteInvitation = async (invitationId: number) => {
    try {
      await InvitationApi.deleteOne(invitationId);
      onInvitationDeleted(invitationId);
    } catch (error) {
      reportError(error);
    }
  };

  const handleResendInvitation = async (invitationId: number) => {
    try {
      await InvitationApi.resendOne(invitationId);
    } catch (error) {
      reportError(error);
    }
  };

  // An M3E segmented list: a two-line item per invitation, with the email's
  // monogram, when it was sent, and (for members who can add members) a
  // Resend text button and a cancel icon button.
  if (invitations.length === 0)
    return (
      <NoDataMessage compact loading={loading}>
        No pending invitations
      </NoDataMessage>
    );

  return (
    <ul className="list-segmented">
      {invitations.map(invitation => (
        <li key={invitation.id} className={LIST_ITEM_TWO_LINE}>
          <ProfilePicture name={invitation.email} size="md" />
          <div className="flex-1 min-w-0">
            <div className="truncate">{invitation.email}</div>
            <div className={LIST_SUPPORTING_TEXT}>
              Sent {formatSent(invitation.created_at)}
            </div>
          </div>
          {currentMember.can(ADD_MEMBERS) && (
            <div className="flex items-center gap-1 shrink-0 -mr-2">
              <Button
                variant="open"
                size="sm"
                onClick={() => handleResendInvitation(invitation.id)}
              >
                Resend
              </Button>
              <Button
                variant="icon"
                color="gray"
                size="md"
                name={`Cancel the invitation to ${invitation.email}`}
                onClick={() => handleDeleteInvitation(invitation.id)}
              >
                <Icon name="close" className="w-5 h-5" />
              </Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

/** "Jul 2, 2022" */
function formatSent(createdAt: string) {
  return new Date(createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
