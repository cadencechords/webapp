import {
  selectCurrentMember,
  selectCurrentTeam,
  selectCurrentUser,
} from "../store/authSlice";
import { useEffect, useState } from "react";

import { ADD_MEMBERS } from "../utils/constants";
import Button from "../components/Button";
import InvitationApi from "../api/InvitationApi";
import MemberCard from "../components/MemberCard";
import MemberMenu from "../components/mobile menus/MemberMenu";
import PageTitle from "../components/PageTitle";
import PendingInvitationsList from "../components/PendingInvitationsList";
import SectionTitle from "../components/SectionTitle";
import SendInvitesDialog from "../components/SendInvitesDialog";
import { useSelector } from "react-redux";

export default function MembersIndexPage() {
  useEffect(() => (document.title = "Members"), []);
  const [showInvitationDialog, setShowInvitationDialog] = useState(false);
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const currentUser = useSelector(selectCurrentUser);
  const currentTeam = useSelector(selectCurrentTeam);
  const [memberBeingViewed, setMemberBeingViewed] = useState(null);
  const currentMember = useSelector(selectCurrentMember);

  useEffect(() => {
    let { data } = InvitationApi.getAll();
    setInvitations(data);
  }, []);

  useEffect(() => {
    setMembers(currentTeam.members);
  }, [currentTeam]);

  const handleInviteSent = (newInvite) => {
    setInvitations([...invitations, newInvite]);
  };

  const handleInvitationDeleted = (deletedInvitationId) => {
    let updatedInvitesList = invitations.filter(
      (invitation) => invitation.id !== deletedInvitationId
    );

    setInvitations(updatedInvitesList);
  };

  const handleMemberRemoved = (memberIdToRemove) => {
    let filteredMembers = members.filter(
      (member) => member.id !== memberIdToRemove
    );
    setMembers(filteredMembers);
  };

  const handlePositionChanged = (userId, newPosition) => {
    let me = members.find((m) => m.id === userId);
    setMembers((currentMembers) => {
      return currentMembers.map((m) =>
        m.id === me.id ? { ...me, position: newPosition } : m
      );
    });
  };

  if (currentUser) {
    const memberCards = members.map((member) => (
      <MemberCard
        key={member.id}
        member={member}
        isCurrentUser={currentUser.id === member.id}
        onPositionChanged={(newPosition) =>
          handlePositionChanged(member.id, newPosition)
        }
        onShowMemberMenu={() => setMemberBeingViewed(member)}
      />
    ));
    return (
      <>
        <div className="mb-10">
          <PageTitle title={currentTeam?.name} />

          <div className="flex-between">
            <SectionTitle title="Current members" />
            {currentMember.can(ADD_MEMBERS) && (
              <Button onClick={() => setShowInvitationDialog(true)}>
                Send an invite
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 my-5">
            {memberCards}
          </div>

          <PendingInvitationsList
            invitations={invitations}
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
          isCurrentUser={currentUser.id === memberBeingViewed?.id}
          open={Boolean(memberBeingViewed)}
          onCloseDialog={() => setMemberBeingViewed(null)}
          member={memberBeingViewed}
          onRemoved={handleMemberRemoved}
        />
      </>
    );
  } else {
    return "Loading ...";
  }
}
