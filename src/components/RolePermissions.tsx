import { EDIT_ROLES } from '../utils/constants';
import Permission from './Permission';
import SectionTitle from './SectionTitle';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import useAddPermission from '../hooks/api/useAddPermission';
import useRemovePermission from '../hooks/api/useRemovePermission';
import type { Role } from '../types';

type RolePermissionsProps = {
  /** RoleDetailPage's copy of the role, `{}` until it loads. */
  role: Partial<Role>;
  onPermissionToggled: (permissionName: string, checked: boolean) => void;
};

export default function RolePermissions({
  role,
  onPermissionToggled,
}: RolePermissionsProps) {
  const { permissions } = role;
  // Non-null: RoleDetailPage renders inside Content, which renders nothing
  // until the membership loads.
  const currentMember = useSelector(selectCurrentMember)!;

  const { run: addPermission } = useAddPermission();
  const { run: removePermission } = useRemovePermission();

  function isPermissionEnabled(permissionName: string) {
    const permission = permissions?.find(
      permission => permission.name === permissionName
    );

    return !!permission;
  }

  function handlePermissionToggled(
    permissionName: string,
    checkedValue: boolean
  ) {
    onPermissionToggled(permissionName, checkedValue);
    // Non-null (both): a permission is toggled only once the role has loaded,
    // so it has its id.
    if (checkedValue) {
      addPermission({ roleId: role.id!, permissionName });
    } else {
      removePermission({ roleId: role.id!, permissionName });
    }
  }

  const checkable =
    currentMember.can(EDIT_ROLES) && !(role?.is_admin || role?.is_member);

  // Each group of permissions under a section title, as a segmented list of
  // switch rows.
  return (
    <div className="flex flex-col gap-6">
      {GROUPS.map(group => (
        <section key={group.title}>
          <SectionTitle title={group.title} />
          <div className="list-segmented">
            {group.permissions.map(({ permission, name, description }) => (
              <Permission
                key={permission}
                checkable={checkable}
                checked={isPermissionEnabled(permission)}
                name={name}
                description={description}
                onChange={checkedValue =>
                  handlePermissionToggled(permission, checkedValue)
                }
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

// The API's permission names, with how each shows: folders are binders and
// saved formats are format presets there.
const GROUPS: {
  title: string;
  permissions: { permission: string; name: string; description: string }[];
}[] = [
  {
    title: 'Song permissions',
    permissions: [
      {
        permission: 'Add songs',
        name: 'Add songs',
        description:
          'User can create new songs or import them from other sources',
      },
      {
        permission: 'Edit songs',
        name: 'Edit songs',
        description: 'User can edit songs',
      },
      {
        permission: 'Delete songs',
        name: 'Delete songs',
        description: 'User can delete songs',
      },
      {
        permission: 'View songs',
        name: 'View songs',
        description: 'User can view songs',
      },
      {
        permission: 'Export songs',
        name: 'Export songs',
        description:
          'Allow user to export songs from this team to another team',
      },
    ],
  },
  {
    title: 'Folder permissions',
    permissions: [
      {
        permission: 'Add binders',
        name: 'Add folders',
        description: 'User can create new folders',
      },
      {
        permission: 'Edit binders',
        name: 'Edit folders',
        description:
          'User can edit folders, including adding and removing songs',
      },
      {
        permission: 'Delete binders',
        name: 'Delete folders',
        description: 'User can delete folders',
      },
      {
        permission: 'View binders',
        name: 'View folders',
        description: 'User can view folders',
      },
    ],
  },
  {
    title: 'Set permissions',
    permissions: [
      {
        permission: 'Add sets',
        name: 'Add sets',
        description: 'User can create new sets',
      },
      {
        permission: 'Edit sets',
        name: 'Edit sets',
        description: 'User can edit sets, including adding and removing songs',
      },
      {
        permission: 'Delete sets',
        name: 'Delete sets',
        description: 'User can delete sets',
      },
      {
        permission: 'View sets',
        name: 'View sets',
        description: 'User can view sets',
      },
      {
        permission: 'Publish sets',
        name: 'Publish sets',
        description: 'User can publish and unpublish sets',
      },
    ],
  },
  {
    title: 'Session permissions',
    permissions: [
      {
        permission: 'Start sessions',
        name: 'Start sessions',
        description: 'User can start new sessions for sets',
      },
    ],
  },
  {
    title: 'Role permissions',
    permissions: [
      {
        permission: 'Add roles',
        name: 'Add roles',
        description: 'User can create new roles',
      },
      {
        permission: 'Edit roles',
        name: 'Edit roles',
        description:
          'User can edit roles, including adding and removing permissions',
      },
      {
        permission: 'Delete roles',
        name: 'Delete roles',
        description: 'User can delete roles',
      },
      {
        permission: 'View roles',
        name: 'View roles',
        description: 'User can view roles',
      },
      {
        permission: 'Assign roles',
        name: 'Assign roles',
        description: 'User can assign members new roles',
      },
    ],
  },
  {
    title: 'Member permissions',
    permissions: [
      {
        permission: 'Add members',
        name: 'Add members',
        description: 'User can add new members to the team',
      },
      {
        permission: 'Remove members',
        name: 'Remove members',
        description: 'User can remove members from the team',
      },
    ],
  },
  {
    title: 'Event permissions',
    permissions: [
      {
        permission: 'Add events',
        name: 'Add events',
        description: 'User can add events to the calendar',
      },
      {
        permission: 'Edit events',
        name: 'Edit events',
        description: 'User can edit existing events on the calendar',
      },
      {
        permission: 'Delete events',
        name: 'Delete events',
        description: 'User can delete/cancel events on the calendar',
      },
      {
        permission: 'View events',
        name: 'View events',
        description: 'User can view events on the calendar',
      },
    ],
  },
  {
    title: 'File permissions',
    permissions: [
      {
        permission: 'Add files',
        name: 'Add files',
        description: 'User can add or attach files to a song',
      },
      {
        permission: 'Edit files',
        name: 'Edit files',
        description: 'User can edit and change the name of existing file names',
      },
      {
        permission: 'Delete files',
        name: 'Delete files',
        description: 'User can delete/unattach files from a song',
      },
      {
        permission: 'View files',
        name: 'View files',
        description: 'User can view/download files attached to a song',
      },
    ],
  },
  {
    title: 'Saved formats',
    permissions: [
      {
        permission: 'Add format presets',
        name: 'Save format preset',
        description:
          'User can save formats that can be applied to other songs, sets or the entire library',
      },
      {
        permission: 'Edit format presets',
        name: 'Edit format preset',
        description: 'User can edit a saved format',
      },
      {
        permission: 'Delete format presets',
        name: 'Delete format preset',
        description: 'User can delete a saved format',
      },
    ],
  },
  {
    title: 'Billing permissions',
    permissions: [
      {
        permission: 'Manage billing',
        name: 'Manage billing',
        description:
          'User can manage billing for the team as well as upgrade/downgrade tiers',
      },
    ],
  },
];
