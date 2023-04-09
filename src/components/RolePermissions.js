import { EDIT_ROLES } from '../utils/constants';
import Permission from './Permission';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import useAddPermission from '../hooks/api/useAddPermission';
import useRemovePermission from '../hooks/api/useRemovePermission';

export default function RolePermissions({ role, onPermissionToggled }) {
  const { permissions } = role;
  const currentMember = useSelector(selectCurrentMember);

  const { run: addPermission } = useAddPermission();
  const { run: removePermission } = useRemovePermission();

  function isPermissionEnabled(permissionName) {
    let permission = permissions?.find(
      permission => permission.name === permissionName
    );

    return !!permission;
  }

  function handlePermissionToggled(permissionName, checkedValue) {
    onPermissionToggled(permissionName, checkedValue);
    if (checkedValue) {
      addPermission({ roleId: role.id, permissionName });
    } else {
      removePermission({ roleId: role.id, permissionName });
    }
  }

  return (
    <div>
      <div className="pt-3 mt-12 mb-3 text-lg font-semibold border-t flex-between dark:border-dark-gray-600">
        Song permissions
      </div>
      <div>
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Add songs')}
          name="Add songs"
          description="User can create new songs or import them from other sources"
          onChange={checkedValue =>
            handlePermissionToggled('Add songs', checkedValue)
          }
        />
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Edit songs')}
          name="Edit songs"
          description="User can edit songs"
          onChange={checkedValue =>
            handlePermissionToggled('Edit songs', checkedValue)
          }
        />
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Delete songs')}
          name="Delete songs"
          description="User can delete songs"
          onChange={checkedValue =>
            handlePermissionToggled('Delete songs', checkedValue)
          }
        />
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('View songs')}
          name="View songs"
          description="User can view songs"
          onChange={checkedValue =>
            handlePermissionToggled('View songs', checkedValue)
          }
        />
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Export songs')}
          name="Export songs"
          description="Allow user to export songs from this team to another team"
          onChange={checkedValue =>
            handlePermissionToggled('Export songs', checkedValue)
          }
        />
      </div>

      <div className="pt-3 mt-8 mb-3 text-lg font-semibold border-t flex-between dark:border-dark-gray-600">
        Binder permissions
      </div>
      <div>
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Add binders')}
          name="Add binders"
          description="User can create new binders"
          onChange={checkedValue =>
            handlePermissionToggled('Add binders', checkedValue)
          }
        />
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Edit binders')}
          name="Edit binders"
          description="User can edit binders, including adding and removing songs"
          onChange={checkedValue =>
            handlePermissionToggled('Edit binders', checkedValue)
          }
        />
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Delete binders')}
          name="Delete binders"
          description="User can delete binders"
          onChange={checkedValue =>
            handlePermissionToggled('Delete binders', checkedValue)
          }
        />
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('View binders')}
          name="View binders"
          description="User can view binders"
          onChange={checkedValue =>
            handlePermissionToggled('View binders', checkedValue)
          }
        />
      </div>

      <div className="pt-3 mt-8 mb-3 text-lg font-semibold border-t flex-between dark:border-dark-gray-600">
        Set permissions
      </div>
      <div>
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Add sets')}
          name="Add sets"
          description="User can create new sets"
          onChange={checkedValue =>
            handlePermissionToggled('Add sets', checkedValue)
          }
        />
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Edit sets')}
          name="Edit sets"
          description="User can edit sets, including adding and removing songs"
          onChange={checkedValue =>
            handlePermissionToggled('Edit sets', checkedValue)
          }
        />
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Delete sets')}
          name="Delete sets"
          description="User can delete sets"
          onChange={checkedValue =>
            handlePermissionToggled('Delete sets', checkedValue)
          }
        />
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('View sets')}
          name="View sets"
          description="User can view sets"
          onChange={checkedValue =>
            handlePermissionToggled('View sets', checkedValue)
          }
        />
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Publish sets')}
          name="Publish sets"
          description="User can publish and unpublish sets"
          onChange={checkedValue =>
            handlePermissionToggled('Publish sets', checkedValue)
          }
        />
      </div>

      <div className="pt-3 mt-8 mb-3 text-lg font-semibold border-t flex-between dark:border-dark-gray-600">
        Session permissions
      </div>
      <div>
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Start sessions')}
          name="Start sessions"
          description="User can start new sessions for sets"
          onChange={checkedValue =>
            handlePermissionToggled('Start sessions', checkedValue)
          }
        />
      </div>

      <div className="pt-3 mt-8 mb-3 text-lg font-semibold border-t flex-between dark:border-dark-gray-600">
        Role permissions
      </div>
      <div>
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Add roles')}
          name="Add roles"
          description="User can create new roles"
          onChange={checkedValue =>
            handlePermissionToggled('Add roles', checkedValue)
          }
        />
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Edit roles')}
          name="Edit roles"
          description="User can edit roles, including adding and removing permissions"
          onChange={checkedValue =>
            handlePermissionToggled('Edit roles', checkedValue)
          }
        />
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Delete roles')}
          name="Delete roles"
          description="User can delete roles"
          onChange={checkedValue =>
            handlePermissionToggled('Delete roles', checkedValue)
          }
        />
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('View roles')}
          name="View roles"
          description="User can view roles"
          onChange={checkedValue =>
            handlePermissionToggled('View roles', checkedValue)
          }
        />
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Assign roles')}
          name="Assign roles"
          description="User can assign members new roles"
          onChange={checkedValue =>
            handlePermissionToggled('Assign roles', checkedValue)
          }
        />
      </div>

      <div className="pt-3 mt-8 mb-3 text-lg font-semibold border-t flex-between dark:border-dark-gray-600">
        Member permissions
      </div>
      <div>
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Add members')}
          name="Add members"
          description="User can add new members to the team"
          onChange={checkedValue =>
            handlePermissionToggled('Add members', checkedValue)
          }
        />
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Remove members')}
          name="Remove members"
          description="User can remove members from the team"
          onChange={checkedValue =>
            handlePermissionToggled('Remove members', checkedValue)
          }
        />
      </div>

      <div className="pt-3 mt-8 mb-3 text-lg font-semibold border-t flex-between dark:border-dark-gray-600">
        Event permissions
      </div>
      <div>
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Add events')}
          name="Add events"
          description="User can add events to the calendar"
          onChange={checkedValue =>
            handlePermissionToggled('Add events', checkedValue)
          }
        />
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Edit events')}
          name="Edit events"
          description="User can edit existing events on the calendar"
          onChange={checkedValue =>
            handlePermissionToggled('Edit events', checkedValue)
          }
        />
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Delete events')}
          name="Delete events"
          description="User can delete/cancel events on the calendar"
          onChange={checkedValue =>
            handlePermissionToggled('Delete events', checkedValue)
          }
        />
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('View events')}
          name="View events"
          description="User can view events on the calendar"
          onChange={checkedValue =>
            handlePermissionToggled('View events', checkedValue)
          }
        />
      </div>

      <div className="pt-3 mt-8 mb-3 text-lg font-semibold border-t flex-between dark:border-dark-gray-600">
        File permissions
      </div>
      <div>
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Add files')}
          name="Add files"
          description="User can add or attach files to a song"
          onChange={checkedValue =>
            handlePermissionToggled('Add files', checkedValue)
          }
        />
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Edit files')}
          name="Edit files"
          description="User can edit and change the name of existing file names"
          onChange={checkedValue =>
            handlePermissionToggled('Edit files', checkedValue)
          }
        />
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Delete files')}
          name="Delete files"
          description="User can delete/unattach files from a song"
          onChange={checkedValue =>
            handlePermissionToggled('Delete files', checkedValue)
          }
        />
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('View files')}
          name="View files"
          description="User can view/download files attached to a song"
          onChange={checkedValue =>
            handlePermissionToggled('View files', checkedValue)
          }
        />
      </div>

      <div className="pt-3 mt-8 mb-3 text-lg font-semibold border-t flex-between dark:border-dark-gray-600">
        Billing permissions
      </div>
      <div>
        <Permission
          checkable={
            currentMember.can(EDIT_ROLES) &&
            !(role?.is_admin || role?.is_member)
          }
          checked={isPermissionEnabled('Manage billing')}
          name="Manage billing"
          description="User can manage billing for the team as well as upgrade/downgrade tiers"
          onChange={checkedValue =>
            handlePermissionToggled('Manage billing', checkedValue)
          }
        />
      </div>
    </div>
  );
}
