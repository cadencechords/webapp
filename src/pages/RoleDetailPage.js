import { DELETE_ROLES, EDIT_ROLES } from '../utils/constants';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Button from '../components/Button';
import ConfirmDeleteDialog from '../dialogs/ConfirmDeleteDialog';
import EditableData from '../components/inputs/EditableData';
import PageLoading from '../components/PageLoading';
import PageTitle from '../components/PageTitle';
import RoleMembers from '../components/RoleMembersList';
import RolePermissions from '../components/RolePermissions';
import RolesApi from '../api/rolesApi';
import TrashIcon from '@heroicons/react/outline/TrashIcon';
import _ from 'lodash';
import { reportError } from '../utils/error';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import useRole from '../hooks/api/useRole';
import Alert from '../components/Alert';
import useDeleteRole from '../hooks/api/useDeleteRole';
import usePermissions from '../hooks/api/usePermissions';
import useCopy from '../hooks/useCopy';

export default function RoleDetailPage() {
  const id = useParams().id;
  const {
    data: originalRole,
    isLoading: isLoadingRole,
    isError: isErrorRole,
  } = useRole(id, {});

  const {
    data: permissions,
    isLoading: isLoadingPermissions,
    isError: isErrorPermissions,
  } = usePermissions();

  const currentMember = useSelector(selectCurrentMember);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const router = useHistory();
  const { run: deleteRole } = useDeleteRole({
    onSuccess: () => router.replace('/permissions'),
  });

  useEffect(() => (document.title = 'Permissions'), []);

  const [role, setRole] = useCopy(originalRole);

  function handlePermissionToggled(permissionName, checked) {
    let updatedRolePermissions = [...role.permissions];
    if (checked) {
      let permission = permissions.find(
        permission => permission.name === permissionName
      );
      updatedRolePermissions.push(permission);
    } else {
      updatedRolePermissions = updatedRolePermissions.filter(
        permission => permission.name !== permissionName
      );
    }

    setRole(previousRole => ({
      ...previousRole,
      permissions: updatedRolePermissions,
    }));
  }

  function handleChange(field, value) {
    setRole(previousRole => ({ ...previousRole, [field]: value }));
    debounce(field, value);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounce = useCallback(
    _.debounce((field, newValue) => {
      try {
        RolesApi.updateOne({ [field]: newValue }, id);
      } catch (error) {
        reportError(error);
      }
    }, 1000),
    []
  );

  if (isLoadingRole || isLoadingPermissions) return <PageLoading />;
  if (isErrorRole || isErrorPermissions)
    return <Alert color="red">There was an issue retrieving this role.</Alert>;

  return (
    <div className="mb-8">
      <div className="flex-between">
        <PageTitle
          title={role?.name}
          editable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          onChange={newValue => handleChange('name', newValue)}
          placeholder="None title provided yet"
        />
        {currentMember.can(DELETE_ROLES) &&
          !role?.is_admin &&
          !role?.is_member && (
            <Button
              size="md"
              variant="icon"
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
        onChange={newValue => handleChange('description', newValue)}
      />
      <RoleMembers role={role} members={role?.memberships} />
      <RolePermissions
        onPermissionToggled={handlePermissionToggled}
        role={role}
      />
      <ConfirmDeleteDialog
        show={showConfirmDelete}
        onCloseDialog={() => setShowConfirmDelete(false)}
        onCancel={() => setShowConfirmDelete(false)}
        onConfirm={() => deleteRole(role.id)}
      >
        Deleting this role will move everyone from this role into the members
        role.
      </ConfirmDeleteDialog>
    </div>
  );
}
