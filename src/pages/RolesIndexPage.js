import { useEffect, useState } from "react";

import MemberRolesTable from "../tables/MemberRolesTable";
import PageTitle from "../components/PageTitle";
import Roles from "../components/Roles";
import RolesApi from "../api/rolesApi";
import MembershipsApi from "../api/membershipsApi";

export default function RolesIndexPage() {
  const [roles, setRoles] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    document.title = "Permissions";

    let rolesResult = RolesApi.getAll();
    setRoles(rolesResult.data);

    let membersResult = MembershipsApi.getAll();
    setMembers(membersResult.data);
  }, []);

  function handleRoleAssigned(member, roleName) {
    let role = roles.find((role) => role.name === roleName);
    let memberIndex = members.findIndex(
      (memberInList) => memberInList.id === member.id
    );
    let updatedMember = { ...members[memberIndex], role: role };

    let updatedMembers = members.slice();
    updatedMembers.splice(memberIndex, 1, updatedMember);
    const roleId = role.id;

    MembershipsApi.assignRole(member.id, roleId);
    setMembers(updatedMembers);
  }

  return (
    <>
      <PageTitle title="Permissions" />A role provides a group of users a
      defined set of abilities within the application. Each team has a default
      of at least two roles, admin and member.
      <Roles roles={roles} members={members} />
      <MemberRolesTable
        members={members}
        roles={roles}
        onRoleAssigned={handleRoleAssigned}
      />
    </>
  );
}
