import MemberCard from "../components/MemberCard";
import PendingInvitationsList from "../components/PendingInvitationsList";
import SectionTitle from "../components/SectionTitle";
import { useEffect, useState } from "react";
import SendInvitesDialog from "../components/SendInvitesDialog";
import InvitationApi from "../api/InvitationApi";
import TeamApi from "../api/TeamApi";
import { useSelector } from "react-redux";
import { selectCurrentTeam, selectCurrentUser } from "../store/authSlice";
import Button from "../components/Button";
import PageTitle from "../components/PageTitle";
import MemberMenu from "../components/mobile menus/MemberMenu";

export default function MembersIndexPage() {
	useEffect(() => (document.title = "Members"), []);
	const [showInvitationDialog, setShowInvitationDialog] = useState(false);
	const [loadingInvitations, setLoadingInvitations] = useState(false);
	const [members, setMembers] = useState([]);
	const [invitations, setInvitations] = useState([]);
	const currentUser = useSelector(selectCurrentUser);
	const currentTeam = useSelector(selectCurrentTeam);
	const [memberBeingViewed, setMemberBeingViewed] = useState(null);

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

	const handleAdminChanged = (memberId, isAdmin) => {
		let membersCopy = Array.from(members);
		let memberChanged = membersCopy.find((member) => member.id === memberId);
		memberChanged.is_admin = isAdmin;
		setMembers(membersCopy);
	};

	const handleMemberRemoved = (memberIdToRemove) => {
		let filteredMembers = members.filter((member) => member.id !== memberIdToRemove);
		setMembers(filteredMembers);
	};

	const handlePositionChanged = (userId, newPosition) => {
		let membersCopy = members.slice();
		let memberToUpdateIndex = members.findIndex((member) => member.id === userId);
		let updatedMember = membersCopy[memberToUpdateIndex];
		updatedMember.position = newPosition;
		membersCopy.splice(memberToUpdateIndex, 1, updatedMember);
		setMembers(membersCopy);
	};

	if (currentUser) {
		const memberCards = members.map((member) => (
			<MemberCard
				key={member.id}
				member={member}
				isCurrentUser={currentUser.id === member.id}
				onPositionChanged={(newPosition) => handlePositionChanged(member.id, newPosition)}
				onShowMemberMenu={() => setMemberBeingViewed(member)}
			/>
		));
		return (
			<>
				<div className="mb-10">
					<PageTitle title={currentTeam?.name} />

					<div className="flex-between">
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
				</div>

				<SendInvitesDialog
					open={showInvitationDialog}
					onCloseDialog={() => setShowInvitationDialog(false)}
					currentMembers={members}
					onInviteSent={handleInviteSent}
				/>

				<MemberMenu
					open={Boolean(memberBeingViewed)}
					onCloseDialog={() => setMemberBeingViewed(null)}
					member={memberBeingViewed}
					onRemoved={handleMemberRemoved}
					onAdminStatusChanged={handleAdminChanged}
				/>
			</>
		);
	} else {
		return "Loading ...";
	}
}
