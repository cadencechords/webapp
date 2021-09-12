import { useEffect, useState } from "react";

import MembershipsApi from "../api/membershipsApi";
import SectionTitle from "../components/SectionTitle";
import StyledListBox from "../components/StyledListBox";
import Table from "../components/Table";

export default function MemberRolesTable({ roles, members, onRoleAssigned }) {
	const headers = ["Name", ""];
	const [roleOptions, setRoleOptions] = useState([]);
	const rows = members ? members.map((member) => convertToRow(member, roles)) : [];

	useEffect(() => {
		if (roles) {
			let roleOptions = roles?.map((role) => ({ value: role.name, template: role.name }));
			setRoleOptions(roleOptions);
		}
	}, [roles]);

	function convertToRow(member) {
		return [
			member.user.email,
			<StyledListBox
				options={roleOptions}
				selectedOption={{ value: member.role.name, template: member.role.name }}
				onChange={(option) => handleAssignRole(member, option)}
			/>,
		];
	}

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
