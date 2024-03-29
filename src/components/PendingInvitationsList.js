import { ADD_MEMBERS } from '../utils/constants';
import Button from './Button';
import InvitationApi from '../api/InvitationApi';
import NoDataMessage from './NoDataMessage';
import SectionTitle from './SectionTitle';
import TableHead from './TableHead';
import TableRow from './TableRow';
import XIcon from '@heroicons/react/outline/XIcon';
import { reportError } from '../utils/error';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';

export default function PendingInvitationsList({
  invitations,
  loading,
  onInvitationDeleted,
}) {
  const currentMember = useSelector(selectCurrentMember);
  const handleDeleteInvitation = async invitationId => {
    try {
      await InvitationApi.deleteOne(invitationId);
      onInvitationDeleted(invitationId);
    } catch (error) {
      reportError(error);
    }
  };

  const handleResendInvitation = async invitationId => {
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
              let actions = currentMember.can(ADD_MEMBERS) && (
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
                    <XIcon className="h-4" />
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
