import SectionTitle from "./SectionTitle";
import TableHead from "./TableHead";
import TableRow from "./TableRow";

export default function PendingInvitationsList() {
	return (
		<>
			<SectionTitle title="Pending invitations" />
			<table className="w-full">
				<TableHead columns={["EMAIL", "SENT"]} />

				<tbody>
					{invitations?.map((invitation) => (
						<TableRow
							columns={[invitation.email, invitation.created_at?.toDateString()]}
							key={invitation.id}
						/>
					))}
				</tbody>
			</table>
		</>
	);
}

const invitations = [
	{
		id: 1,
		email: "sidorchukandrew@gmail.com",
		created_at: new Date(new Date().setDate(2)),
	},
	{ id: 2, email: "tpototsky@gmail.com", created_at: new Date(new Date().setDate(5)) },
];
