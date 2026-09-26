import { ADD_MEMBERS } from '../utils/constants';
import Button from './Button';
import InvitationApi from '../api/InvitationApi';
import NoDataMessage from './NoDataMessage';
import SectionTitle from './SectionTitle';
import TableHead from './TableHead';
import TableRow from './TableRow';
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

  return (
    <>
      <SectionTitle title="Pending invitations" />
      {invitations.length === 0 ? (
        <NoDataMessage loading={loading}>No pending invitations</NoDataMessage>
      ) : (
        <table className="w-full">
          <TableHead columns={['EMAIL', 'SENT', '']} />
          <tbody>
            {invitations?.map(invitation => {
              const actions = currentMember.can(ADD_MEMBERS) && (
                <div className="flex items-center">
                  <span className="mr-2">
                    <Button
                      variant="open"
                      size="xs"
                      onClick={() => handleResendInvitation(invitation.id)}
                    >
                      Resend
                    </Button>
                  </span>
                  <Button
                    variant="icon"
                    size="sm"
                    color="gray"
                    onClick={() => handleDeleteInvitation(invitation.id)}
                  >
                    <Icon name="close" className="h-4" />
                  </Button>
                </div>
              );
              return (
                <TableRow
                  columns={[
                    invitation.email,
                    new Date(invitation.created_at).toDateString(),
                  ]}
                  key={invitation.id}
                  actions={actions}
                />
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}
