import SectionTitle from "./SectionTitle";
import TableHead from "./TableHead";
import TableRow from "./TableRow";
import XIcon from "@heroicons/react/outline/XIcon";
import NoDataMessage from "./NoDataMessage";
import InvitationApi from "../api/InvitationApi";
import Button from "./Button";

export default function PendingInvitationsList({ invitations, loading, onInvitationDeleted }) {
	const handleDeleteInvitation = async (invitationId) => {
		try {
			await InvitationApi.deleteOne(invitationId);
			onInvitationDeleted(invitationId);
		} catch (error) {
			console.log(error);
		}
	};

	const handleResendInvitation = async (invitationId) => {
		try {
			await InvitationApi.resendOne(invitationId);
		} catch (error) {
			console.log(error);
		}
	};

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
							let actions = (
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
									columns={[invitation.email, new Date(invitation.created_at).toDateString()]}
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
