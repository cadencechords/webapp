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

	useEffect(() => {
		if (roles) {
			let roleOptions = roles?.map((role) => ({ value: role.name, template: role.name }));
			setRoleOptions(roleOptions);
		}
	}, [roles]);

	const convertToRow = (member) => {
		return [
			member.user.email,
			currentMember.can(ASSIGN_ROLES) ? (
				<StyledListBox
					options={roleOptions}
					selectedOption={{ value: member.role.name, template: member.role.name }}
					onChange={(option) => handleAssignRole(member, option)}
				/>
			) : (
				member.role.name
			),
		];
	};
	const rows = members ? members.map((member) => convertToRow(member, roles)) : [];

	async function handleAssignRole(member, role) {
		try {
			onRoleAssigned(member, role);
			await MembershipsApi.assignRole(member.id, role);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<>
			<SectionTitle title="Members" />
			<Table headers={headers} rows={rows} />
		</>
	);
}
