import { useState } from 'react';

import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import StyledDialog from '../components/StyledDialog';
import { useParams } from 'react-router';
import useTeamMembers from '../hooks/api/useTeamMembers';
import useAddMembersToRole from '../hooks/api/useAddMembersToRole';
import PageLoading from '../components/PageLoading';
import Alert from '../components/Alert';

export default function AddMembersToRoleDialog({
  membersInRole,
  open,
  onCloseDialog,
}) {
  const { data: teamMembers, isLoading, isError, isSuccess } = useTeamMembers();
  const [membersToAdd, setMembersToAdd] = useState([]);
  const { run: addMembersToRole, isLoading: isSaving } = useAddMembersToRole({
    onSuccess: handleClose,
  });
  const id = useParams().id;

  function membersNotInRole() {
    let membersInRoleIds = membersInRole?.map(member => member.id) || [];
    return teamMembers.filter(
      teamMember => !membersInRoleIds.includes(teamMember.id)
    );
  }

  function handleMemberToggled(member, checked) {
    if (checked) {
      setMembersToAdd(currentMembers => [...currentMembers, member.id]);
    } else {
      setMembersToAdd(currentMemberIds =>
        currentMemberIds.filter(memberId => memberId !== member.id)
      );
    }
  }

  async function handleSaveAddedMembers() {
    addMembersToRole({ memberIds: membersToAdd, roleId: id });
  }

  function handleClose() {
    setMembersToAdd([]);
    onCloseDialog();
  }

  return (
    <StyledDialog
      open={open}
      onCloseDialog={handleClose}
      title="Add members"
      fullscreen={false}
    >
      <div>
        {isLoading && <PageLoading />}
        {isError && (
          <Alert color="red">
            There was an issue getting the members on this team
          </Alert>
        )}
        {isSuccess &&
          membersNotInRole().map(member => (
            <div
              className="gap-4 py-3 border-b cursor-pointer flex-between dark:border-dark-gray-400 last:border-b-0"
              key={member.id}
            >
              <Checkbox
                checked={membersToAdd.includes(member.id)}
                onChange={checked => handleMemberToggled(member, checked)}
              />
              <button
                className="w-full text-left outline-none focus:outline-none"
                onClick={() =>
                  handleMemberToggled(member, !membersToAdd.includes(member.id))
                }
              >
                {member.user.email}
              </button>
            </div>
          ))}
      </div>
      <div className="flex gap-4 mt-8">
        <Button full variant="open" color="gray" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          loading={isSaving}
          full
          disabled={membersToAdd.length === 0}
          onClick={handleSaveAddedMembers}
        >
          Save
        </Button>
      </div>
    </StyledDialog>
  );
}
