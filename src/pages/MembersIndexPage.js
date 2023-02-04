import {
  selectCurrentMember,
  selectCurrentTeam,
  selectCurrentUser,
} from '../store/authSlice';
import { useEffect, useState } from 'react';

import { ADD_MEMBERS } from '../utils/constants';
import Button from '../components/Button';
import InvitationApi from '../api/InvitationApi';
import MemberCard from '../components/MemberCard';
import MemberMenu from '../components/mobile menus/MemberMenu';
import PageTitle from '../components/PageTitle';
import PendingInvitationsList from '../components/PendingInvitationsList';
import SectionTitle from '../components/SectionTitle';
import SendInvitesDialog from '../components/SendInvitesDialog';
import TeamApi from '../api/TeamApi';
import { reportError } from '../utils/error';
import { useSelector } from 'react-redux';
import JoinLinkSection from '../components/JoinLinkSection';

export default function MembersIndexPage() {
  useEffect(() => (document.title = 'Members'), []);
  const [showInvitationDialog, setShowInvitationDialog] = useState(false);
  const [loadingInvitations, setLoadingInvitations] = useState(false);
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const currentUser = useSelector(selectCurrentUser);
  const currentTeam = useSelector(selectCurrentTeam);
  const [memberBeingViewed, setMemberBeingViewed] = useState(null);
  const currentMember = useSelector(selectCurrentMember);

  useEffect(() => {
    async function fetchInvitations() {
      try {
        setLoadingInvitations(true);
        let { data } = await InvitationApi.getAll();
        setInvitations(data);
      } catch (error) {
        reportError(error);
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
        reportError(error);
      }
    }

    fetchTeamDetails();
  }, []);

  const handleInviteSent = newInvite => {
    setInvitations([...invitations, newInvite]);
  };

  const handleInvitationDeleted = deletedInvitationId => {
    let updatedInvitesList = invitations.filter(
      invitation => invitation.id !== deletedInvitationId
    );

    setInvitations(updatedInvitesList);
  };

  const handleMemberRemoved = memberIdToRemove => {
    let filteredMembers = members.filter(
      member => member.id !== memberIdToRemove
    );
    setMembers(filteredMembers);
  };

  const handlePositionChanged = (userId, newPosition) => {
    let membersCopy = members.slice();
    let memberToUpdateIndex = members.findIndex(member => member.id === userId);
    let updatedMember = membersCopy[memberToUpdateIndex];
    updatedMember.position = newPosition;
    membersCopy.splice(memberToUpdateIndex, 1, updatedMember);
    setMembers(membersCopy);
  };

  if (currentUser) {
    const memberCards = members.map(member => (
      <MemberCard
        key={member.id}
        member={member}
        isCurrentUser={currentUser.id === member.id}
        onPositionChanged={newPosition =>
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
              <Button
                onClick={() => setShowInvitationDialog(true)}
                className="w-32"
              >
                Send an invite
              </Button>
            )}
          </div>
          {currentMember.can(ADD_MEMBERS) && (
            <JoinLinkSection team={currentTeam} />
          )}
          <div className="grid grid-cols-1 my-5 sm:grid-cols-2 lg:grid-cols-3 gap-7">
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
        />
      </>
    );
  } else {
    return 'Loading ...';
  }
}
