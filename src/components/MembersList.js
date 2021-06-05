import MemberCard from "./MemberCard";
import PendingInvitationsList from "./PendingInvitationsList";
import SectionTitle from "./SectionTitle";
import { useEffect, useState } from "react";
import SendInvitesDialog from "./SendInvitesDialog";
import InvitationApi from "../api/InvitationApi";
import TeamApi from "../api/TeamApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/authSlice";
import Button from "./Button";

export default function MembersList() {
	useEffect(() => (document.title = "Members"), []);
	const [showInvitationDialog, setShowInvitationDialog] = useState(false);
	const [loadingInvitations, setLoadingInvitations] = useState(false);
	const [members, setMembers] = useState([]);
	const [invitations, setInvitations] = useState([]);
	const currentUser = useSelector(selectCurrentUser);

	useEffect(() => {
		async function fetchInvitations() {
			try {
				setLoadingInvitations(true);
				let { data } = await InvitationApi.getAll();
				setInvitations(data);
			} catch (error) {
				console.log(error);
			} finally {
				setLoadingInvitations(false);
			}
		}

		fetchInvitations();
	}, []);

	useEffect(() => {
		async function fetchTeamDetails() {
			try {
				let { data } = await TeamApi.getCurrentTeam();
				setMembers(data.members);
			} catch (error) {
				console.log(error);
			}
		}

		fetchTeamDetails();
	}, []);

	const handleInviteSent = (newInvite) => {
		setInvitations([...invitations, newInvite]);
	};

	const handleInvitationDeleted = (deletedInvitationId) => {
		let updatedInvitesList = invitations.filter(
			(invitation) => invitation.id !== deletedInvitationId
		);

		setInvitations(updatedInvitesList);
	};

	if (currentUser) {
		const memberCards = members.map((member) => (
			<MemberCard key={member.id} member={member} isCurrentUser={currentUser.id === member.id} />
		));
		return (
			<>
				<div className="flex items-center justify-between">
					<SectionTitle title="Current members" />
					<Button onClick={() => setShowInvitationDialog(true)}>Send an invite</Button>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 my-5">
					{memberCards}
				</div>

				<PendingInvitationsList
					invitations={invitations}
					loading={loadingInvitations}
					onInvitationDeleted={handleInvitationDeleted}
				/>

				<SendInvitesDialog
					open={showInvitationDialog}
					onCloseDialog={() => setShowInvitationDialog(false)}
					currentMembers={members}
					onInviteSent={handleInviteSent}
				/>
			</>
		);
	} else {
		return "Loading ...";
	}
}
