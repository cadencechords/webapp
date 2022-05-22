import { useState } from "react";

import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import StyledDialog from "../components/StyledDialog";
import { useParams } from "react-router";
import MembershipsApi from "../api/membershipsApi";

export default function AddMembersToRoleDialog({
  membersInRole,
  open,
  onCloseDialog,
  onMembersAdded,
}) {
  const [teamMembers] = useState(() => MembershipsApi.getAllWithoutMe().data);
  const [membersToAdd, setMembersToAdd] = useState([]);
  const id = useParams().id;
  const [saving, setSaving] = useState(false);

  function membersNotInRole() {
    let membersInRoleIds = membersInRole?.map((member) => member.id) || [];
    return teamMembers.filter(
      (teamMember) => !membersInRoleIds.includes(teamMember.id)
    );
  }

  function handleMemberToggled(member, checked) {
    if (checked) {
      setMembersToAdd((currentMembers) => [...currentMembers, member.id]);
    } else {
      setMembersToAdd((currentMemberIds) =>
        currentMemberIds.filter((memberId) => memberId !== member.id)
      );
    }
  }

  function handleSaveAddedMembers() {
    let { data } = MembershipsApi.assignBulkRole(membersToAdd, id);
    onMembersAdded(data);
    handleClose();
  }

  function handleClose() {
    setMembersToAdd([]);
    setSaving(false);
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
        {membersNotInRole().map((member) => (
          <div
            className="flex-between gap-4 cursor-pointer py-3 border-b dark:border-dark-gray-400 last:border-b-0"
            key={member.id}
          >
            <Checkbox
              checked={membersToAdd.includes(member.id)}
              onChange={(checked) => handleMemberToggled(member, checked)}
            />
            <button
              className="w-full text-left outline-none focus:outline-none"
              onClick={() =>
                handleMemberToggled(member, !membersToAdd.includes(member.id))
              }
            >
              {member.email}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 gap-4 flex">
        <Button full variant="open" color="gray" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          loading={saving}
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
