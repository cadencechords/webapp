import { ADD_MEMBERS } from "../utils/constants";
import Button from "./Button";
import InvitationApi from "../api/InvitationApi";
import NoDataMessage from "./NoDataMessage";
import SectionTitle from "./SectionTitle";
import TableHead from "./TableHead";
import TableRow from "./TableRow";
import XIcon from "@heroicons/react/outline/XIcon";
import { selectCurrentMember } from "../store/authSlice";
import { useSelector } from "react-redux";

export default function PendingInvitationsList({
  invitations,
  loading,
  onInvitationDeleted,
}) {
  const currentMember = useSelector(selectCurrentMember);

  const handleDeleteInvitation = (invitationId) => {
    InvitationApi.deleteOne(invitationId);
    onInvitationDeleted(invitationId);
  };

  const handleResendInvitation = (invitationId) => {};

  return (
    <>
      <SectionTitle title="Pending invitations" />
      {invitations.length === 0 ? (
        <NoDataMessage loading={loading}>No pending invitations</NoDataMessage>
      ) : (
        <table className="w-full">
          <TableHead columns={["EMAIL", "SENT", ""]} />
          <tbody>
            {invitations?.map((invitation) => {
              let actions = currentMember.can(ADD_MEMBERS) && (
                <div className="flex items-center">
                  <span className="mr-2">
                    <Button
                      variant="outlined"
                      size="xs"
                      color="black"
                      onClick={() => handleResendInvitation(invitation.id)}
                    >
                      Resend
                    </Button>
                  </span>
                  <Button
                    variant="open"
                    size="xs"
                    color="black"
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
