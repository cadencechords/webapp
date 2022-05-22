import { useCallback, useEffect } from "react";

import { ASSIGN_ROLES } from "../utils/constants";
import AddMembersToRoleDialog from "../dialogs/AddMembersToRoleDialog";
import Button from "./Button";
import MembershipsApi from "../api/membershipsApi";
import NoDataMessage from "./NoDataMessage";
import SectionTitle from "./SectionTitle";
import Table from "./Table";
import TrashIcon from "@heroicons/react/outline/TrashIcon";
import { selectCurrentMember } from "../store/authSlice";
import { useSelector } from "react-redux";
import { useState } from "react";
import RolesApi from "../api/rolesApi";

export default function RoleMembers({
  role,
  members,
  onMemberRemoved,
  onMembersAdded,
}) {
  const [rows, setRows] = useState([]);
  const currentMember = useSelector(selectCurrentMember);
  const [showAddMembersDialog, setShowAddMembersDialog] = useState(false);
  const [me] = useState(() => MembershipsApi.getMyMember().data);

  const handleRemoveMemberFromRole = useCallback(
    (member) => {
      const roles = RolesApi.getAll().data;
      const memberRole = roles.find((r) => r.name === "Member");

      onMemberRemoved(member);
      MembershipsApi.assignRole(member.id, memberRole.id);
    },
    [onMemberRemoved]
  );

  useEffect(() => {
    if (members) {
      let rows = members.map((member) => [
        member.email,
        currentMember.can(ASSIGN_ROLES) &&
          role?.name !== "Member" &&
          me.id !== member.id && (
            <Button
              variant="open"
              size="xs"
              color="gray"
              onClick={() => handleRemoveMemberFromRole(member)}
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          ),
      ]);
      setRows(rows);
    } else {
      setRows([]);
    }
  }, [members, currentMember, handleRemoveMemberFromRole, role, me]);

  return (
    <div className="mb-4">
      <div className="flex-between">
        <SectionTitle title="Who's in this group" />
        {currentMember.can(ASSIGN_ROLES) && (
          <Button variant="open" onClick={() => setShowAddMembersDialog(true)}>
            Add members
          </Button>
        )}
      </div>
      {members?.length > 0 ? (
        <Table headers={["Name", ""]} rows={rows} />
      ) : (
        <NoDataMessage>There are no members in this role yet</NoDataMessage>
      )}
      <AddMembersToRoleDialog
        open={showAddMembersDialog}
        onCloseDialog={() => setShowAddMembersDialog(false)}
        membersInRole={members}
        onMembersAdded={onMembersAdded}
      />
    </div>
  );
}
