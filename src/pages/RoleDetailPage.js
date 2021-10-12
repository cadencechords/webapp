import { useCallback, useEffect, useState } from "react";

import { EDIT_ROLES } from "../utils/constants";
import EditableData from "../components/inputs/EditableData";
import PageLoading from "../components/PageLoading";
import PageTitle from "../components/PageTitle";
import PermissionsApi from "../api/permissionsApi";
import RoleMembers from "../components/RoleMembers";
import RolePermissions from "../components/RolePermissions";
import RolesApi from "../api/rolesApi";
import _ from "lodash";
import { selectCurrentMember } from "../store/authSlice";
import { useParams } from "react-router";
import { useSelector } from "react-redux";

export default function RoleDetailPage() {
	const id = useParams().id;
	const [role, setRole] = useState();
	const [permissions, setPermissions] = useState([]);
	const [loading, setLoading] = useState(false);
	const currentMember = useSelector(selectCurrentMember);

	useEffect(() => {
		document.title = "Permissions";

		async function fetchRole() {
			try {
				setLoading(true);

				let rolesResult = await RolesApi.getOne(id);
				setRole(rolesResult.data);
				document.title = `${rolesResult.data.name} | Permissions`;

				let permissionsResult = await PermissionsApi.getAll();
				setPermissions(permissionsResult.data);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		}

		fetchRole();
	}, [id]);

	function handlePermissionToggled(permissionName, checked) {
		let updatedRolePermissions = [...role.permissions];
		if (checked) {
			let permission = permissions.find((permission) => permission.name === permissionName);
			updatedRolePermissions.push(permission);
		} else {
			updatedRolePermissions = updatedRolePermissions.filter(
				(permission) => permission.name !== permissionName
			);
		}

		setRole({ ...role, permissions: updatedRolePermissions });
	}

	function handleNameChange(newName) {
		setRole((currentRole) => ({ ...currentRole, name: newName }));
		debounce("name", newName);
	}

	function handleDescriptionChange(newDescription) {
		setRole((currentRole) => ({ ...currentRole, description: newDescription }));
		debounce("description", newDescription);
	}

	function handleMemberRemoved(memberToRemove) {
		setRole((currentRole) => {
			let updatedMembers = currentRole.memberships.filter(
				(memberInRole) => memberInRole.id !== memberToRemove.id
			);
			return { ...currentRole, memberships: updatedMembers };
		});
	}

	function handleMembersAdded(membersAdded) {
		setRole((currentRole) => {
			let updatedMembers = [...currentRole.memberships, ...membersAdded];

			return {
				...currentRole,
				memberships: updatedMembers,
			};
		});
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debounce = useCallback(
		_.debounce((field, newValue) => {
			try {
				RolesApi.updateOne({ [field]: newValue }, id);
			} catch (error) {
				console.log(error);
			}
		}, 1000),
		[]
	);

	if (loading) {
		return <PageLoading />;
	} else {
		return (
			<div>
				<PageTitle
					title={role?.name}
					editable={currentMember.can(EDIT_ROLES) && !(role?.is_admin || role?.is_member)}
					onChange={handleNameChange}
					placeholder="None title provided yet"
				/>
				<EditableData
					value={role?.description}
					editable={currentMember.can(EDIT_ROLES) && !(role?.is_admin || role?.is_member)}
					placeholder="No description provided yet"
					onChange={handleDescriptionChange}
				/>
				<RoleMembers
					role={role}
					members={role?.memberships}
					onMemberRemoved={handleMemberRemoved}
					onMembersAdded={handleMembersAdded}
				/>
				<RolePermissions
					permissions={role?.permissions}
					onPermissionToggled={handlePermissionToggled}
					role={role}
				/>
			</div>
		);
	}
}
