import { DELETE_ROLES, EDIT_ROLES } from '../utils/constants';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Button from '../components/Button';
import ConfirmDeleteDialog from '../dialogs/ConfirmDeleteDialog';
import EditableData from '../components/inputs/EditableData';
import PageLoading from '../components/PageLoading';
import PageTitle from '../components/PageTitle';
import RoleMembers from '../components/RoleMembersList';
import RolePermissions from '../components/RolePermissions';
import RolesApi from '../api/rolesApi';
import useDebouncedCallback from '../hooks/useDebouncedCallback';
import { reportError } from '../utils/error';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import useRole from '../hooks/api/useRole';
import Alert from '../components/Alert';
import useDeleteRole from '../hooks/api/useDeleteRole';
import usePermissions from '../hooks/api/usePermissions';
import useCopy from '../hooks/useCopy';
import Icon from '../components/Icon';
import type { RoleUpdates } from '../api/rolesApi';

export default function RoleDetailPage() {
  // The route's path declares :id.
  const id = useParams<{ id: string }>().id;
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

  // Non-null: Content renders the page only once the membership loads.
  const currentMember = useSelector(selectCurrentMember)!;
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const router = useHistory();
  const { run: deleteRole } = useDeleteRole({
    onSuccess: () => router.replace('/permissions'),
  });

  useEffect(() => {
    document.title = 'Permissions';
  }, []);

  const [role, setRole] = useCopy(originalRole);

  function handlePermissionToggled(permissionName: string, checked: boolean) {
    // Non-null: a permission is toggled only once the role has loaded, and
    // the API sends a role with its permissions.
    let updatedRolePermissions = [...role.permissions!];
    if (checked) {
      const permission = permissions.find(
        permission => permission.name === permissionName
      );
      // Non-null: the names RolePermissions toggles are the API's permissions.
      updatedRolePermissions.push(permission!);
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

  function handleChange(field: keyof RoleUpdates, value: string) {
    setRole(previousRole => ({ ...previousRole, [field]: value }));
    debounce(id, field, value);
  }

  // The id is passed in, so a waiting save goes to the role it was typed for.
  const debounce = useDebouncedCallback(
    (roleId: string, field: keyof RoleUpdates, newValue: string) => {
      try {
        RolesApi.updateOne({ [field]: newValue }, roleId);
      } catch (error) {
        reportError(error);
      }
    },
    1000,
    'flush'
  );

  if (isLoadingRole || isLoadingPermissions) return <PageLoading />;
  if (isErrorRole || isErrorPermissions)
    return <Alert color="red">There was an issue retrieving this role.</Alert>;

  const isBuiltIn = !!(role?.is_admin || role?.is_member);
  const canEdit = currentMember.can(EDIT_ROLES) && !isBuiltIn;

  // M3E: the role's name and description (editable unless it's built in),
  // a chip for built-in roles, then its members and its permissions.
  return (
    <div className="max-w-3xl mx-auto mb-8 font-plain">
      <div className="flex items-start gap-2">
        <PageTitle
          title={role?.name}
          editable={canEdit}
          onChange={newValue => handleChange('name', newValue)}
          placeholder="None title provided yet"
        />
        {currentMember.can(DELETE_ROLES) && !isBuiltIn && (
          <Button
            size="md"
            variant="icon"
            color="gray"
            name="Delete role"
            onClick={() => setShowConfirmDelete(true)}
          >
            <Icon name="delete" className="w-6 h-6" />
          </Button>
        )}
      </div>
      {/* PageTitle pads its text 8px: the rest lines up with it. */}
      <div className="flex flex-col gap-8 px-2">
        <div className="flex flex-col items-start gap-3">
          {isBuiltIn && (
            <span className="inline-flex items-center gap-2 h-8 px-3 rounded-small bg-surface-container-highest text-label-large text-on-surface-variant">
              <Icon name="lock" className="w-4 h-4" />
              Built-in role: its name and permissions can&rsquo;t change
            </span>
          )}
          <div className="w-full -mx-1">
            <EditableData
              value={role?.description}
              editable={canEdit}
              placeholder="No description provided yet"
              onChange={newValue => handleChange('description', newValue)}
            />
          </div>
        </div>
        <RoleMembers role={role} members={role?.memberships} />
        <RolePermissions
          onPermissionToggled={handlePermissionToggled}
          role={role}
        />
      </div>
      <ConfirmDeleteDialog
        show={showConfirmDelete}
        onCloseDialog={() => setShowConfirmDelete(false)}
        onCancel={() => setShowConfirmDelete(false)}
        onConfirm={() =>
          // Non-null: the delete button shows only once the role has loaded.
          deleteRole(role.id!)
        }
      >
        Deleting this role will move everyone from this role into the members
        role.
      </ConfirmDeleteDialog>
    </div>
  );
}
