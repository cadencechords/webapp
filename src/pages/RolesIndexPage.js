import { useEffect, useState } from "react";

import MemberRolesTable from "../tables/MemberRolesTable";
import PageLoading from "../components/PageLoading";
import PageTitle from "../components/PageTitle";
import Roles from "../components/Roles";
import RolesApi from "../api/rolesApi";
import TeamApi from "../api/TeamApi";

export default function RolesIndexPage() {
	const [roles, setRoles] = useState([]);
	const [loading, setLoading] = useState(false);
	const [members, setMembers] = useState([]);

	useEffect(() => {
		document.title = "Permissions";
		async function fetchData() {
			try {
				setLoading(true);
				let rolesResult = await RolesApi.getAll();
				setRoles(rolesResult.data);

				let membersResult = await TeamApi.getMemberships();
				setMembers(membersResult.data);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	async function handleRoleAssigned(member, roleName) {
		let role = roles.find((role) => role.name === roleName);
		let memberIndex = members.findIndex((memberInList) => memberInList.id === member.id);
		let updatedMember = { ...members[memberIndex], role: role };

		let updatedMembers = members.slice();
		updatedMembers.splice(memberIndex, 1, updatedMember);

		setMembers(updatedMembers);

		let rolesResult = await RolesApi.getAll();
		setRoles(rolesResult.data);
	}

	if (loading) {
		return <PageLoading />;
	} else {
		return (
			<>
				<PageTitle title="Permissions" />A role provides a group of users a defined set of abilities
				within the application. Each team has a default of at least two roles, admin and member.
				<Roles roles={roles} />
				<MemberRolesTable members={members} roles={roles} onRoleAssigned={handleRoleAssigned} />
			</>
		);
	}
}
