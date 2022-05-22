import { useEffect, useState } from "react";

import { ASSIGN_ROLES } from "../utils/constants";
import MembershipsApi from "../api/membershipsApi";
import SectionTitle from "../components/SectionTitle";
import StyledListBox from "../components/StyledListBox";
import Table from "../components/Table";
import { selectCurrentMember } from "../store/authSlice";
import { useSelector } from "react-redux";

export default function MemberRolesTable({ roles, members, onRoleAssigned }) {
  const headers = ["Name", ""];
  const [roleOptions, setRoleOptions] = useState([]);
  const currentMember = useSelector(selectCurrentMember);
  const [me] = useState(() => MembershipsApi.getMyMember().data);

  useEffect(() => {
    if (roles) {
      let roleOptions = roles?.map((role) => ({
        value: role.name,
        template: role.name,
      }));
      setRoleOptions(roleOptions);
    }
  }, [roles]);

  const convertToRow = (member) => {
    return [
      member.email,
      currentMember.can(ASSIGN_ROLES) && me.id !== member.id ? (
        <StyledListBox
          options={roleOptions}
          selectedOption={{
            value: member.role.name,
            template: member.role.name,
          }}
          onChange={(option) => onRoleAssigned(member, option)}
        />
      ) : (
        member.role.name
      ),
    ];
  };
  const rows = members
    ? members.map((member) => convertToRow(member, roles))
    : [];

  return (
    <>
      <SectionTitle title="Members" />
      <Table headers={headers} rows={rows} />
    </>
  );
}
