import { DELETE_ROLES, EDIT_ROLES } from "../utils/constants";
import { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import Button from "../components/Button";
import ConfirmDeleteDialog from "../dialogs/ConfirmDeleteDialog";
import EditableData from "../components/inputs/EditableData";

import PageTitle from "../components/PageTitle";
import PermissionsApi from "../api/permissionsApi";
import RoleMembers from "../components/RoleMembers";
import RolePermissions from "../components/RolePermissions";
import RolesApi from "../api/rolesApi";
import TrashIcon from "@heroicons/react/outline/TrashIcon";
import _ from "lodash";
import { selectCurrentMember } from "../store/authSlice";
import { useSelector } from "react-redux";
import MembershipsApi from "../api/membershipsApi";

export default function RoleDetailPage() {
  const id = useParams().id;
  const [role, setRole] = useState();
  const [permissions, setPermissions] = useState([]);
  const currentMember = useSelector(selectCurrentMember);
  const [members, setMembers] = useState(() => {
    let { data: allMembers } = MembershipsApi.getAll();
    return allMembers.filter((m) => m.role.id === parseInt(id));
  });
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const router = useHistory();

  useEffect(() => {
    document.title = "Permissions";

    let rolesResult = RolesApi.getOne(id);
    setRole(rolesResult.data);
    document.title = `${rolesResult.data.name} | Permissions`;

    let permissionsResult = PermissionsApi.getAll();
    setPermissions(permissionsResult.data);
  }, [id]);

  function handlePermissionToggled(permissionName, checked) {
    let updatedRolePermissions = [...role.permissions];
    if (checked) {
      let permission = permissions.find(
        (permission) => permission.name === permissionName
      );
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
    setMembers((currentMembers) =>
      currentMembers.filter((m) => m.id !== memberToRemove.id)
    );
  }

  function handleMembersAdded(membersAdded) {
    setMembers((currentMembers) => currentMembers.concat(membersAdded));
  }

  function handleDeleteRole() {
    RolesApi.deleteOne(role.id);
    router.push("/permissions");
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounce = useCallback(
    _.debounce((field, newValue) => {
      RolesApi.updateOne({ [field]: newValue }, id);
    }, 1000),
    []
  );

  return (
    <div>
      <div className="flex-between">
        <PageTitle
          title={role?.name}
          editable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          onChange={handleNameChange}
          placeholder="None title provided yet"
        />
        {currentMember.can(DELETE_ROLES) &&
          !role?.is_admin &&
          !role?.is_member && (
            <Button
              variant="open"
              color="gray"
              onClick={() => setShowConfirmDelete(true)}
            >
              <TrashIcon className="w-5 h-5" />
            </Button>
          )}
      </div>
      <EditableData
        value={role?.description}
        editable={
          currentMember.can(EDIT_ROLES) && !(role?.is_admin || role?.is_member)
        }
        placeholder="No description provided yet"
        onChange={handleDescriptionChange}
      />
      <RoleMembers
        role={role}
        members={members}
        onMemberRemoved={handleMemberRemoved}
        onMembersAdded={handleMembersAdded}
      />
      <RolePermissions
        permissions={role?.permissions}
        onPermissionToggled={handlePermissionToggled}
        role={role}
      />
      <ConfirmDeleteDialog
        show={showConfirmDelete}
        onCloseDialog={() => setShowConfirmDelete(false)}
        onCancel={() => setShowConfirmDelete(false)}
        onConfirm={handleDeleteRole}
      >
        Deleting this role will move everyone from this role into the members
        role.
      </ConfirmDeleteDialog>
    </div>
  );
}
